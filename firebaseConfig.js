import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyATuGMcI8FZ24C79YtAMjpAh-MqFeF85T0',
  authDomain: 'vshort-d051d.firebaseapp.com',
  databaseURL:
    'https://vshort-d051d-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'vshort-d051d',
  storageBucket: 'vshort-d051d.appspot.com',
  messagingSenderId: '290466484452',
  appId: '1:290466484452:web:7e48b5770e451857f01cf1',
  measurementId: 'G-24R954YB13',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

