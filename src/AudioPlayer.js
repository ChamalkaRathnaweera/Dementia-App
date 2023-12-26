import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const AudioPlayer = ({ fileUrl }) => {
  useEffect(() => {
    const playAudio = async () => {
      try {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: fileUrl },
          { shouldPlay: true }
        );

        // Handle sound status, unload the sound when it's done playing, etc.
        // For example, you can use the `status` object to determine if the sound is done playing.
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    };

    playAudio();

    // Cleanup function
    return () => {
      // Unload the audio when the component is unmounted
      Audio.Sound.stopAsync();
    };
  }, [fileUrl]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Audio Player</Text>
    </View>
  );
};

export default AudioPlayer;