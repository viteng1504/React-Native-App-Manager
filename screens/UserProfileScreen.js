import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/auth-context';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const UserProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const loadProfile = () => {
      try {
        const storedName = authCtx.username;
        const storedEmail = authCtx.email;
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
      } catch (e) {
        console.error('Failed to load profile.', e);
      }
    };

    loadProfile();
  }, [authCtx.username, authCtx.email]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const changePasswordHandler = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    authCtx.changePassword(oldPassword, newPassword)
      .then(() => {
        Alert.alert('Success', 'Password changed successfully');
        toggleModal();
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Image
          style={styles.profilePicture}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
        <TouchableOpacity style={styles.changePasswordButton} onPress={toggleModal}>
          <Text style={styles.changePasswordButtonText}>
            Change Password
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text>UserName</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
        />
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={false}
        />
        <Text style={styles.note}>Email cannot be changed</Text>
      </View>
      <Button title="Save" color="gray" />
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TextInput
            style={styles.modalInput}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Old Password"
            secureTextEntry
          />
          <TextInput
            style={styles.modalInput}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
          />
          <TextInput
            style={styles.modalInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            secureTextEntry
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={changePasswordHandler}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={toggleModal}>
              <Text style={[styles.modalButtonText, styles.modalCancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  changePasswordButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 10,
    width: '80%',
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
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#5dcad6',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: 'gray',
  },
  modalCancelButtonText: {
    color: '#fff',
  },
});

export default UserProfileScreen;
