import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList} from 'react-native'
import firebase from 'firebase'

import Header from '../components/Header'
import BottomBar from '../components/BottomBar'
import colors from '../constants/colors'

import Tile from '../components/Tile'
import MeetingModal from '../components/MeetingModal'

const Meetings = ({navigation}) => {

    const [buyerList, setBuyerList] = useState([])
    const [sellerList, setSellerList] = useState([])
    const [loading, setLoading] = useState(true) //set to true as default
    const [userEmail, setUserEmail] = useState(firebase.auth().currentUser.email)
    const [nameInfo, setNameInfo] = useState('')
    const [priceInfo, setPriceInfo] = useState('')
    const [tSideInfo, setTSideInfo] = useState('')
    const [messageInfo, setMessageInfo] = useState('')
    const [keyInfo, setKeyInfo] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('users').doc(userEmail).collection('meetings').orderBy('timestamp', 'desc')
            .onSnapshot(querySnapshot => {
                const buyerItems = []
                const sellerItems = []
                querySnapshot.forEach(documentSnapshot => {
                    object = {...documentSnapshot.data(), key: documentSnapshot.id}
                    if (documentSnapshot.data().transactionSide==='buyer') {
                        buyerItems.push(object)
                    } else {
                        sellerItems.push(object)
                    }
                })
                setBuyerList(buyerItems)
                setSellerList(sellerItems)
                setLoading(false)
            })
        return () => subscriber()
    }, [])

    const arrangeMeetingHandler = (name, price, key, tSide, message) => {
        setNameInfo(name)
        setPriceInfo(price)
        setKeyInfo(key)
        setTSideInfo(tSide)
        setMessageInfo(message)
        setIsVisible(true)
    }

    const visibilityHandler = () => {
        setIsVisible(false)
        setNameInfo('')
        setPriceInfo('')
        setKeyInfo('')
    }

    const logOutHandler = () => {
        setBuyerList([])
        setSellerList([])
        setLoading(true)
        setUserEmail({})
        firebase.auth().signOut()
    }

    return (
        <View style={styles.container}>
            <Header title='On Campus Meetings'/>
            <View style={styles.mainContainer}>
                <View style={styles.infoMessageHolder}>
                    <Text style={styles.infoMessage}>Edit item logistics (press on item). Only remove confirmed transaction after transaction occurs.</Text>
                </View>
                <View style={styles.meetingTableBox}>
                    <View style={styles.asASide}>
                        <View style={styles.title}><Text style={styles.titleText}>As a Buyer</Text></View>
                        { loading ? 
                            <View style={styles.loadingContainer}><ActivityIndicator/><ActivityIndicator size={25} color={colors.primary}/></View>
                            :
                            <FlatList data={buyerList} renderItem={({item}) => (
                                <Tile
                                    showPrice={false}
                                    itemName={item.name}
                                    itemPrice={item.price}
                                    new={item.new}
                                    message={item.message}
                                    seller={item.key.substring(0, item.key.indexOf('+'))}
                                    arrangeMeetingMore={arrangeMeetingHandler.bind(this, item.name, item.price, item.key, 'buyer', item.message)}
                                />
                            )} />
                        }
                    </View>
                    <View style={styles.asASide}>
                        <View style={styles.title}><Text style={styles.titleText}>As a Seller</Text></View>
                        { loading ? 
                            <View style={styles.loadingContainer}><ActivityIndicator/><ActivityIndicator size={25} color={colors.primary}/></View>
                            :
                            <FlatList data={sellerList} renderItem={({item}) => (
                                <Tile
                                    showPrice={false}
                                    itemName={item.name}
                                    itemPrice={item.price}
                                    new={item.new}
                                    message={item.message}
                                    seller={item.key.substring(0, item.key.indexOf('+'))}
                                    arrangeMeetingMore={arrangeMeetingHandler.bind(this, item.name, item.price, item.key, 'seller', item.message)}
                                />
                            )} />
                        }
                    </View>
                </View>
            </View>
            <BottomBar
                buyHandler={() => navigation.navigate('Buy')}
                sellHandler={() => navigation.navigate('Sell')}
                meetingsHandler={() => {}}
                logOutHandler={logOutHandler}
                onPage='Meetings'
            />
            <MeetingModal visible={isVisible} closeModal={visibilityHandler} name={nameInfo} price={priceInfo} keyInfo={keyInfo} tSideInfo={tSideInfo} messageInfo={messageInfo}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        padding: 20,
        flex: 1
    },
    infoMessage: {
        textAlign: 'center'
    },
    meetingTableBox: {
        flex: 1,
        alignItems: 'center'
    },
    asASide: {
        margin: 10,
        flex: 2,
        borderColor: colors.accentTwo,
        borderWidth: 2,
        width: '100%',
        alignItems: 'center'
    },
    title: {
        borderBottomWidth: 2,
        borderBottomColor: colors.accentOne,
        marginBottom: 7
    },
    titleText: {
        fontSize: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Meetings