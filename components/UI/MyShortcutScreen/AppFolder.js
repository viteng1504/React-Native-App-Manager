import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppItem from './AppItem';

const screenHeight = Dimensions.get('window').height;

const deleteFolder = async (appFolderName, onRemoveFolder) => {
  const folderKey = JSON.stringify(appFolderName);
  await AsyncStorage.removeItem(folderKey);
  onRemoveFolder(appFolderName);
};

const renameFolder = async (appFolderName, newFolderName, onRenameFolder) => {
  try {
    const folderData = await AsyncStorage.getItem(appFolderName);
    if (folderData) {
      const oldData = JSON.parse(folderData);
      oldData.appFolderName = newFolderName;
      const newData = JSON.stringify(oldData);
      const newFolderKey = JSON.stringify(newFolderName);
      await AsyncStorage.setItem(newFolderKey, newData);
      console.log(folderData);

      await AsyncStorage.removeItem(appFolderName);
    }
  } catch (error) {
    console.error('Error renaming folder:', error);
  }
  onRenameFolder(appFolderName, newFolderName);
};

const Folder = ({appFolderName, onPress, onDeletePress, onEditPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.folderHeader}>
    <View style={styles.folderHeaderText}>
      <Icon name="folder" size={30} color="gray" />
      <Text style={styles.folderName}>{appFolderName}</Text>
    </View>
    <View style={styles.folderSettingContainer}>
      <TouchableOpacity onPress={onEditPress} style={styles.folderSetting}>
        <Icon name="create" size={30} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeletePress} style={styles.folderSetting}>
        <Icon name="ellipsis-horizontal" size={30} color="gray" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const FolderContainer = ({appFolderData, appFolderName, onRemoveItem}) => (
  <View style={styles.container}>
    {appFolderData.map(item => (
      <AppItem
        key={item.packageName}
        item={item}
        folderName={appFolderName}
        onRemove={onRemoveItem}
      />
    ))}
  </View>
);

function AppFolder({
  appFolderName,
  appFolderData,
  onRemoveItem,
  onRemoveFolder,
  onRenameFolder,
}) {
  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the folder "${appFolderName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteFolder(appFolderName, onRemoveFolder),
          style: 'destructive',
        },
      ],
    );
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleRenamePress = () => {
    if (newFolderName.trim() !== '') {
      renameFolder(appFolderName, newFolderName, onRenameFolder);
      console.log(123);
      closeModal();
    }
  };

  const animateHeight = useCallback(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? screenHeight / 2 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, animatedHeight]);

  useEffect(() => {
    animateHeight();
  }, [expanded, animateHeight]);

  return (
    <View style={styles.folder}>
      <Folder
        appFolderName={appFolderName}
        onPress={handlePress}
        onDeletePress={handleDeletePress}
        onEditPress={openModal}
      />
      <Animated.View style={[styles.folderContainer, {height: animatedHeight}]}>
        {expanded && (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            nestedScrollEnabled={true}>
            <FolderContainer
              appFolderData={appFolderData}
              appFolderName={appFolderName}
              onRemoveItem={onRemoveItem}
            />
          </ScrollView>
        )}
      </Animated.View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Folder</Text>
            <TextInput
              style={styles.input}
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Enter new folder name"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleRenamePress}>
              <Text style={styles.modalButtonText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={closeModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  folder: {
    backgroundColor: '#f0ecec',
    marginVertical: 5,
    padding: 6,
    borderRadius: 10,
    width: '100%',
    height: 'auto',
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  folderHeaderText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  folderSettingContainer: {
    flexDirection: 'row',
  },
  folderSetting: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 164, 164, 0.2)', // Semi-transparent background
    zIndex: 1,
    marginLeft: 10,
  },
  folderContainer: {
    overflow: 'hidden',
    backgroundColor: '#ddd8d8',
    borderRadius: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Ensure the content aligns nicely
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#5dcad6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
});

export default AppFolder;
