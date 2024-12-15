import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// import SignInModal from '../../screens/Login/SignInModal';
// import SignInScreen from '../../screens/Login/SignInScreen';
import Colors from '../../styles/Colors';
// import Button from './Button';
import {AuthContext} from '../../context/auth-context';

function Header() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/innerIcon.png')}
          style={styles.image}
        />
        <Text style={styles.text}>VShort</Text>
      </View>
      {!authCtx.isAuthenticated && (
        <TouchableOpacity
          onPress={navigateToSignIn}
          style={styles.signInButton}>
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
      )}
      {authCtx.isAuthenticated && (
        <TouchableOpacity
          onPress={navigateToProfile}
          style={styles.signInButton}>
          <Text style={styles.text}>
            Hello {authCtx.username}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    paddingVertical: 10,
    paddingRight: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 100,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor:'#47c1c7',
    padding:5,
    borderRadius:5
  },
});
