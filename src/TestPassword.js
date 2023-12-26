// import {
//     View,
//     Text,
//     TouchableOpacity,
//     TextInput,
//     StyleSheet,
//     Image
//   } from "react-native";
//   import React, { useState } from "react";
//   import { useNavigation } from "@react-navigation/native";
//   import { firebase } from "../config";
  
//   const TestPassword = () => {
//     const navigation = useNavigation();
//     const [nic, setNic] = useState("");
  
 
  
//     return (
//       <View style={styles.container}>
//       <View style={styles.container2}>
//         <View style={{ marginTop: 50 }}>
//         <Text style={styles.textStyle}>Locked</Text>
//         <Image
//         source={require('../assets/lock-circle.png')}
//         style={styles.image}
//       />
//         <Text style={styles.textStyle1}>Enter your NIC number to start the test</Text>
//           <TextInput
//             style={styles.textInput}
//             placeholder="NIC"
//             onChangeText={(nic) => setNic(nic)}
//             autoCapitalize="none"
//             autoCorrect={false}
//           />
//         </View>
     
//         <TouchableOpacity
//             onPress={() => navigation.navigate('Test', {
//               patient: item,
  
//             })}
//           style={styles.button}
//         >
//           <Text style={{ fontWeight: "bold", fontSize: 25 ,color:"white"}}>Continue</Text>
//         </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };
  
//   export default TestPassword;
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: "center",
//       backgroundColor:"#0782F9",
//       borderColor:"#0782F9",
//     },
//     textStyle:{
//       textAlign: "center",
//       fontSize:38,
//       fontWeight:700,
//       letterSpacing:1.8

//     },
//     textStyle1:{
//       textAlign: "center",
//       fontSize:20,
//       fontWeight:400,
//       marginTop:'5%'
//     },
//     container2: {
//       flex: 1,
//       alignItems: "center",
//       backgroundColor:"white",
//       borderTopLeftRadius:40,
//       borderTopRightRadius:40,
//       width:'100%',
    
//     },
//     textInput: {
//       paddingTop: 10,
//       paddingBottom: 10,
//       width: 300,
//       fontSize: 25,
//       marginBottom: "5%",
//       textAlign: "center",
//       backgroundColor: "#F3F0F0",
//       paddingHorizontal: 15,
//       paddingVertical: 10,
//       borderRadius: 10,
//       marginTop:'8%'
//     },
//     button: {
//       marginTop: 15,
//       width: 300,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#0782F9",
//       padding: 13,
//       borderRadius: 10,
//       color:"white"
//     },
//     image: {
//       width: 100, // Adjust the width as needed
//       height: 100, // Adjust the height as needed
//       resizeMode: 'contain', // You can change the resizeMode as needed
//       marginLeft:'25%',
//       marginTop:'7%'

//     },
//   });

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

const TestPassword = () => {
  const navigation = useNavigation();
  const [idNo, setIdNo] = useState("");

  const checkPatientExists = async () => {
    try {
      const patientRef = firebase
        .firestore()
        .collection("patients")
        .where("idNo", "==", idNo);
      const querySnapshot = await patientRef.get();

      if (!querySnapshot.empty) {
        // Patient with the entered ID number exists
        Alert.alert("Patient  found. .");
        //navigation.navigate("Test");
      } else {
        // Patient with the entered ID number does not exist
        Alert.alert("Error", "Patient not found. Please enter a valid ID number.");
      }
    } catch (error) {
      console.error("Error checking patient existence:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.textStyle}>Locked</Text>
          <Image
            source={require("../assets/lock-circle.png")}
            style={styles.image}
          />
          <Text style={styles.textStyle1}>
            Enter your ID number to start the test
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="ID number"
            onChangeText={(idNo) => setIdNo(idNo)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity onPress={checkPatientExists} style={styles.button}>
          <Text style={{ fontWeight: "bold", fontSize: 25, color: "white" }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TestPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0782F9",
    borderColor: "#0782F9",
  },
  textStyle: {
    textAlign: "center",
    fontSize: 38,
    fontWeight: 700,
    letterSpacing: 1.8,
  },
  textStyle1: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 400,
    marginTop: "5%",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
  },
  textInput: {
    paddingTop: 10,
    paddingBottom: 10,
    width: 300,
    fontSize: 25,
    marginBottom: "5%",
    textAlign: "center",
    backgroundColor: "#F3F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: "8%",
  },
  button: {
    marginTop: 15,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0782F9",
    padding: 13,
    borderRadius: 10,
    color: "white",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginLeft: "25%",
    marginTop: "7%",
  },
});