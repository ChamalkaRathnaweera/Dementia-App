from flask import Flask, request
from flask_cors import CORS
import speech_recognition as sr
import pygame
import time
import subprocess
import os
import random


app = Flask(__name__)
CORS(app)


def play_audio(file_path):
    pygame.init()
    pygame.mixer.init()

    try:
        pygame.mixer.music.load(file_path)
        pygame.mixer.music.play()

        # Wait for the audio to finish playing
        while pygame.mixer.music.get_busy():
            time.sleep(1)

    except pygame.error as e:
        print(f"Error playing audio: {str(e)}")

    finally:
        pygame.quit()

@app.route('/')
def index():
    return "Staring..........."


@app.route('/process_audio', methods=['POST'])
def process_audio():
    try:
        audio_file = request.files['audio']
        
        # audio_data = audio_file.read()

        # # Save the audio data to a temporary file
        # with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        #     temp_audio_file.write(audio_data)
        #     temp_audio_file_path = temp_audio_file.name

        # print(temp_audio_file_path)
        # play_audio(temp_audio_file_path)

        save_directory = 'backend\\audio\\'+ str(audio_file.filename)
        audio_file.save(save_directory)

        dst = f"backend\\audio\\ffmpegwavconvert.wav"
        subprocess.call(['ffmpeg', '-i', save_directory,
                      dst])

        recognizer = sr.Recognizer()

        #audio_file_path = "/content/drive/MyDrive/Colab Notebooks/speech sound/what-are-you-doing-22344.wav"  # Change to the path of your audio file

        with sr.AudioFile(dst) as source:
            audio = recognizer.record(source)  # Record the audio file

        try:
            # Use Google Web Speech API to transcribe the audio
            text = recognizer.recognize_google(audio)
            print(text)
            os.remove(dst)
            return text 
        
        except sr.UnknownValueError:
            os.remove(dst)
            print("Google Web Speech API could not understand audio")
        except sr.RequestError as e:
            os.remove(dst)
            print("Could not request results from Google Web Speech API; {0}".format(e))


    except Exception as e:
        os.remove(dst)
        app.logger.error(f"Exception occurred: {str(e)}")
        return str(e), 500





if __name__ == '__main__':
    app.run(host="192.168.8.102", port=5000,debug=True)
