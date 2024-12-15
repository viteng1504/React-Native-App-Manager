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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../components/UI/Loading';
import {createUser} from '../../components/Util/Auth';

const {height, width} = Dimensions.get('window');

const hp = percentage => (height * percentage) / 100;
const wp = percentage => (width * percentage) / 100;

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef('');
  const passwordRef = useRef('');
  const usernameRef = useRef('');

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
      Alert.alert('Sign Up', 'Please fill all the fields!');
      return;
    } else {
      setLoading(true);
      try {
        await createUser(
          emailRef.current,
          passwordRef.current,
          usernameRef.current,
        );
        setLoading(false);
        navigation.navigate('SignIn'); // Chuyển hướng đến màn hình đăng nhập sau khi đăng ký thành công
        } catch (error) {
          setLoading(false);
          navigation.navigate('SignUp'); // Chuyển hướng đến màn hình đăng nhập sau khi đăng ký thành công
        Alert.alert('Sign Up Failed', error.message);
      }
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
              <Text style={styles.signInText}>Sign Up</Text>

              <View style={styles.gap4}>
                <View style={styles.inputContainer}>
                  <Feather name="user" size={hp(2.7)} color="gray" />
                  <TextInput
                    onChangeText={value => (usernameRef.current = value)}
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor="gray"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={hp(2.7)} color="gray" />
                  <TextInput
                    onChangeText={value => (emailRef.current = value)}
                    style={styles.textInput}
                    placeholder="Email address"
                    placeholderTextColor="gray"
                  />
                </View>
                <View style={styles.gap3}>
                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={hp(2.7)} color="gray" />
                    <TextInput
                      onChangeText={value => (passwordRef.current = value)}
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor="gray"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View>
                  {loading ? (
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <Loading size={hp(8)} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleRegister}
                      style={styles.submitButton}>
                      <Text style={styles.submitButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.signUpContainer}>
                  <Text style={styles.dontHaveAccountText}>
                    Already have an account?
                  </Text>
                  <Pressable onPress={navigateToSignIn}>
                    <Text style={styles.signUpText}> Sign In</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
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

export default SignUpScreen;
