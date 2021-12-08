import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, Alert, Keyboard, ScrollView, ActivityIndicator } from 'react-native'
import firebase from 'firebase'

import { Ionicons } from '@expo/vector-icons'

import colors from '../constants/colors'

const MeetingModal = props => {

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [place, setPlace] = useState('')
    const [tempDate, setTempDate] = useState('')
    const [tempTime, setTempTime] = useState('')
    const [tempPlace, setTempPlace] = useState('')
    const [loading2, setLoading2] = useState(true)
    const [availabilitySetter, setAvailabilitySetter] = useState(true)
    const [userEmail, setUserEmail] = useState(firebase.auth().currentUser.email)

    const setDateHandler = inputText => setDate(inputText)
    const setTimeHandler = inputText => setTime(inputText)
    const setPlaceHandler = inputText => setPlace(inputText)

    const displayHandler = () => {
        const subscriber = firebase.firestore().collection('users').doc(userEmail).collection('meetings').where('key', '==', props.keyInfo).onSnapshot(qsnapshot => {
            qsnapshot.forEach(docsnap => {
                setDate(docsnap.data().date)
                setTime(docsnap.data().time)
                setPlace(docsnap.data().place)
                setTempDate(docsnap.data().date)
                setTempTime(docsnap.data().time)
                setTempPlace(docsnap.data().place)
            })
            setLoading2(false)
        })
        return () => subscriber
    }

    const deleteHandler = () => {
        const seller = props.keyInfo.substring(0, props.keyInfo.indexOf('+'))+'@gmail.com'
        const sellerId = props.keyInfo.substring(props.keyInfo.indexOf('+')+1, props.keyInfo.length)
        const idForSeller = userEmail.substring(0, userEmail.indexOf('@')) + "+" + sellerId
        let updateAvailableUser = seller
        if (props.tSideInfo==='seller'){
            updateAvailableUser = userEmail
        }
        if (messageInfo==='confirmed' && tSideInfo==='seller'){
            Alert.alert('Confirmation', 'IMPORTANT: Do you want to keep this item on the market?', [{text: 'Yes'}, {text: 'No', onPress: setAvailabilitySetter(false)}])
        }
        firebase.firestore().collection('users').doc(userEmail).collection('meetings').doc(props.keyInfo).delete().then(() => {
            firebase.firestore().collection('users').doc(updateAvailableUser).collection('selling').doc(sellerId).set({available: availabilitySetter}, {merge: true}).then(() => {
                firebase.firestore().collection('users').doc(seller).collection('meetings').doc(idForSeller).get().then((docExister) => {
                    if (docExister.exists){
                        firebase.firestore().collection('users').doc(seller).collection('meetings').doc(idForSeller).set({message: 'deleted', new: 'true'}, {merge: true}).then(
                            () => closeModalHandler()
                        )
                    } else{
                        closeModalHandler()
                    }
                })
            })
        })
    }

    const enterEntryHandler = () => {
        if (date.length>0 && time.length>0 && place.length>0){
            Alert.alert('Confirm?', 'Is your entry finalized?', [{text: 'Yes', onPress: updateLogisticsHandler}, {text: 'No', style: 'cancel'}])
        }
    }

    const updateLogisticsHandler = () => {
        let newTSide = 'seller'
        if (props.tSideInfo==='seller'){
            newTSide = 'buyer'
        }
        let newForMe = 'false'
        let message = ''
        console.log(date)
        console.log(tempDate)
        if (date===tempDate && time===tempTime && place===tempPlace){
            newForMe = 'true'
            message = 'confirmed'
        }
        const idForSeller = userEmail.substring(0, userEmail.indexOf('@')) + "+" + props.keyInfo.substring(props.keyInfo.indexOf('+')+1, props.keyInfo.length)
        const seller = props.keyInfo.substring(0, props.keyInfo.indexOf('+'))+'@gmail.com'
        firebase.firestore().collection('users').doc(userEmail).collection('meetings').doc(props.keyInfo).set({date: date, time: time, place: place, timestamp: firebase.firestore.FieldValue.serverTimestamp(), new: newForMe, message: message}, {merge: true}).then(() => {
            firebase.firestore().collection('users').doc(seller).collection('meetings').doc(idForSeller).set({date: date, time: time, place: place, key: idForSeller, name: props.name, price: props.price, timestamp: firebase.firestore.FieldValue.serverTimestamp(), new: 'true', transactionSide: newTSide, message: message}, {merge: true}).then(
                () => closeModalHandler()
            )
        })
    }

    const closeModalHandler = () => {
        setDate('')
        setTime('')
        setPlace('')
        setLoading2(true)
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
                            <Text style={styles.modalHeadingText}>Item Transaction Logistics</Text>
                        </View>
                        <View>
                            <Text>With this form, you input the meeting logistics that work for you and wait for agreement from the other party. If the other party does not give consensus, they will update the logistics and wait for you.</Text>
                            <Text>{'\n'}</Text>
                            <Text style={styles.labelEntry}>Item: <Text style={styles.itemEntry}>{props.name}</Text></Text>
                            <Text style={styles.labelEntry}>Price: <Text style={styles.itemEntry}>${props.price}</Text></Text>
                        </View>
                        { loading2 ? 
                            <View>
                                <Text>{'\n'}</Text>
                                <TouchableOpacity onPress={displayHandler} style={styles.showButtonStyle}><Text style={styles.showButtonText}>Show Meeting Info</Text></TouchableOpacity>
                                <Text>{'\n'}</Text>
                                <TouchableOpacity onPress={deleteHandler} style={styles.showButtonStyle}><Text style={styles.showButtonText}>Cancel Item Transaction</Text></TouchableOpacity>
                            </View>
                            :
                            <View>
                                <View style={styles.itemContainer}>
                                    <TextInput placeholder='Date' value={date} onChangeText={setDateHandler} style={styles.entryInputStyle}/>
                                </View>
                                <View style={styles.itemContainer}>
                                    <TextInput placeholder='Time' value={time} onChangeText={setTimeHandler} style={styles.entryInputStyle}/>
                                </View>
                                <View style={styles.itemContainer}>
                                    <TextInput placeholder='Place' value={place} onChangeText={setPlaceHandler} style={styles.entryInputStyle}/>
                                </View>
                                <TouchableOpacity style={styles.submitInfoContainer} onPress={enterEntryHandler}>
                                    <Text style={styles.submitInfoText}>Update/Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        }
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
        fontStyle: 'italic',
        textAlign: 'center'
    },
    labelEntry: {
        fontSize: 20
    },
    itemEntry: {
        fontWeight: 'bold'
    },
    showButtonStyle: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 5
    },
    showButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
    entryInputStyle: {
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

export default MeetingModal