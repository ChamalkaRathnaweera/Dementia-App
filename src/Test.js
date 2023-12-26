import { View, Text, TouchableOpacity, TextInput, StyleSheet,Dimensions } from 'react-native';
import React, { useState } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import { useNavigation } from '@react-navigation/native'
import {firebase} from '../config'


const Test = ({route}) => {
  const { patient } = route.params;

    const navigation = useNavigation()
    const [selectedValue, setSelectedValue] = useState(null);
    const [radioButtons, setRadioButtons] = useState([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Sinhala',
            value: 'option1'
        },
        {
            id: '2',
            label: 'English',
            value: 'option2'
        }
    ]);
    function onPressRadioButton(radioButtonsArray) {
      console.log(radioButtonsArray);
        setRadioButtons(radioButtonsArray);
        handleRadioChange(radioButtonsArray.find(rb => rb.selected).value);
    }
    const handleRadioChange = (selectedValue) => {
      // Your custom logic here
      setSelectedValue(selectedValue);
      console.log("Selected value changed to:", selectedValue);
    };
  return (
    <View style={styles.container}>
      <Text style={styles.headLabel}>Choose Comfortable Language</Text>
    
    <View style={styles.containerRadio}>
        <RadioGroup 
            radioButtons={radioButtons} 
            onPress={onPressRadioButton}
        />
    </View>
    <View style={styles.container}>
    <Text style={styles.checkboxLabel}>This test is done under the permission of patient guardian</Text>

    <TouchableOpacity
        onPress={() => navigation.navigate('Question', {
            selectedLanguage: selectedValue,
            patient:patient

          })}
        style={styles.button}
        disabled = {!selectedValue}
      >
        <Text style={{fontSize:22, fontWeight:'bold'}}>
          Continue
        </Text>
      </TouchableOpacity>
    
    </View>
    </View>

      
    
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:15
  
    },
    containerRadio:{
        alignItems:"flex-start",
        padding:20
  
    },
    headLabel: {
        fontWeight: '700',
        color: '#212121',
        fontSize: 20,
        paddingBottom:10,
        marginTop:15
      },
      buttonLogin: {
        height: 45,
        backgroundColor: '#0782F9',
        width: Dimensions.get('window').width - 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop:10
      },
      buttonDisable:{
        height: 45,
        backgroundColor: '#B6B6B4',
        width: Dimensions.get('window').width - 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop:10
      },
      buttonText: {
        color:'white',
       fontWeight:'700',
       fontSize:16
      },
      checkboxContainer: {
        flexDirection: 'row',
      },
      checkbox: {
        alignSelf: 'flex-start',
      },
      checkboxLabel: {
        margin: 5,
        fontSize: 16,
      },
      errorMessage:{
        fontWeight: '400',
        color: '#FF0000',
        fontSize: 12,
        marginTop:5,
        textAlign:'right'
      },
      button:{
        height: 45,
          backgroundColor: '#0782F9',
          width: Dimensions.get('window').width - 250,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          alignSelf: 'center',
          marginTop:20
      }
  })

export default Test