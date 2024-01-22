import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { Audio } from "expo-av";
import ProgressBar from "./ProgressBar";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { storage } from "../config";
import { FontAwesome } from "@expo/vector-icons";
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";
import * as FaceDetector from "expo-face-detector";
import * as Location from "expo-location";
import numberToWords from "number-to-words";
import Constants from "expo-constants";
import FadeInView from "../components/FadeInView";

const Question = ({ route }) => {
  const [showValue, setShowValue] = useState(false);
  const [result, setResult] = useState("");
  //const [selectedImage, setSelectedImage] = useState(null);
  const [remainingTime, setRemainingTime] = useState(10); // Initial countdown time in seconds
  const [counting, setCounting] = useState(false);
  const [testQuestion, setTestQuestion] = useState("");
  const [questionsNO, setQuestionsNO] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [marks, setMarks] = useState(0);
  const [testQuestioSystemQuestion, setTestQuestioSystemQuestion] = useState("");
  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentProvince, setCurrentProvince] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentTown, setCurrentTown] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();
  const { selectedLanguage, patient } = route.params;

//Upload Image
// const openImagePicker = () => {
//   const options = {
//     mediaType: 'photo',
//     includeBase64: false,
//     maxHeight: 2000,
//     maxWidth: 2000,
//   };

//   launchImageLibrary(options, (response) => {
//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//     } else if (response.error) {
//       console.log('Image picker error: ', response.error);
//     } else {
//       const imageUri = response.uri || (response.assets && response.assets[0]?.uri);
//       setSelectedImage(imageUri);
//     }
//   });
// };

// const handleCameraLaunch = () => {
//   const options = {
//     mediaType: 'photo',
//     includeBase64: false,
//     maxHeight: 2000,
//     maxWidth: 2000,
//   };

//   launchCamera(options, (response) => {
//     console.log('Response = ', response);
//     if (response.didCancel) {
//       console.log('User cancelled camera');
//     } else if (response.error) {
//       console.log('Camera Error: ', response.error);
//     } else {
//       const imageUri = response.uri || (response.assets && response.assets[0]?.uri);
//       setSelectedImage(imageUri);
//       console.log(imageUri);
//     }
//   });
// };

//Voice to Text conversion
  // async function playSound(uri) {
  //   console.log("Loading Sound");
  //   const { sound } = await Audio.Sound.createAsync(
  //     { uri: uri },
  //     { shouldPlay: true }
  //   );
  //   // setSound(sound);

  //   console.log("Playing Sound");
  //   await sound.playAsync();
  // }

  const startRecording = async (timeout) => {
    try {

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true,
      });
      await Audio.requestPermissionsAsync();

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();

      setTimeout(async () => {
        try {
          await recording.stopAndUnloadAsync();
          // const uri = recording.getURI();
          const info = await FileSystem.getInfoAsync(recording.getURI());
          console.log(`FILE INFO: ${JSON.stringify(info)}`);
          const uri = info.uri;
          console.log(uri);
          // playSound(uri);
          const formData = new FormData();
          formData.append("audio", {
            uri: uri,
            type: "audio/x-wav", // Adjust the type based on the recorded file format
            name: "voiceRecording.wav",
          });
  
          fetch("http://192.168.8.102:5000/process_audio", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((result) => {
              console.log("Text result from backend:", result);
              setSearchQuery(result)
              // Handle the text result as needed
            })
            .catch((error) => {
              console.error("Error communicating with the backend:", error);
            });
        } catch (error) {
          console.error("Error stopping recording:", error);
        }
      }, timeout); // Stop recording as timeout
    } catch (error) {
      console.error("Error recording:", error);
    }
  };

  // state ={
  //     textSpeak : "What year is this"
  // }
  const listAllVoiceOptions = async () => {
    let voices = await Speech.getAvailableVoicesAsync();
  };
  console.log(marks);
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

  const getCurrentYear = () => {
    const currentDate = new Date();
    return currentDate.getFullYear();
  };

  //Convert No to Text
  function numberToWrittenForm(number) {
    var writtenForms = [
      "zeroth",
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
      "ninth",
      "tenth",
      "eleventh",
      "twelfth",
      "thirteenth",
      "fourteenth",
      "fifteenth",
      "sixteenth",
      "seventeenth",
      "eighteenth",
      "nineteenth",
    ];

    if (number >= 0 && number < writtenForms.length) {
      return writtenForms[number];
    } else {
      return number + "th"; // Fallback for numbers outside the predefined range
    }
  }

  useEffect(() => {
    // Execute a function when countdown reaches 0
    if (remainingTime === 0) {
      //System generating answers
      if (testQuestion.IsSystemAnswer == 0) {
        //Q1 - Year

        if (testQuestion.Question_No == 1 && getCurrentYear() == searchQuery) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }

        //Q2 - Month
        else if (
          testQuestion.Question_No == 2 &&
          getCurrentMonth().trim().toUpperCase() ==
          searchQuery.trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }

        //Q3 - Week
        else if (testQuestion.Question_No == 3 && searchQuery.length > 0) {
          if (
            currentWeekNumberOfMonth == searchQuery ||
            numberToWords
              .toWords(currentWeekNumberOfMonth)
              .replace(/\s/g, "")
              .trim()
              .toUpperCase()
              .includes(
                searchQuery.toString().replace(/\s/g, "").trim().toUpperCase()
              ) ||
            numberToWrittenForm(currentWeekNumberOfMonth)
              .toUpperCase()
              .includes(
                searchQuery.toString().replace(/\s/g, "").trim().toUpperCase()
              )
          ) {
            let newMarks = marks + testQuestion.Marks;
            setMarks(newMarks);
          }
        }
        //Q4 - Date
        // else if (testQuestion.Question_No == 4 && dayOfMonth == searchQuery) {
        //   let newMarks = marks + testQuestion.Marks;
        //   setMarks(newMarks);
        // }
        else if (testQuestion.Question_No == 4 && searchQuery.length > 0) {
          if (
            dayOfMonth == searchQuery ||
            numberToWords
              .toWords(dayOfMonth)
              .replace(/\s/g, "")
              .trim()
              .toUpperCase()
              .includes(
                searchQuery.toString().replace(/\s/g, "").trim().toUpperCase()
              ) ||
            numberToWrittenForm(dayOfMonth)
              .toUpperCase()
              .includes(
                searchQuery.toString().replace(/\s/g, "").trim().toUpperCase()
              )
          ) {
            let newMarks = marks + testQuestion.Marks;
            setMarks(newMarks);
          }
        }
        //Q5 - Day
        else if (
          testQuestion.Question_No == 5 &&
          dayOfWeek.trim().toUpperCase() == searchQuery.trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
        //Q6 - Country
        else if (
          testQuestion.Question_No == 6 &&
          currentCountry.replace(/\s/g, "").trim().toUpperCase() ==
          searchQuery.replace(/\s/g, "").trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
        //Q6 - Province
        else if (
          testQuestion.Question_No == 7 &&
          currentProvince.trim().toUpperCase() ==
          searchQuery.trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
        //Q6 - District
        else if (
          testQuestion.Question_No == 8 &&
          currentDistrict.trim().toUpperCase() ==
          searchQuery.trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
        //Q7 - Town
        else if (
          testQuestion.Question_No == 9 &&
          currentTown.trim().toUpperCase() == searchQuery.trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
        //Q17 - Sentence
        else if (
          testQuestion.Question_No == 17 &&
          searchQuery.split(" ").length >= 4
          //searchQuery.trim().toUpperCase()
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
      } else {
        //Q10 - Ball, Car, Man
        if (testQuestion.Question_No == 10) {
          let newMarks = 0;
          testQuestion.Answer.forEach((value) => {
            let result = searchQuery
              .trim()
              .toUpperCase()
              .includes(value.trim().toUpperCase());
            if (result) {
              newMarks = newMarks + testQuestion.Marks;
            }
          });
          setMarks(newMarks);
        }
        //Q11 - WORLD
        else if (testQuestion.Question_No == 11) {
          let newMarks = 0;
          testQuestion.Answer.forEach((value, i) => {
            let result = searchQuery
              .trim()
              .toUpperCase()
              .includes(value.trim().toUpperCase());
            if (result) {
              newMarks = newMarks + testQuestion.SystemMarks[i];
            }
          });
          setMarks(newMarks);
        }
        //Q12 - Ball, Car, Man
        else if (
          testQuestion.Question_No == 12 &&
          testQuestion.Answer.includes(searchQuery)
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
        //Q13 - Watch
        else if (
          testQuestion.Question_No == 13 &&
          testQuestion.Answer.includes(searchQuery)
        ) {
          let newMarks = marks + testQuestion.Marks;
          setMarks(newMarks);
        }
      }

      getQuestionFunction(questionsNO[questionIndex]);
    }
  }, [remainingTime]);

  useEffect(() => {
    // Execute a function when countdown reaches 0
    if (remainingTime === 0 && questionIndex != questionsNO.length) {
      // ... Your existing code ...

      // Clear the searchQuery field
      setSearchQuery("");

      // Get the next question
      getQuestionFunction(questionsNO[questionIndex]);
    } else if (remainingTime === 0 && questionIndex == questionsNO.length) {
      console.log("Submit Final Total");
      const db = firebase.firestore();
      const docRef = db.collection("patients").doc(patient.id); // Replace 'yourCollection' and 'yourDocument' with actual values
      patient.attempts.push(getCurrentMonth());
      patient.marks.push(marks);
      docRef.update(patient);
      navigation.navigate("SuccessScreen", { patient: patient });
    }
  }, [remainingTime]);

  useEffect(() => {
    var db = firebase.firestore();
    var collectionRef = db
      .collection(
        selectedLanguage == "option1"
          ? "Questions_Sinhala"
          : "Questions_English"
      )
      .orderBy("Question_No", "asc");

    collectionRef.get().then(function (querySnapshot) {
      const updateQuestionNo = [...questionsNO]; // Create a copy of the array
      querySnapshot.forEach(function (doc) {
        var docID = doc.id;
        updateQuestionNo.push(docID); // Update the value at the specified index
      });
      setQuestionsNO(updateQuestionNo); // Update the state with the new array
      getQuestionFunction(updateQuestionNo[0]);
    });
  }, []);

  const getQuestionFunction = (questionIndexValue) => {
    firebase
      .firestore()
      .collection(
        selectedLanguage == "option1"
          ? "Questions_Sinhala"
          : "Questions_English"
      )
      .doc(questionIndexValue)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setTestQuestion(snapshot.data());
          setTestQuestioSystemQuestion(snapshot.data().SystemQuestion);
          const currentQuestionIndex = questionIndex;
          setQuestionIndex(currentQuestionIndex + 1);
          setCounting(false);
          if (snapshot.data().TimeOut) {
            
            setRemainingTime(snapshot.data().TimeOut);
           
          } else {
            setRemainingTime(10);
          }
        } else {
          console.log("Question does not exist");
        }
      });
  };

  //Text to Voice conversion
  useEffect(() => {
    if (testQuestion) {
      speakQuestion();
    }
  }, [testQuestion.Question]);

  const speakQuestion = () => {
    let question = "";
    if (testQuestion.SystemQuestion) {
      question =
        testQuestion.Question +
        "                                                                  " +
        testQuestion.SystemQuestion;
    } else {
      question = testQuestion.Question;
    }
    options = {
      voice: "com.apple.ttsbundle.Ellen-compact",

      language: selectedLanguage == "option1" ? "si" : "en",
      pitch: 1.0,
      rate: 0.7,
      onDone: handleSpeechDone,
    };
    Speech.speak(question, options);
    setShowValue(!showValue);
    
  };

  const handleSpeechDone = () => {
    //setCounting((prevCounting) => !prevCounting)
    console.log("Speech completed!");
    console.log((parseInt(testQuestion.TimeOut)*1000)-10000)
    if (testQuestion.Question_No != 18 && testQuestion.Question_No != 16) {

    startRecording((parseInt(testQuestion.TimeOut)*1000)-10000);

    }

    if (testQuestion.Question_No != 19) {
      setCounting(true);
      setTestQuestioSystemQuestion("");
     
    } else {
      // const db = firebase.firestore();
      // const docRef = db.collection("patients").doc(patient.id); // Replace 'yourCollection' and 'yourDocument' with actual values
      // patient.attempts.push(getCurrentMonth());
      // patient.marks.push(marks);
      // docRef.update(patient);
      navigation.navigate("EyeDetect", {
        patient: patient,
        timeOut: testQuestion.TimeOut,
        marks: marks,
        month: getCurrentMonth(),
      });
    }
  };
  const startCountdown = () => {
    setRemainingTime(10); // Reset the countdown time to 10 seconds
    setCounting(true);
  };

  const executeFunction = () => {
    // Your function to execute when the countdown is complete
    console.log("Countdown complete! Function executed.");
  };

  //Q-2 Answer
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

  //Q-3 Answer
  const getCurrentWeekNumberOfMonth = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);

    const daysPassed = Math.floor(
      (currentDate - firstDayOfMonth) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil(
      (daysPassed + firstDayOfMonth.getDay() + 1) / 7
    );

    return weekNumber;
  };

  const currentWeekNumberOfMonth = getCurrentWeekNumberOfMonth();

  //Q-4 Answer
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();

  //Q-5 Answer
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayOfWeekNumber = currentDate.getDay();
  const dayOfWeek = daysOfWeek[dayOfWeekNumber];

  //Q-6 Answer
  const getCurrentCountry = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=yourkey`
      );
      const data = await response.json();
      console.log(data);

      // Extract country from the response
      const countryFromGoogle = data.results[0].address_components.find(
        (component) => component.types.includes("country")
      ).long_name;

      const provinceFromGoogle = data.results[0].address_components.find(
        (component) => component.types.includes("administrative_area_level_1")
      ).long_name;

      const districtFromGoogle = data.results[0].address_components.find(
        (component) => component.types.includes("administrative_area_level_2")
      ).long_name;

      const townFromGoogle = data.results[0].address_components.find(
        (component) => component.types.includes("locality")
      ).long_name;

      const { countryFromLocal } = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setCurrentCountry(countryFromGoogle);
      setCurrentProvince(provinceFromGoogle);
      setCurrentDistrict(districtFromGoogle);
      setCurrentTown(townFromGoogle);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    getCurrentCountry();
  }, []);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.watchPositionAsync({}, (newLocation) => {
        setLocation(newLocation);
      });
    })();
  }, []);

  let latitude = "Unknown";
  let longitude = "Unknown";
  if (location) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 5 }}>
      {testQuestion.Question_No && questionsNO.length > 0 ? (
        <ProgressBar
          progress={testQuestion.Question_No}
          total={questionsNO.length}
        />
      ) : null}
      <View style={styles.container}>
        <Text style={styles.questionText}>{testQuestion.Question}</Text>
        <Text style={styles.questionTextSystemQuestion}>
          {testQuestioSystemQuestion}
        </Text>

        <Text>{result}</Text>
        {testQuestion.Question_No == 13 ? (
          <Image
            source={require("../assets/watch.jpeg")}
            style={{
              width: 200,
              height: 200,
              alignItems: "center",
              marginLeft: "23%",
            }} 
          />
        ) : null}
        {testQuestion.Question_No == 14 ? (
          <Image
            source={require("../assets/pencil.jpeg")}
            style={{
              width: 200,
              height: 200,
              alignItems: "center",
              marginLeft: "23%",
            }} 
          />
        ) : null}
        {testQuestion.Question_No == 18 ? (
          <Image
            source={require("../assets/Pentagan.jpeg")}
            style={{
              width: 150,
              height: 150,
              alignItems: "center",
              marginLeft: "23%",
            }} 
          />
        ) : null}
        
        {/* {testQuestion.Question_No === 18 && selectedImage && (
          <>
          <Image
            source={{ uri: photo.uri }}
          />
          <Button title="Upload Photo" onPress={openImagePicker} />
          <Button title="Choose Photo" onPress={handleCameraLaunch} />
        </>
      )} */}
      
        {testQuestion.Question_No === 16 && (
          <View style={styles.dotsContainer}>
          <View style={styles.upperDotContainer}>
            <View style={styles.upperDot} />
          </View>
          <View style={styles.leftDot} />
          <View style={styles.rightDot} />
        </View>
        )}
        
        {testQuestion.Question_No != 16 && (
        <TextInput
          style={styles.searchInput}
          placeholder="Answer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable = {false}
        />
        )}

        <Text style={styles.timerNumber}>
          {remainingTime}
          <Text style={styles.timerText}>seconds</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 150,
    marginLeft: "4%",
  },
  containerButton: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 50,
  },
  questionText: {
    fontWeight: "500",
    color: "#212121",
    fontSize: 18,
    paddingBottom: 10,
    marginTop: 35,
  },
  buttonLogin: {
    height: 45,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
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
  errorMessage: {
    fontWeight: "400",
    color: "#FF0000",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  buttonGetQuestion: {
    height: 60,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 250,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 2,
  },
  buttonNextQuestion: {
    height: 60,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 220,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  timerNumber: {
    fontSize: 55,
    marginTop: "15%",
    textAlign: "center",
    color: "red",
  },
  timerText: {
    fontSize: 20,
    textAlign: "center",
    color: "red",
    marginLeft: 45,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    width: "85%",
    marginLeft: 20,
    marginTop: "10%",
  },
  questionTextSystemQuestion: {
    fontWeight: "700",
    color: "#212122",
    fontSize: 25,
    paddingBottom: 10,
    marginTop: 5,
  },
  dotsContainer: {
    flexDirection: 'column', // Change to column to stack items vertically
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
    position: 'absolute',
    top: 80,
    left: 0,
    right: 20,
  },
  leftDot: {
    width: 10,
    height: 10,
    top: 150,
    borderRadius: 5,
    backgroundColor: 'red',
    alignSelf: 'flex-start', // Align left
  },
  rightDot: {
    width: 10,
    height: 10,
    top: 150,
    borderRadius: 5,
    backgroundColor: 'blue',
    alignSelf: 'flex-end', // Align right
  },
  upperDotContainer: {
    alignItems: 'center',
  },
  upperDot: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'green',
  },
});

export default Question;
