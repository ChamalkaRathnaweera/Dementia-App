import { View, Text ,TouchableOpacity, TextInput, StyleSheet,Dimensions} from 'react-native'
import React, {useState,useEffect} from 'react'
import {firebase} from '../config'


const HomeScreen = () => {
    const [name, setName] = useState("");

 
    useEffect(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              setName(snapshot.data());
            } else {
              console.log("User does not exist");
            }
          });
      }, []);
   
 
  return (
<View style={styles.container}>
    <View style={styles.container2}>
      <View style={styles.inputCotainer}>
        <Text style={styles.inputLabel}>NAME</Text>
        <TextInput
          style={styles.input}
          value={name.firstName}
        />
        <Text style={styles.inputLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={name.email}   
        />
     
      </View>
    
    </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor:"#0782F9",
    borderColor:"#0782F9",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    backgroundColor:"white",
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    width:'100%',
  
  },
  loginFormContainer: {
      padding: 2,
      
    },
    headLabel: {
      fontWeight: '900',
      color: '#212121',
      fontSize: 25,
      paddingBottom:10,

    },
    inputCotainer: {
      width:'85%',
      marginTop:'15%'
    },
    inputLabel: {
      fontWeight: '600',
      color: 'black',
      fontSize: 25,
      marginTop:10,
      letterSpacing:1.2,
      marginTop:'10%'
    
    },
    input: {
      backgroundColor:'#F3F0F0',
      paddingHorizontal:15,
      paddingVertical:10,
      borderRadius:10,
      marginTop:'3%',
      fontSize: 20,

      
    },
  
    checkboxContainer: {
      flexDirection: 'row',
    },
    checkbox: {
      alignSelf: 'flex-start',
    },
    checkboxLabel: {
      margin: 5,
      fontSize: 20,
    },
    loginText: {
      margin: 10,
      fontSize: 20,
    },
    hyperlinkText: {
      margin: 10,
      fontSize: 20,
      color: '#799FF3',
      fontWeight:'800',
    },
    errorMessage:{
      fontWeight: '400',
      color: '#FF0000',
      fontSize: 12,
      marginTop:10,
      textAlign:'right'
    },
})
