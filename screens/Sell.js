import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert} from 'react-native'
import firebase from 'firebase'

import colors from '../constants/colors'

import Header from '../components/Header'
import BottomBar from '../components/BottomBar'
import OrderModal from '../components/OrderModal'

const Sell = ({navigation}) => {

    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const [userEmail, setUserEmail] = useState(firebase.auth().currentUser.email)
    
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('users').doc(userEmail).collection('selling').orderBy('timestamp', 'desc')
            .onSnapshot(querySnapshot => {
                const items = []
                querySnapshot.forEach(documentSnapshot => {
                    items.push({...documentSnapshot.data(), key: documentSnapshot.id})
                })
                setItems(items)
                setLoading(false)
            })
        return () => subscriber()
    }, [], loading)

    const deleteItemHandler = documentId => {
        Alert.alert('Confirm?', 'Are you sure you want to delete this item from the market?', [{text: 'Yes', onPress: deletingItemFromFirebaseHandler.bind(this, documentId)}, {text: 'No', style: 'cancel'}])
    }

    const deletingItemFromFirebaseHandler = async(docId) => {
        const removal = await firebase.firestore().collection('users').doc(userEmail).collection('selling').doc(docId).delete()
    }
    
    const visibilityHandler = () => {
        setIsVisible(false)
    }

    const logOutHandler = () => {
        setUserEmail({})
        setIsVisible(false)
        setLoading(true)
        setItems([])
        firebase.auth().signOut()
    }

    return (
        <View style={styles.container}>
            <Header title='Sell an Item'/>
            <View style={styles.mainContainer}>
                <View style={styles.sellButton}>
                    <TouchableOpacity style={styles.sellButtonContainer} onPress={() => setIsVisible(true)}>
                        <Text style={styles.sellButtonText}>Sell an Item</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemsOnMarketContainer}>
                    <View style={styles.onMarketTitle}>
                        <Text style={styles.onMarketText}>Your Items</Text>
                    </View>
                    <View><Text>Hold to remove from market</Text></View>
                    <View style={styles.flatlistSurround}>
                        { loading ?
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size={25} color={colors.primary}/>
                            </View>
                            :
                            <FlatList
                                data={items}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.itemContainer} onLongPress={deleteItemHandler.bind(this, item.key)}>
                                        <Text style={styles.itemText}>Item: {item.itemName}</Text>
                                        <Text style={styles.itemText}>Price: ${item.itemPrice}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        }
                    </View>
                </View>
            </View>
            <BottomBar
                buyHandler={() => navigation.navigate('Buy')}
                sellHandler={() => {}}
                meetingsHandler={() => navigation.navigate('Meetings')}
                logOutHandler={logOutHandler}
                onPage='Sell'
            />
            <OrderModal visible={isVisible} closeModal={visibilityHandler}/>
        </View>
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
    sellButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sellButtonContainer: {
        marginVertical: 10,
        backgroundColor: colors.accentOne,
        padding: 10,
        borderRadius: 20,
        width: '90%',
        alignItems: 'center'
    },
    sellButtonText: {
        textAlign: 'center',
        fontSize: 30,
        color: colors.accentTwo
    },
    itemsOnMarketContainer: {
        flex: 1,
        margin: 20,
        borderColor: colors.primary,
        borderWidth: 3,
        alignItems: 'center',
        borderRadius: 7
    },
    onMarketTitle: {
        borderColor: colors.primary,
        borderBottomWidth: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    onMarketText: {
        textAlign: 'center',
        fontSize: 30,
        padding: 5
    },
    flatlistSurround: {
        flex: 1
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 7
    },
    itemText: {
        fontSize: 20
    }
})

export default Sell