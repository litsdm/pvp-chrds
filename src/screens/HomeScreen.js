import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => (
  <View>
    <Text>This is home</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
      <Text>Go to Camera</Text>
    </TouchableOpacity>
  </View>
);

export default HomeScreen;
