import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import Icon from 'react-native-vector-icons/Ionicons';

const removeItem = async (itemKey, folderName, onRemove) => {
  try {
    const allData = await AsyncStorage.getItem(folderName);
    const folderData = JSON.parse(allData);
    const updatedApps = folderData.apps.filter(
      app => app.packageName !== itemKey,
    );
    folderData.apps = updatedApps;

    await AsyncStorage.setItem(folderName, JSON.stringify(folderData));
    onRemove(itemKey); // Notify the parent to update the state
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

const openApp = packageName => {
  RNLauncherKitHelper.launchApplication(packageName);
};

const handleDownload = packageName => {
  const url = `market://details?id=${packageName}`;
  Linking.openURL(url).catch(err => console.error('An error occurred', err));
};

const checkAppInstalled = async packageName => {
  try {
    const appInstalled = await RNLauncherKitHelper.checkIfPackageInstalled(
      packageName,
    );
    return appInstalled;
  } catch (error) {
    console.error('Error checking app installation:', error);
    return false;
  }
};

const AppItem = ({item, folderName, onRemove}) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(true);

  const getDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  useEffect(() => {
    checkAppInstalled(item.packageName).then(installed =>
      setIsAppInstalled(installed),
    );
  }, [item.packageName]);

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: isAppInstalled ? '#5dcad6' : '#ccc'}, // Change background color based on app installation
      ]}
      onPress={() => openApp(item.packageName)}
      disabled={!isAppInstalled}>
      <View style={styles.itemContent}>
        <Image
          source={{uri: `data:image/png;base64,${item.icon}`}}
          style={styles.icon}
        />
        <Text style={styles.title}>{item.label}</Text>
      </View>
      <TouchableOpacity style={styles.setting} onPress={toggleOptions}>
        <Icon name="ellipsis-horizontal" size={30} color="gray" />
      </TouchableOpacity>
      <Modal
        visible={isOptionsVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleDownload(item.packageName)}>
            <Text style={styles.optionText}>Open in store</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => removeItem(item.packageName, folderName, onRemove)}>
            <Text style={styles.optionText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={toggleOptions}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 100,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    borderRadius: 15,
    height: 50,
    width: 50,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  setting: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(172, 144, 144, 0.4)', // Semi-transparent background
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  option: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AppItem;
