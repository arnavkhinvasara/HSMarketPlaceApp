import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, Alert} from 'react-native'
import { EvilIcons } from '@expo/vector-icons';
import firebase from 'firebase'

import colors from '../constants/colors'

import Header from '../components/Header'
import BottomBar from '../components/BottomBar'
import Tile from '../components/Tile'

const Buy = ({navigation}) => {

    const [users, setUsers] = useState([])
    const [searchedItem, setSearchedItem] = useState('')
    const [itemList, setItemList] = useState([])
    const [userEmail, setUserEmail] = useState(firebase.auth().currentUser.email)

    useEffect(() => {
        const subscriber = firebase.firestore().collection('users').onSnapshot(querySnapshot => {
            const ListOfUsers = []
            querySnapshot.forEach(documentSnapshot => {
                if (documentSnapshot.data().email !== userEmail) {
                    ListOfUsers.push(documentSnapshot.data())
                }
                //ListOfUsers.push(documentSnapshot.data())
            })
            setUsers(ListOfUsers)
        })
        return () => subscriber()
    }, [])

    useEffect(() => {
        const itemsList = []
        users.forEach((docEntry) => {
            firebase.firestore().collection('users').doc(docEntry.email).collection('selling').where('itemName', '>=', searchedItem).where('available', '==', 'true').onSnapshot(querySnapshot => {
                const listOfItems = []
                querySnapshot.forEach(documentSnapshot => {
                    listOfItems.push({itemName: documentSnapshot.data().itemName, itemPrice: documentSnapshot.data().itemPrice, key: documentSnapshot.id, email: docEntry.email})
                })
                listOfItems.forEach(entry => {
                    itemsList.push(entry)
                })
                if (users.indexOf(docEntry)===users.length - 1){
                    setItemList(itemsList)
                }
            })
        })
    }, [searchedItem])
    
    const searchedItemHandler = searchedItemValue => {
        setSearchedItem(searchedItemValue)
    }

    const arrangeMeetingHandler = (name, price, email, key) => {
        Alert.alert('Confirm?', 'Are you sure you want to arrange a meeting to buy this item?', [{text: 'Yes', onPress: createMeetingHandler.bind(this, name, price, email, key)}, {text: 'No', style: 'cancel'}])
    }

    const createMeetingHandler = (name, price, email, key) => {
        const username = email.substring(0, email.indexOf('@'))
        const newId = username+'+'+key
        firebase.firestore().collection('users').doc(userEmail).collection('meetings').doc(newId).set({
            date: '', time: '', place: '', name: name, price: price, transactionSide: 'buyer', timestamp: firebase.firestore.FieldValue.serverTimestamp(), key: newId, new: 'true', message: ''
        }).then(() => {
            firebase.firestore().collection('users').doc(email).collection('selling').doc(key).set({available: 'false'}, {merge: true}).then(() => {
                setSearchedItem('')
                navigation.navigate('Meetings')
            })
        })
    }

    const logOutHandler = () => {
        setSearchedItem('')
        setUserEmail({})
        firebase.auth().signOut()
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Header title='Buy Items'/>
                <View style={styles.mainContainer}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder='Search For An Item'
                            style={styles.searchInput}
                            value={searchedItem}
                            onChangeText={searchedItemHandler}
                        />
                        <TouchableOpacity onPress={() => Keyboard.dismiss()} style={styles.searchButtonContainer}>
                            <EvilIcons name="search" size={45} color={colors.accentTwo} />
                        </TouchableOpacity>
                    </View>
                    {
                        searchedItem==='' ?
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Welcome!</Text>
                        </View>
                        :
                        <View style={styles.itemsListStyle}>
                            <Text style={styles.holdingNotif}>Press and Hold Item to Buy It</Text>
                            <FlatList persistentScrollbar={true} data={itemList} renderItem={({item}) => (
                                    <Tile
                                        itemName={item.itemName}
                                        itemPrice={item.itemPrice}
                                        seller={item.email.substring(0, item.email.indexOf('@'))}
                                        arrangeMeeting={arrangeMeetingHandler.bind(this, item.itemName, item.itemPrice, item.email, item.key)}
                                        showPrice={true}
                                        message=''
                                    />
                                )}
                            />
                        </View>
                    }
                </View>
                <BottomBar
                    buyHandler={() => {}}
                    sellHandler={() => navigation.navigate('Sell')}
                    meetingsHandler={() => navigation.navigate('Meetings')}
                    logOutHandler={logOutHandler}
                    onPage='Buy'
                />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        padding: 20,
        paddingTop: 40,
        flex: 1
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10
    },
    searchInput: {
        width: '80%',
        borderColor: colors.primary,
        borderWidth: 2,
        fontSize: 20,
        padding: 10
    },
    searchButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.accentOne
    },
    welcomeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    welcomeText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.accentTwo,
        textAlign: 'center'
    },
    itemsListStyle: {
        flex: 1
    },
    holdingNotif: {
        textAlign: 'center',
        color: 'black'
    }
})

export default Buy