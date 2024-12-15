import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';

import Colors from '../../styles/Colors';
import Button from '../UI/Button';
import AuthForm from './AuthForm';

function AuthContent({isLogin, onAuthenticate}) {
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigation = useNavigation();

  const navigateToMainScreen = () => {
    navigation.navigate('Main');
  };

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.navigate('SignUp');
    } else {
      navigation.navigate('SignIn');
    }
  }

  function submitHandler(credentials) {
    let {email, password, confirmPassword} = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const passwordsAreEqual = password === confirmPassword;

    if (!emailIsValid || !passwordIsValid || (!isLogin && !passwordsAreEqual)) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({email, password});
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/innerIcon.png')}
          style={{width: 200, height: 200}}
        />
        <Text style={{fontSize: 20, fontWeight: 'bold', color: Colors.Text}}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Text>
      </View>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          <Button onPress={switchAuthModeHandler}>
            {isLogin ? 'Create a new user' : 'Log in instead'}
          </Button>
          <Button onPress={navigateToMainScreen}>Return</Button>
        </View>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.appBackgroundColor,
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContent: {
    marginTop: 64,
    marginHorizontal: 22,
    padding: 16,
    borderRadius: 30,
    backgroundColor: Colors.bottomTabBar,
    elevation: 2,
    height: '100%',
  },
  buttons: {
    // marginTop: 8,
  },
});
