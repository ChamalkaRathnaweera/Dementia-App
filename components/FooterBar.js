import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can use a different icon set if desired
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const FooterBar = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Icon name="home" size={30} color="white" />
      
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Patients')}
      >
        <Icon name="users" size={30} color="white" />
       
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TestPassword')}
      >
        <Icon name="file-text" size={30} color="white" />
       
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Icon name="sign-out" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SpeechToTextScreen')}
      >
        <Icon name="pencil" size={30} color="white" />
       
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0782F9',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
});

export default FooterBar;