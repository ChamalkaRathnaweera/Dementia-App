import React, { useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroductionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { patient,selectedValue } = route.params;
 

  useEffect(() => {
    function countdown(seconds) {
      let timer = seconds;

      const interval = setInterval(() => {
        console.log(timer);
        timer--;

        if (timer < 0) {
          clearInterval(interval);
          console.log("Countdown completed!");
          // After countdown, navigate to the Question screen
          navigation.navigate('Question', { patient: patient, selectedLanguage: selectedValue });
        }
      }, 1000);
    }

    countdown(10); // Start the countdown

   
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Hello....,</Text>
      <Text style={styles.answer}>I'm Cognition Tracer.</Text>
      <Text style={styles.answer}>From now onwards I am asking a set of simple questions.</Text>
      <Text style={styles.answer}>You may see and hear those.</Text>
      <Text style={styles.answer}>Please give the best answer according to your knowledge.</Text>
      <Text style={styles.answer}>Let's Continue.....</Text>
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
    marginBottom: 30,
  },
  answer: {
    fontSize: 18,
    marginBottom: 30,
  },
});

export default IntroductionScreen;
