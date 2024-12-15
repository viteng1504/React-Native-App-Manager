import {Pressable, StyleSheet, Text, View} from 'react-native';

import Colors from '../../styles/Colors';

function Button({children, onPress}) {
  return (
    <Pressable
      style={({pressed}) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}>
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.Focused,
    elevation: 2,
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
    color: Colors.Text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
