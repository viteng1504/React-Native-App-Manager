import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Button } from 'react-native-paper';
import MyShortcutScreen from '../../screens/MyShortcutScreen';
import ShortcutScreen from '../../screens/ShortcutScreen';
import Colors from '../../styles/Colors';

const Tab = createMaterialTopTabNavigator();

function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
          color: Colors.Text,
          alignItems: 'center',
        },
        tabBarStyle: {backgroundColor: Colors.bottomTabBar},
      })}
      barStyle={{backgroundColor: '#694fad'}}
      tabBarPosition="bottom"
      tabBarShowIcon={false}>
      <Tab.Screen
        name="Shortcut"
        component={ShortcutScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={require('../../assets/images/S.png')}
                style={styles.tabBarIcon}
              />
            </View>
          ),
          tabBarLabel: 'Shortcut',
        }}
      />
      <Tab.Screen
        name="MyShortcut"
        component={MyShortcutScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={require('../../assets/images/MyS.png')}
                style={styles.tabBarIcon}
              />
            </View>
          ),
          tabBarLabel: 'My Shortcut',
        }}
      />
    </Tab.Navigator>
  );
}

function CustomTabBarButton({children, onPress, focused}) {
  return (
    <Button
      rippleColor="#FFF"
      onPress={onPress}
      // android_ripple={{color: Colors.Focused, borderless: true}}
      style={[styles.tabBarButton, focused && styles.selectedTab]}>
      {children}
    </Button>
  );
}

function Navigation() {
  return <TabGroup />;
}

export default Navigation;

const styles = StyleSheet.create({
  tabBarIcon: {
    height: 32,
    width: 41,
    alignItems:'center',
    justifyContent: 'center',
  },
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedTabIcon: {
    backgroundColor: Colors.Focused,
    borderRadius: 24,
    padding: 5,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: Colors.Focused,
  },
});
