import React from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import colors from '../constants/colors'
import genericInfo from '../constants/genericInfo'

const UserAuthentication = props => {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.screen}>
                <View style={styles.logoContainer}>
                    <MaterialIcons name="dashboard" size={100} color={colors.primary} />
                </View>
                <View style={styles.welcome}>
                    <Text style={styles.welcomeAppText}>{genericInfo.appName}</Text>
                </View>
                <View style={styles.reglogBox}>
                    <View style={styles.reglogTextContainer}>
                        <Text style={styles.reglogText}>{props.title}!</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        { props.error !== '' ?
                            <Text style={styles.errorText}>{props.error}</Text>
                            :
                            null
                        }
                        <TextInput placeholder='Personal Email' style={styles.inputFields} value={props.emailValue} onChangeText={props.emailHandling}/>
                        <TextInput placeholder='Password' style={styles.inputFields} secureTextEntry={true} value={props.passwordValue} onChangeText={props.passwordHandling}/>
                        { props.inRegister === true ? 
                            <TextInput placeholder='Confirm Password' style={styles.inputFields} secureTextEntry={true} value={props.confirmPasswordValue} onChangeText={props.confirmPasswordHandling}/>
                            :
                            null
                        }
                        <TouchableOpacity style={styles.reglogButton} onPress={props.reglogButtonHandling}>
                            <Text style={styles.buttonText}>{props.title}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.navigateStyle} onPress={props.navigationHandling}>
                    <Text style={styles.navigateText}>{props.navigateText}</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoStyle: {
        width: '80%',
        height: '80%'
    },
    welcome: {
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeAppText: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 0.12 * Dimensions.get('window').width,
        textAlign: 'center'
    },
    reglogBox: {
        padding: 15,
        borderColor: colors.primary,
        borderWidth: 3,
        width: '80%',
        alignItems: 'center'
    },
    reglogTextContainer: {
        marginBottom: 20
    },
    reglogText: {
        textAlign: 'center',
        fontSize: 30
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 15
    },
    inputFields: {
        padding: 10,
        margin: 10,
        borderColor: colors.primary,
        borderWidth: 2,
        fontSize: 17,
        width: 200
    },
    reglogButton: {
        marginTop: 22,
        backgroundColor: colors.primary,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%'
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 19
    },
    navigateStyle: {
        margin: 20,
        marginTop: 30,
        borderBottomColor: colors.accentOne,
        borderBottomWidth: 2,
    },
    navigateText: {
        fontSize: 16
    }
})

export default UserAuthentication