import React, { useState } from "react";
import { TextInput, View, StyleSheet, Text, Dimensions,TouchableOpacity ,Image,Button} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native'

const SuccessScreen = ({ route }) => {
    const navigation = useNavigation()
    const { patient } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Test Completed</Text>
      <Image
        source={require('../assets/right.png')} 
        style={{ width: 150, height: 150,alignItems:'center',marginLeft:20 }} // Adjust the width and height as needed
      />
      <Text style={styles.answer}>You have done a great Job</Text>
      <Text style={styles.answer}>Thank You !</Text>
      <Button
        title="Continue"
        onPress={() => navigation.navigate('Test',{patient:patient})} // Replace with the appropriate screen name
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 24,
    marginBottom: 20,
  },
  answer: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default SuccessScreen;
