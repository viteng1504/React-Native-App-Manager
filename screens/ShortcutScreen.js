import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Linking,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InstalledApps} from 'react-native-launcher-kit';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppModel from './AppModel';

const handleDownload = packageName => {
  const url = `market://details?id=${packageName}`;
  Linking.openURL(url).catch(err => console.error('An error occurred', err));
};

const fetchFolders = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const folders = await AsyncStorage.multiGet(keys);
  return folders.map(([key, value]) => JSON.parse(value));
};

const AppListScreen = () => {
  const [apps, setApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderModalVisible, setFolderModalVisible] = useState(false);

  const navigation = useNavigation();

  const saveAppToLocalStorage = async (app, folderName) => {
    try {
      const folderData = await AsyncStorage.getItem(folderName);
      let appFolder;
      if (folderData == null) {
        // Folder does not exist, create a new one
        appFolder = {
          appFolderName: folderName,
          apps: [],
        };
      } else {
        // Folder exists, parse the existing data
        appFolder = JSON.parse(folderData);
      }

      // Check if the app already exists in the folder
      const existingApp = appFolder.apps.find(
        a => a.packageName === app.packageName,
      );
      if (existingApp == null) {
        // App does not exist, save app data
        const appData = {
          packageName: app.packageName,
          label: app.label,
          icon: app.icon,
        };

        // Add the app to the folder
        appFolder.apps.push(appData);

        // Save the updated folder back to AsyncStorage
        const jsonValue = JSON.stringify(appFolder);
        await AsyncStorage.setItem(folderName, jsonValue);

        alert('App saved successfully!!!');
      } else {
        alert('App has already been saved in this folder!!!');
      }
    } catch (error) {
      console.error('Failed to save the app', error);
    }

    closeModal();
    navigation.navigate('MyShortcut');
  };

  const opacity = useRef(new Animated.Value(0)).current;

  const filteredApps = apps.filter(app =>
    app.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    async function fetchApps() {
      const installedApps = await InstalledApps.getSortedApps();
      const uniqueApps = Array.from(
        new Set(installedApps.map(app => app.packageName)),
      ).map(packageName => {
        const app = installedApps.find(app => app.packageName === packageName);
        return new AppModel(app.packageName, app.label, app.icon);
      });
      setApps(uniqueApps);
    }
    fetchApps();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchFolderList() {
        const folderList = await fetchFolders();
        setFolders(folderList);
      }
      fetchFolderList();
    }, []),
  );

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedApp(item);
        setFolderModalVisible(true);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }}
      style={[
        styles.itemContainer,
        {backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff'},
      ]}>
      <Image
        source={{uri: `data:image/png;base64,${item.icon}`}}
        style={{width: 50, height: 50, marginRight: 10}}
      />
      <View>
        <Text>{item.label}</Text>
        <Text>{item.packageName}</Text>
      </View>
    </TouchableOpacity>
  );

  const getDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  const closeModal = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setFolderModalVisible(false);
    });
  };

  const handleFolderSelect = folderName => {
    if (selectedApp) {
      saveAppToLocalStorage(selectedApp, folderName);
    }
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredApps}
        keyExtractor={item => item.packageName}
        renderItem={renderItem}
      />

      {selectedApp && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={folderModalVisible}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <Animated.View style={[styles.modalOverlay, {opacity}]}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Day: {getDate()}</Text>
                  <Text style={styles.modalTitle}>App Details</Text>
                  <Text style={styles.modalAppLabel}>{selectedApp.label}</Text>
                  <Text style={styles.modalAppPackage}>
                    {selectedApp.packageName}
                  </Text>
                  <Image
                    source={{uri: `data:image/png;base64,${selectedApp.icon}`}}
                    style={styles.modalAppIcon}
                  />
                  <Text style={styles.modalTitle}>
                    Select Folder To Save App
                  </Text>
                  <View style={styles.folderListContainer}>
                    <FlatList
                      data={folders}
                      keyExtractor={item => item.appFolderName}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => handleFolderSelect(item.appFolderName)}
                          style={styles.folderItem}>
                          <Icon
                            name="folder"
                            size={30}
                            color="gray"
                            style={styles.folderIcon}
                          />
                          <Text style={styles.folderItemText}>
                            {item.appFolderName}
                          </Text>
                        </TouchableOpacity>
                      )}
                      style={styles.folderList}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  searchInput: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalAppLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalAppPackage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  modalAppIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  folderListContainer: {
    width: '100%',
    height: 200,
  },
  folderList: {
    width: '100%',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#d6cccc',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  folderIcon: {
    marginRight: 10,
  },

  folderItemText: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AppListScreen;
