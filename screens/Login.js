import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import firebase from 'firebase'

import UserAuthentication from '../components/UserAuthentication'

const Login = ({navigation}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const emailHandler = emailText => {setEmail(emailText)}
    const passwordHandler = passwordText => {setPassword(passwordText)}

    const loginButtonHandler = () => {
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            setEmail('')
            setPassword('')
            setErrorMessage('')
        })
        .catch((error) => {setErrorMessage(error.message)})
    }

    const navigationHandler = () => {
        setEmail('')
        setPassword('')
        setErrorMessage('')
        navigation.navigate('Register')
    }

    return (
        <View style={styles.container}>
            <UserAuthentication
            title='Login'
            emailHandling={emailHandler}
            emailValue={email}
            passwordHandling={passwordHandler}
            passwordValue={password}
            reglogButtonHandling={loginButtonHandler}
            error={errorMessage}
            navigateText='Do Not Have An Account? Register!'
            navigationHandling={navigationHandler}
            inRegister={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default Login