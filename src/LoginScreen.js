import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  //forget Password
  const forgetPassword = () => {
    if (email) {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          alert("Password reset email sent");
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      alert("Email is  required");
    }
  };
  return (
    <View style={styles.container}>
    <View style={styles.container2}>
      <View style={{ marginTop: 120 }}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        onPress={() => loginUser(email, password)}
        style={styles.button}
      >
        <Text style={{ fontWeight: "bold", fontSize: 25 ,color:"white"}}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Registration")}
        style={{ marginTop: "10%" }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 23 }}>
          Don't have an account? <Text style={{color:"#799FF3"}}>Register Now
        </Text></Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          forgetPassword();
        }}
        style={{ marginTop: 20 }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 23,color:"#799FF3" }}>
          Forget Password?
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

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
  },
  button: {
    marginTop: 30,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0782F9",
    padding: 13,
    borderRadius: 10,
  },
});
