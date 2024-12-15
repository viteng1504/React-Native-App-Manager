import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/auth-context';
import Colors from '../styles/Colors';
import {firebase} from '../firebaseConfig';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [showSyncConfirmation, setShowSyncConfirmation] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigationToMain = () => {
    navigation.navigate('Main');
  };

  const navigationToUser = () => {
    navigation.navigate('UserProfile');
  };

  const logout = () => {
    authCtx.logout();
    navigation.navigate('Main');
  };

  const syncApplications = () => {
    setShowSyncConfirmation(true);
    setShowOverlay(true);
  };

  const confirmSync = async () => {
    setShowSyncConfirmation(false);
    setShowOverlay(false);
    try {
      // Thực hiện đồng bộ ứng dụng ở đây
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);

      // Cập nhật Firestore
      const userId = authCtx.userId; // Lấy userId từ context hoặc auth
      await firebase
        .firestore()
        .collection('user')
        .doc(userId)
        .update({
          userData: JSON.stringify(allData),
        });

      Alert.alert('Success', 'Data synced successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync data');
    }
  };

  const cancelSync = () => {
    setShowSyncConfirmation(false);
    setShowOverlay(false);
  };

  // lấy app từ firestore về
  const getApplications = async () => {
    try {
      const userId = authCtx.userId;
      const doc = await firebase
        .firestore()
        .collection('user')
        .doc(userId)
        .get();

      if (doc.exists) {
        const firestoreData = JSON.parse(doc.data().userData);

        // Lặp qua từng mục trong firestoreData
        for (const [folderName, folderContentStr] of firestoreData) {
          const folderContent = JSON.parse(folderContentStr);
          let existingFolder = await AsyncStorage.getItem(folderName);

          if (existingFolder) {
            let existingFolderData = JSON.parse(existingFolder);

            // Kiểm tra xem folder có tồn tại trong AsyncStorage không
            if (!existingFolderData) {
              existingFolderData = {
                appFolderName: folderName,
                apps: [],
              };
            }

            // Kiểm tra xem có apps nào mới không
            folderContent.apps.forEach(app => {
              if (
                !existingFolderData.apps.some(
                  existingApp => existingApp.packageName === app.packageName,
                )
              ) {
                existingFolderData.apps.push(app);
              }
            });

            // Lưu lại dữ liệu của folder vào AsyncStorage
            await AsyncStorage.setItem(
              folderName,
              JSON.stringify(existingFolderData),
            );
          } else {
            // Nếu folder chưa tồn tại, lưu dữ liệu của folder vào AsyncStorage
            await AsyncStorage.setItem(
              folderName,
              JSON.stringify(folderContent),
            );
          }
        }

        // Hiển thị thông báo khi quá trình hoàn tất
        Alert.alert('Success', 'Data fetched and stored successfully');
      } else {
        Alert.alert('Error', 'No data found in Firestore');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{authCtx.username}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="person-outline" size={20} color={Colors.Text} />{' '}
            Account
          </Text>
          <TouchableOpacity
            onPress={navigationToUser}
            style={styles.sectionItem}>
            <Ionicons name="settings-outline" size={24} color={Colors.Icon} />
            <Text style={styles.sectionItemText}>Profile Setting</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="briefcase-outline" size={20} color={Colors.Text} />{' '}
            Service
          </Text>
          <TouchableOpacity
            onPress={syncApplications}
            style={styles.sectionItem}>
            <Ionicons name="cloud-upload" size={24} color={Colors.Icon} />
            <Text style={styles.sectionItemText}>Sync applications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getApplications}
            style={styles.sectionItem}>
            <Ionicons name="cloud-download" size={24} color={Colors.Icon} />
            <Text style={styles.sectionItemText}>
              Get all saved applications!
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="time-outline" size={20} color={Colors.Text} />{' '}
            Activities
          </Text>
          <TouchableOpacity onPress={logout} style={styles.sectionItem}>
            <Ionicons name="log-out-outline" size={24} color={Colors.Icon} />
            <Text style={styles.sectionItemText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigationToMain}
            style={styles.sectionItem}>
            <Ionicons name="arrow-redo" size={24} color={Colors.Icon} />
            <Text style={styles.sectionItemText}>Return</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Overlay */}
      {showOverlay && <View style={styles.overlay} />}

      {/* Modal xác nhận đồng bộ ứng dụng */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSyncConfirmation}
        onRequestClose={() => setShowSyncConfirmation(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You should get all saved applications first!!!
            </Text>
            <Text style={styles.modalText}>Do you want to sync apps?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelSync}
                style={[styles.button, styles.buttonCancel]}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSync}
                style={[styles.button, styles.buttonConfirm]}>
                <Text style={styles.textStyle}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5', // Màu nền nhẹ và hiện đại
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'gray', // Màu xanh dương nhẹ nhàng
    width: '100%',
    paddingVertical: 25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -20,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Màu chữ đậm hơn để nổi bật
  },
  section: {
    width: '90%',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    color: Colors.Text, // M
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '600',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333', // Màu chữ đậm hơn để dễ đọc
  },
  // Overlay style
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu đen với độ trong suốt 50%
    width: '100%',
    height: '100%',
    zIndex: 1, // Đảm bảo overlay hiển thị trên cùng
  },
  // Modal style
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
    fontSize: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    marginHorizontal: 5,
  },
  buttonConfirm: {
    backgroundColor: '#2196F3',
  },
  buttonCancel: {
    backgroundColor: Colors.Text,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default ProfileScreen;
