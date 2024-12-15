import {
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useRef, useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../components/UI/Loading';
import {signIn} from '../../components/Util/Auth';
import {AuthContext} from '../../context/auth-context'; // Import the AuthContext

const {height, width} = Dimensions.get('window');

const hp = percentage => (height * percentage) / 100;
const wp = percentage => (width * percentage) / 100;

const SignInScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext); // Get the authenticate function from context

  // const emailRef = useRef('viet@gmail.com');
  // const passwordRef = useRef('viettk12');
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Sign In', 'Please fill all the fields!');
      return;
    } else {
      setLoading(true);
      try {
        const {userId, token, username, email} = await signIn(
          emailRef.current,
          passwordRef.current,
        );
        authCtx.authenticate(userId, token, username, email);
        setLoading(false);
        console.log(authCtx);
        navigation.navigate('Main'); // Navigate to the main screen after successful login
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Sign In Failed',
          'Wrong password or email!!' + error.message,
        );
      }
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/images/innerIcon.png')}
          />
        </View>

        <View style={styles.gap10}>
          <Text style={styles.signInText}>Sign In</Text>

          {/* Sign In form */}

          <View style={styles.gap4}>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => (emailRef.current = value)}
                style={styles.textInput}
                placeholder="Email address"
                placeholderTextColor="gray"
              />
            </View>
            <View style={styles.gap3}>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={value => (passwordRef.current = value)}
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="gray"
                  secureTextEntry
                />
              </View>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </View>

            {/* Submit button */}

            <View>
              {loading ? (
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Sign In</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sign up text */}

            <View style={styles.signUpContainer}>
              <Text style={styles.dontHaveAccountText}>
                Don't have an account?
              </Text>
              <Pressable onPress={navigateToSignUp}>
                <Text style={styles.signUpText}> Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingTop: hp(8),
    paddingHorizontal: wp(5),
    flex: 1,
    gap: 12,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    height: hp(25),
  },
  gap10: {
    gap: 10,
  },
  signInText: {
    fontSize: hp(4),
    fontWeight: 'bold',
    letterSpacing: 1.25,
    textAlign: 'center',
    color: '#2d3748',
  },
  gap4: {
    gap: 20,
  },
  inputContainer: {
    height: hp(7),
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    backgroundColor: '#f7fafc',
    alignItems: 'center',
    borderRadius: 16,
  },
  textInput: {
    flex: 1,
    fontSize: hp(2),
    fontWeight: '600',
    color: '#4a5568',
  },
  gap3: {
    gap: 5,
  },
  forgotPasswordText: {
    fontSize: hp(1.8),
    fontWeight: '600',
    textAlign: 'right',
    color: '#a0aec0',
  },
  submitButton: {
    height: hp(6.5),
    backgroundColor: '#6366f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: hp(2.7),
    fontWeight: 'bold',
    letterSpacing: 1.25,
    color: 'white',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dontHaveAccountText: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#a0aec0',
  },
  signUpText: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#6366f1',
  },
});

export default SignInScreen;
