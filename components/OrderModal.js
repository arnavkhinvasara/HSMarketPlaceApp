import React, { useState } from 'react'
import { View, Text, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Alert, Keyboard } from 'react-native'
import firebase from 'firebase'

import { Ionicons } from '@expo/vector-icons'

import colors from '../constants/colors'

const OrderModal = props => {

    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState('')

    const setNameHandler = inputText => setItemName(inputText)
    const setPriceHandler = inputText => setItemPrice(inputText.replace('$', ''))

    const enterItemHandler = () => {
        if (itemName.length>0 && itemPrice.length>0){
            Alert.alert('Confirm?', 'Is your item entry finalized?', [{text: 'Yes', onPress: addItemHandler}, {text: 'No', style: 'cancel'}])
        }
    }

    const addItemHandler = () => {
        const user = firebase.auth().currentUser
        const userEmail = user.email
        firebase.firestore().collection('users').doc(userEmail).collection('selling').doc().set({itemName: itemName, itemPrice: itemPrice, timestamp: firebase.firestore.FieldValue.serverTimestamp(), available: 'true'}).then(
            () => closeModalHandler()
        )
    }

    const closeModalHandler = () => {
        setItemName('')
        setItemPrice('')
        props.closeModal()
    }

    return (
        <Modal visible={props.visible} animationType='slide'>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.wholeModal}>
                    <ScrollView>
                        <TouchableOpacity onPress={closeModalHandler}>
                            <View style={styles.cancelStyle}>
                                <Ionicons name='md-close-circle' size={50} color={colors.accentOne}/>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.modalHeading}>
                            <Text style={styles.modalHeadingText}>Item Info Form</Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <TextInput placeholder='Item Name (descriptive)' multiline={true} value={itemName} onChangeText={setNameHandler} style={styles.itemInputStyle}/>
                        </View>
                        <View style={styles.itemContainer}>
                            <TextInput placeholder='Item Price (dollars)' value={itemPrice} onChangeText={setPriceHandler} style={styles.itemInputStyle}/>
                        </View>
                        <TouchableOpacity style={styles.submitInfoContainer} onPress={enterItemHandler}>
                            <Text style={styles.submitInfoText}>Enter Item Into Market</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    wholeModal: {
        padding: 20,
        flex: 1,
        alignItems: 'center'
    },
    cancelStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalHeading: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40
    },
    modalHeadingText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.accentTwo,
        fontStyle: 'italic'
    },
    itemContainer: {
        borderColor: colors.primary,
        borderWidth: 2,
        backgroundColor: 'gainsboro',
        color: 'black',
        paddingHorizontal: 7,
        paddingVertical: 5,
        marginVertical: 20
    },
    itemInputStyle: {
        fontSize: 25
    },
    submitInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.accentOne,
        borderRadius: 7
    },
    submitInfoText: {
        color: colors.accentTwo,
        fontSize: 20
    }
})

export default OrderModal