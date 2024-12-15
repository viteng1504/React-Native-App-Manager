import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

const Stack = createNativeStackNavigator();

function SignInModal() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sign In">
        <Stack.Screen
          name="SignIn"
          options={{ headerShown: false }}
          component={SignInScreen}
        />
        {/* <Stack.Screen
            name="SignUp"
            options={{ headerShown: false }}
            component={SignUpScreen}
          />
          <Stack.Screen
            name="Success"
            options={{ headerShown: false }}
            component={SignInSuccess}
          /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SignInModal;
