
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

const Registration = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [registrationNoError, setRegistrationNoError] = useState(false);
  const [reEnterPasswordError, setReEnterPasswordError] = useState(false);

  useEffect(() => {
    let passwordMatch = validatePassword(password);
    if (passwordMatch) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, [password]);

  useEffect(() => {
    let emailMatch = validateEmail(email);
    if (emailMatch) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  }, [email]);

  useEffect(() => {
    let registrationNoMatch = validateRegistrationNo(registrationNo);
    if (registrationNoMatch) {
      setRegistrationNoError(false);
    } else {
      setRegistrationNoError(true);
    }
  }, [registrationNo]);

  useEffect(() => {
    if (reEnterPassword !== '' && reEnterPassword !== password) {
      setReEnterPasswordError(true);
    } else {
      setReEnterPasswordError(false);
    }
  }, [reEnterPassword, password]);

  const validatePassword = (password) => {
    var re = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    return re.test(password);
  };

  const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const validateRegistrationNo = (registrationNo) => {
    var re = /(?<!\d)\d{5}(?!\d)$/;
    return re.test(registrationNo);
  };

  const registerUser = async (email, password, firstName, registrationNo) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: 'https://dementiaapp-fc50d.firebaseapp.com',
          })
          .then(() => {
            alert('Verification email sent');
          })
          .catch((error) => {
            alert(error.message);
          })
          .then(() => {
            firebase
              .firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .set({
                firstName,
                registrationNo,
                email,
              });
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.loginFormContainer}>
          <Text style={styles.headLabel}>Create Account</Text>
          <View style={styles.inputCotainer}>
            <Text style={styles.inputLabel}>NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={firstName}
              onChangeText={(firstName) => setFirstName(firstName)}
              maxLength={100}
              keyboardType="ascii-capable"
              autoCorrect={false}
            />
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="email"
              value={email}
              maxLength={100}
              onChangeText={(email) => setEmail(email)}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {emailError && email ? (
              <Text style={styles.errorMessage}>* Email Error</Text>
            ) : (
              <Text style={styles.errorMessage}></Text>
            )}
            <Text style={styles.inputLabel}>REGISTRATION</Text>
            <TextInput
              style={styles.input}
              placeholder="given by slmc"
              value={registrationNo}
              onChangeText={(registrationNo) => setRegistrationNo(registrationNo)}
              autoCorrect={false}
              keyboardType="number-pad"
            />
            {registrationNoError && registrationNo ? (
              <Text style={styles.errorMessage}>* Registration No Error</Text>
            ) : (
              <Text style={styles.errorMessage}></Text>
            )}
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="password"
              value={password}
              onChangeText={(password) => setPassword(password)}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
            />
            {passwordError && password ? (
              <Text style={styles.errorMessage}>
                * Password must be minimum 8 characters with lower case and upper case letters, numbers, and symbols
              </Text>
            ) : (
              <Text style={styles.errorMessage}></Text>
            )}

            <Text style={styles.inputLabel}>RE-ENTER PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              value={reEnterPassword}
              onChangeText={(reEnterPassword) => setReEnterPassword(reEnterPassword)}
              secureTextEntry={true}
            />
            {reEnterPasswordError && reEnterPassword !== '' ? (
              <Text style={styles.errorMessage}>* Passwords do not match</Text>
            ) : (
              <Text style={styles.errorMessage}></Text>
            )}

            <View style={styles.checkboxContainer}>
              {/* ... (previous checkbox code) */}
              <Text style={styles.checkboxLabel}>
                By creating an account you agree to our terms & conditions.
              </Text>
            </View>
          </View>

          {firstName === '' || email === '' || registrationNo === '' || password === '' || passwordError || emailError || reEnterPasswordError ? (
            <TouchableOpacity disabled onPress={() => registerUser(email, password, firstName, registrationNo)} style={styles.buttonDisable}>
              <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Sign up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => registerUser(email, password, firstName, registrationNo)} style={styles.buttonLogin}>
              <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Sign up</Text>
            </TouchableOpacity>
          )}

          <View style={styles.checkboxContainer}>
            <Text style={styles.loginText}>Already have an account </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.hyperlinkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Registration;

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
  loginFormContainer: {
      padding: 2,
      
    },
    headLabel: {
      fontWeight: '900',
      color: '#212121',
      fontSize: 25,
      paddingBottom:10,
      marginTop:10
    },
    inputCotainer: {
      width:'85%'
    },
    inputLabel: {
      fontWeight: '400',
      color: 'black',
      fontSize: 21,
      marginTop:5,
      letterSpacing:1.2
    },
    input: {
      backgroundColor:'#F3F0F0',
      paddingHorizontal:15,
      paddingVertical:10,
      borderRadius:10,
      
    },
    buttonLogin: {
      height: 45,
      backgroundColor: '#0782F9',
      width: Dimensions.get('window').width - 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      alignSelf: 'center',
      marginTop:5
    },
    buttonDisable:{
      height: 45,
      backgroundColor: '#B6B6B4',
      width: Dimensions.get('window').width - 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      alignSelf: 'center',
      marginTop:5
    },
    buttonText: {
      color:'white',
     fontWeight:'700',
     fontSize:16
    },
    checkboxContainer: {
      flexDirection: 'row',
    },
    checkbox: {
      alignSelf: 'flex-start',
    },
    checkboxLabel: {
      margin: 5,
      fontSize: 20,
    },
    loginText: {
      margin: 10,
      fontSize: 20,
    },
    hyperlinkText: {
      margin: 10,
      fontSize: 20,
      color: '#799FF3',
      fontWeight:'800',
    },
    errorMessage:{
      fontWeight: '400',
      color: '#FF0000',
      fontSize: 12,
      marginTop:5,
      textAlign:'right'
    },
})
// const styles = StyleSheet.create({
//   container:{
//     flex:1,
//     alignItems:'center',
//     marginTop:100
//   },
//   textInput:{
//     paddingTop:20,
//     paddingBottom:10,
//     width:400,
//     fontSize:20,
//     borderLeftWidth:1,
//     borderBottomColor:'#000',
//     marginBottom:10,
//     textAlign:'center'
//   },
//   button:{
//     marginTop:50,
//     height:70,
//     width:250,
//     backgroundColor:'#026efd',
//     alignItems:'center',
//     justifyContent:'center',
//     borderRadius:50
//   }
// })

