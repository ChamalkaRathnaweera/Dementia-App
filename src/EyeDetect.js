import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { Camera, Constants } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useNavigation } from "@react-navigation/native";

//export default function SpeechToTextScreen() {
export default function EyeDetect({ route }) {
  const [hasPermission, setHasPermission] = React.useState();
  const navigation = useNavigation();
  const [faceData, setFaceData] = React.useState([]);
  const [remainingTime, setRemainingTime] = useState(10);
  const [counting, setCounting] = useState(false);
  const { patient,timeOut,marks,month } = route.params;
  const [eyeClosed, setEyeClosed] = useState(false);

  console.log(patient)
  // setRemainingTime(timeOut)
  React.useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      setRemainingTime(timeOut)
      setCounting(true)
    })();
  }, []);

  //
  const getCurrentMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    return months[currentMonthIndex];
  };

  useEffect(() => {
    let interval;
    if (counting) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [counting]);

  useEffect(() => {
    console.log(remainingTime)
    // Execute a function when countdown reaches 0
    if (remainingTime === 0) {
      const db = firebase.firestore();
      const docRef = db.collection("patients").doc(patient.id); // Replace 'yourCollection' and 'yourDocument' with actual values
      let finalMark = 0
      if (eyeClosed){
         finalMark = marks+1
      }
      else{
        finalMark = marks
      }
      console.log("mark" +finalMark)
      patient.attempts.push(getCurrentMonth());
      patient.marks.push(finalMark);
      docRef.update(patient);
      navigation.navigate("SuccessScreen", { patient: patient });
    }
  }, [remainingTime]);


  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function getFaceDataView() {
    if (faceData.length === 0) {
      console.log("Face didn't detected")
    }
    else{
      const detectedFace = faceData[0];
      const eyesShut = detectedFace.rightEyeOpenProbability < 0.4 && detectedFace.leftEyeOpenProbability < 0.4;
      console.log(eyesShut);
      if (eyesShut && !eyeClosed){
        setEyeClosed(true) 
      }
      
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);

  }

  return (
    <Camera
      type={Camera.Constants.Type.front}
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 3000,
        tracking: true
      }}>
      {getFaceDataView()}
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    fontSize: 20
  }
});