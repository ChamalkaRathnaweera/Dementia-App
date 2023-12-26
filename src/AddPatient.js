import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { db } from "../config";
import { doc, collection, setDoc, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";


const AddPatient = ({route}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNo, seIdNo] = useState("");
  const [age, setAge] = useState("");
  const [addPatient, setAddPatient] = useState("");
  const [idNoError, setIdNoError] = useState(false);
  const navigation = useNavigation();

  const { fetchData } = route.params;

  const currentDate = new Date();
  // const getCurrentYear = () => {
  //   return currentDate.getFullYear();
  // };


  useEffect(() => {
    let idNoMatch = validateIdNo(idNo);
    if (idNoMatch) {
      setIdNoError(false);
    } else {
      setIdNoError(true); 
    }
  }, [idNo]);

  validateIdNo = (idNo) => {
    var re =
      /^(?:19|20)?\d{2}(?:[0-35-8]\d\d(?<!(?:000|500|36[7-9]|3[7-9]\d|86[7-9]|8[7-9]\d)))\d{4}(?:[vVxX])$/;
    return re.test(idNo);
  };

  // add a new patient
  const addNewPatient = () => {
    //check if have new patient's data
    // if(addPatient && addPatient.length > 0){
    //     //get the timestamp

    // }
    const birthYear = parseInt(idNo.substring(0, 2)) + 1900;
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const gender = String(idNo).substring(2, 5) >= 500 ? "Female" :"Male"
    addDoc(collection(db, "patients"), {
      firstName: firstName,
      lastName: lastName,
      idNo: idNo,
      age:age,
      gender:gender,
      marks:[],
      attempts:[]
    })
      .then(() => {
        alert("Successfully added the patient");

        
      })
      .then(() => {
        setFirstName("");
        setLastName("");
        seIdNo("");
        setAge("");
        fetchData();
        navigation.navigate("Patients");

      })
      .catch((error) => {
        console.log("error");
      });
  };
  const calculateAgeFromId = (idNo) => {
    if (idNo && idNo.length >= 6) {
      const birthYear = parseInt(idNo.substring(0, 2)) + 1900;
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      return age.toString();
    }
    return '';
  };

  return (
    <View>
    <View style={styles.loginFormContainer}>
      <View style={styles.inputCotainer}>
        <Text style={styles.inputLabel}> First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={firstName}
          onChangeText={(firstName) => setFirstName(firstName)}
          maxLength={100}
          keyboardType="ascii-capable"
          outoCorrect={false}
        />
        <Text style={styles.inputLabel}> Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={lastName}
          onChangeText={(lastName) => setLastName(lastName)}
          maxLength={100}
          keyboardType="ascii-capable"
          outoCorrect={false}
        />
        <Text style={styles.inputLabel}>ID No</Text>
        <TextInput
          style={styles.input}
          placeholder="please enter id no"
          value={idNo}
          onChangeText={(idNo) => seIdNo(idNo)}
          outoCorrect={false}
          keyboardType="ascii-capable"
        />
        {idNoError == true && idNo ? (
          <Text style={styles.errorMessage}>* Id No Error</Text>
        ) : (
          <Text style={styles.errorMessage}></Text>
        )}

        <Text style={styles.inputLabel}>Age</Text>
        {idNo == "" ? (
          <TextInput style={styles.input} placeholder="Age" />
        ) : (
          <TextInput
          style={styles.input}
          placeholder="Age"
          value={idNo ? calculateAgeFromId(idNo) : ''}
        />
        )}
        <Text style={styles.inputLabel}>Gender</Text>
        {String(idNo).substring(2, 5) >= 500 ? (
          <TextInput style={styles.input} placeholder="Gender"  value={idNo ? "Female":""} />
        ) : (
          <TextInput style={styles.input} placeholder="Gender"  value={idNo ? "Male" : ""} />
        )}
      </View>

      {firstName == "" || lastName == "" || idNo == "" || idNoError == true ? (
        <TouchableOpacity
          disabled
          onPress={addNewPatient}
          style={styles.buttonDisable}
        >
          <Text style={{ fontWeight: "bold", fontSize: 22, color: "white" }}>
            Create Patient
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={addNewPatient}
          style={styles.buttonPatientAdd}
        >
          <Text style={{ fontWeight: "bold", fontSize: 22 }}>
            Create Patient
          </Text>
        </TouchableOpacity>
      )}
    </View>
    <View>
    </View>
    </View>
  );
};

export default AddPatient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginFormContainer: {
    padding: 2,
    marginLeft: 10,
  },
  headLabel: {
    fontWeight: "700",
    color: "#212121",
    fontSize: 18,
    paddingBottom: 10,
    marginTop: 15,
  },
  inputCotainer: {
    width: "85%",
  },
  inputLabel: {
    fontWeight: "500",
    color: "#212121",
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonPatientAdd: {
    height: 45,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 240,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 25,
    marginBottom:50
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  checkbox: {
    alignSelf: "flex-start",
  },
  checkboxLabel: {
    margin: 5,
    fontSize: 16,
  },
  loginText: {
    margin: 10,
    fontSize: 16,
  },
  hyperlinkText: {
    margin: 10,
    fontSize: 16,
    color: "#0782F9",
  },
  buttonDisable: {
    height: 45,
    backgroundColor: "#B6B6B4",
    width: Dimensions.get("window").width - 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  errorMessage: {
    fontWeight: "400",
    color: "#FF0000",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
});
