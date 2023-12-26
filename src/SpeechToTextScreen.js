import React, { useState,useEffect } from "react";
import { View, Button, Text,TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { storage } from "../config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Speech from "expo-speech";

export default function SpeechToTextScreen() {
  const recordingOptions = {
    // android not currently in use, but parameters are required
    android: {
      extension: ".flac",
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 16,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_FLAC,
      format: Audio.RECORDING_OPTION_ANDROID_FORMAT_FLAC,
    },
    ios: {
      extension: ".flac",
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 16,
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      audioEncoding: Audio.RECORDING_OPTION_IOS_AUDIO_ENCODING_LINEAR_PCM,
    },
  };
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri: "http://www.hochmuth.com/mp3/Haydn_Cello_Concerto_D-1.mp3" },
      { shouldPlay: true }
    );
    setSound(sound);
  }
  async function playSound(uri) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      { uri: uri },
      { shouldPlay: true }
    );
    // setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true,
      });
      await Audio.requestPermissionsAsync();

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();

      setTimeout(async () => {
        await recording.stopAndUnloadAsync();

        try {
          const info = await FileSystem.getInfoAsync(recording.getURI());
          console.log(`FILE INFO: ${JSON.stringify(info)}`);
          const uri = info.uri;
          console.log(uri);
          playSound(uri);
          // const storageRef = ref(storage, "audioFile4.flac");
          // const storageRespone = await uploadBytes(storageRef, uri);

          // console.log(storageRef.fullPath);

          const formData = new FormData();
          formData.append("audio", {
            uri: uri,
            type: "audio/x-wav", // Adjust the type based on the recorded file format
            name: "voiceRecording.wav",
          });

          fetch("http://192.168.8.101:5000/process_audio", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((result) => {
              console.log("Text result from backend:", result);
              // Handle the text result as needed
            })
            .catch((error) => {
              console.error("Error communicating with the backend:", error);
            });

        } catch (error) {
          // Handle errors from the API request
          console.error("Error in API request:", error);
        }
      }, 5000); // Stop recording after 5 seconds (adjust as needed)
    } catch (error) {
      console.error("Error recording:", error);
    }
  };

  const getTranscription = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/x-wav",
        // could be anything
        name: "speech2text",
      });
      const response = await fetch(
        "https://speech.googleapis.com/v1/speech:recognize?key=737ce4df2cf0e9bcf0409ecb298a04b86086eb2c",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      this.setState({ query: data.transcript });
    } catch (error) {
      console.log("There was an error", error);
      this.stopRecording();
      this.resetRecording();
    }
    this.setState({ isFetching: false });
  };

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording2 = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        // const uri = recording.getURI();
        const info = await FileSystem.getInfoAsync(recording.getURI());
        console.log(`FILE INFO: ${JSON.stringify(info)}`);
        const uri = info.uri;
        console.log(uri);
        playSound(uri);
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
            alert(result)
            // Handle the text result as needed
          })
          .catch((error) => {
            console.error("Error communicating with the backend:", error);
          });
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }

    // Rest of your code for processing the audio file and sending it to the backend
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording2();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handlePress}>
        <Text>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
    </View>
  );
}
