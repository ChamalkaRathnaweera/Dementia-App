import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import FooterBar from "../components/FooterBar";
import { NavigationContainer } from "@react-navigation/native";

const Dashboard = () => {
  const [name, setName] = useState("");
  const navigation = useNavigation();

  //change the password
  // const changePassword = () => {
  //   firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email)
  //   .then(() => {
  //     alert("Password reset email sent")
  //   }).catch((error) => {
  //     alert(error)
  //   })
  // }

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
    <ImageBackground
      source={require("../assets/doc.jpg")} // Replace with the path to your image
      style={styles.imageBackground}
    >
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 25, fontWeight: "bold",marginRight:"60%" ,letterSpacing:0.5}}>
          Hello Dr. {name.firstName},
        </Text>
      </SafeAreaView>
    </ImageBackground>
   
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    
    marginTop: 40,
  },

  button: {
    height: 45,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 300,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    padding:5,
    marginTop:400
  },
  imageBackground: {
    flex: 1,
    alignItems:'center',
    resizeMode: "contain", // You can use 'cover', 'contain', etc. to adjust how the image is displayed
  },
  buttonContainer: {
    flexDirection: 'row', // Display buttons in a row
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
});
