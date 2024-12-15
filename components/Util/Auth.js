import {Alert} from 'react-native';
import {firebase} from '../../firebaseConfig';

export async function createUser(email, password, username) {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    await firebase.firestore().collection('user').doc(userId).set({
      username: username,
      email: email,
      userData: '',
    });
  } catch (error) {
    Alert.alert('Error', error.message);
  }
}

export async function signIn(email, password) {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const userDoc = await firebase
      .firestore()
      .collection('user')
      .doc(user.uid)
      .get();
    const userData = userDoc.data();

    return {
      userId: user.uid,
      token: user.za,
      username: userData.username,
      email: userData.email,
    };
  } catch (error) {
    Alert.alert('Sign In Failed', error.message);
    throw error;
  }
}
