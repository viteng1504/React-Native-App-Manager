import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export default function Loading({size}) {
  return (
    <View style={{height: size, aspectRatio: 1}}>
      <LottieView style={{flex:1}} source={require('../../assets/images/Animation - 1717753630562.json')} autoPlay loop />
    </View>
  );
}
