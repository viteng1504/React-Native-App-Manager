import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

import Header from './components/UI/Header';
import Navigation from './components/UI/Navigation';
import SignInScreen from './screens/Login/SignInScreen';
import SignUpScreen from './screens/Login/SignUpScreen';
import Colors from './styles/Colors';
import AuthContextProvider from './context/auth-context';
import ProfileScreen from './screens/ProfileScreen';
import UserProfileScreen from './screens/UserProfileScreen';

const Stack = createStackNavigator();

function MainScreen() {
  return (
    <View style={styles.rootScreen}>
      <Header />
      <Navigation />
    </View>
  );
}

function NavigationWraper() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          options={{headerShown: false}}
          component={MainScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{headerShown: false}}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="SignIn"
          options={{headerShown: false}}
          component={SignInScreen}
        />
        <Stack.Screen
          name="Profile"
          options={{headerShown: false}}
          component={ProfileScreen}
        />
        <Stack.Screen
          name="UserProfile"
          options={{headerShown: false}}
          component={UserProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.rootScreen}>
      <StatusBar backgroundColor={Colors.appBackgroundColor} />
      <AuthContextProvider>
        <NavigationWraper />
      </AuthContextProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    backgroundColor: Colors.appBackgroundColor,
    flex: 1,
  },
});
