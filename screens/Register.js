import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import firebase from 'firebase'

import UserAuthentication from '../components/UserAuthentication'

const Register = ({navigation}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    
    const emailHandler = emailText => {setEmail(emailText)}
    const passwordHandler = passwordText => {setPassword(passwordText)}
    const confirmPasswordHandler = confirmPasswordText => {setConfirmPassword(confirmPasswordText)}

    const registerButtonHandler = () => {
        if (password===confirmPassword) {
            firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setErrorMessage('')
                firebase.firestore().collection('users').doc(email).set({email: email}).then(() => {
                    firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                }).catch((error) => setErrorMessage('The data could not be added'))
            })
            .catch((error) => {setErrorMessage(error.message)})
        } else {
            setErrorMessage('The confirmed password is incorrect.')
        }
    }
    

    const navigationHandler = () => {
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setErrorMessage('')
        navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
            <UserAuthentication
            title='Register'
            emailHandling={emailHandler}
            emailValue={email}
            passwordHandling={passwordHandler}
            passwordValue={password}
            reglogButtonHandling={registerButtonHandler}
            error={errorMessage}
            navigateText='Already Have An Account? Log In!'
            navigationHandling={navigationHandler}
            inRegister={true}
            confirmPasswordValue={confirmPassword}
            confirmPasswordHandling={confirmPasswordHandler}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default Register