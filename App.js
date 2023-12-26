import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";

import LoginScreen from "./src/LoginScreen";
import Registration from "./src/Registration";
import DashboardWithFooter from "./src/DashboardWithFooter";
import Header from "./components/Header";
import Patients from "./src/Patients";
import AddPatient from "./src/AddPatient";
import EditPatient from "./src/EditPatient";
import Test from "./src/Test";
import Question from "./src/Question";
import PatientsDetailsView from "./src/PatientsDetailsView";
import SuccessScreen from "./src/SuccessScreen";
import IntroductionScreen from "./src/IntroductionScreen";
import SpeechToTextScreen from "./src/SpeechToTextScreen";
import EyeDetect from "./src/EyeDetect";
import FooterBar from "./components/FooterBar";
import HomeScreen from "./src/HomeScreen";
import TestPassword from "./src/TestPassword";

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  //Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerTitle: () => <Header name="Cognition Tracer" />,
            headerStyle: {
              height: 130,
              backgroundColor: "#0782F9",
             
            },
          }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            headerTitle: () => <Header name="Cognition Tracer" />,
            headerStyle: {
              height: 130,
              backgroundColor: "#0782F9",
            },
          }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardWithFooter}
        options={{
          headerTitle: () => <Header name="Dashboard" />,
          headerStyle: {
            height: 130,
              backgroundColor: "#0782F9",
          },
        }}
      />

      <Stack.Screen
        name="Patients"
        component={Patients}
        options={{
          headerTitle: () => <Header name="Patients" />,
          headerStyle: {
            height: 130,
              backgroundColor: "#0782F9",
          },
        }}
      />
      <Stack.Screen
        name="AddPatient"
        component={AddPatient}
        options={{
          headerTitle: () => <Header name="Add Patient" />,
          headerStyle: {
            height: 130,
              backgroundColor: "#0782F9",
          },
        }}
      />
       <Stack.Screen
        name="EditPatient"
        component={EditPatient}
        options={{
          headerTitle: () => <Header name="Edit Patient" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          },
        }}
      />
      <Stack.Screen
        name="Test"
        component={Test}
        options={{
          headerTitle: () => <Header name="Test" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          },
        }}
      />
      <Stack.Screen
        name="Question"
        component={Question}
        options={{
          headerTitle: () => <Header name="Question" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          },
        }}
      />

      <Stack.Screen
        name="PatientsDetailsView"
        component={PatientsDetailsView}
        options={{
          headerTitle: () => <Header name="PatientsDetailsView" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          },
        }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{
          headerTitle: () => <Header name="Questions" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          },
        }}
      />

      <Stack.Screen
        name="IntroductionScreen"
        component={IntroductionScreen}
        options={{
          headerTitle: () => <Header name="Test" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          },
        }}
      />
      <Stack.Screen
        name="EyeDetect"
        component={EyeDetect}
        options={{
          headerTitle: () => <Header name="EyeDetect" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          }
        }}
      />
       <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: () => <Header name="Profile" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          }
        }}
      />
       <Stack.Screen
        name="TestPassword"
        component={TestPassword}
        options={{
          headerTitle: () => <Header name="Test" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          }
        }}
      />
      <Stack.Screen
        name="SpeechToTextScreen"
        component={SpeechToTextScreen}
        options={{
          headerTitle: () => <Header name="SpeechToTextScreen" />,
          headerStyle: {
            height: 130,
            backgroundColor: "#0782F9",
          }
        }}
      />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};
