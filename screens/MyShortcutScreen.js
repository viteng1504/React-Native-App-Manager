import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import Colors from '../styles/Colors';
import AppFolder from '../components/UI/MyShortcutScreen/AppFolder';

const getAllData = async () => {
  let allData = [];
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length > 0) {
      const multiGetData = await AsyncStorage.multiGet(keys);

      // console.log(multiGetData);

      allData = multiGetData
        .map(([key, value]) => {
          try {
            return JSON.parse(value); // Parse each JSON string to an object
          } catch (e) {
            console.error('Error parsing JSON', e);
            return null; // If parsing fails, return null
          }
        })
        .filter(item => item !== null); // Filter out any null values
    }
  } catch (error) {
    console.error('Error retrieving data', error);
  }

  return allData;
};

function MyShortcutScreen({navigation}) {
  const [data, setData] = useState([]);
  const [screenHeight, setScreenHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const retrievedData = await getAllData();
    setData(retrievedData);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim() === '') {
      alert('Folder name cannot be empty!');
      return;
    }

    const newFolder = {
      appFolderName: newFolderName,
      apps: [],
    };

    const folderData = await AsyncStorage.getItem(newFolderName);
    if (folderData == null) {
      const jsonValue = JSON.stringify(newFolder);
      await AsyncStorage.setItem(newFolder.appFolderName, jsonValue);
      setData(prevData => [
        ...prevData.filter(item => item !== null),
        newFolder,
      ]);
    } else {
      alert('Folder has already been created!!!');
    }

    setModalVisible(false);
    setNewFolderName('');
  };

  const handleRemoveItem = (folderName, itemKey) => {
    setData(prevData =>
      prevData.map(folder => {
        if (folder.appFolderName === folderName) {
          return {
            ...folder,
            apps: folder.apps.filter(app => app.packageName !== itemKey),
          };
        }
        return folder;
      }),
    );
  };

  const handleRemoveFolder = async folderName => {
    await AsyncStorage.removeItem(folderName);
    setData(prevData =>
      prevData.filter(folder => folder.appFolderName !== folderName),
    );
  };

  const handleRenameFolder = async (oldFolderName, newwFolderName) => {
    try {
      setData(prevData =>
        prevData.map(folder => {
          if (folder.appFolderName === oldFolderName) {
            handleRemoveFolder(oldFolderName);
            return {
              ...folder,
              appFolderName: newwFolderName,
            };
          }
          return folder;
        }),
      );
      alert(`Folder "${oldFolderName}" renamed to "${newwFolderName}"`);
    } catch (error) {
      console.error('Error renaming folder:', error);
      alert('An error occurred while renaming folder');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Create Folder" onPress={() => setModalVisible(true)} />
      <FlatList
        data={data}
        keyExtractor={item => item.appFolderName}
        renderItem={({item}) => (
          <AppFolder
            appFolderName={item.appFolderName}
            appFolderData={item.apps}
            onRemoveItem={itemKey =>
              handleRemoveItem(item.appFolderName, itemKey)
            }
            onRemoveFolder={handleRemoveFolder}
            onRenameFolder={handleRenameFolder}
            screenHeight={screenHeight}
            nestedScrollEnabled={true}
            style={styles.folder}
          />
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Create New Folder</Text>
            <TextInput
              style={styles.input}
              placeholder="Folder Name"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateFolder}>
              <Text style={styles.textStyle}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, styles.cancelButton]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default MyShortcutScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.appBackgroundColor,
    flex: 1,
  },
  text: {
    color: Colors.Text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  input: {
    width: '100%',
    borderColor: Colors.Text,
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#5dcad6',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
