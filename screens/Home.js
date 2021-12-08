import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from 'firebase'

import colors from '../constants/colors'

import Buy from './Buy'
import Sell from './Sell'
import Meetings from './Meetings'

const Home = props => {

    const [page, setPage] = useState('Buy')

    const logOutHandler = () => {
        setPage('Buy')

        firebase
        .auth()
        .signOut()
    }

    const pageSpecificStyle = pageValue => {
        if (pageValue===page) {
            return {borderTopWidth: 0}
        } else {
            return {}
        }
    }

    return (
        <View style={styles.screen}>
            { page==='Buy' ? <Buy/> : page==='Sell' ? <Sell/> : <Meetings/>}
            <View style={styles.bottomBarContainer}>
                <TouchableOpacity onPress={() => {setPage('Buy')}} style={{...styles.bottomButtonContainer, ...styles.middleLineStyle, ...pageSpecificStyle('Buy')}}>
                    <Text style={styles.bottomButtonText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setPage('Sell')}} style={{...styles.bottomButtonContainer, ...styles.middleLineStyle, ...styles.secondMiddleLineStyle, ...pageSpecificStyle('Sell')}}>
                    <Text style={styles.bottomButtonText}>Sell</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setPage('Meetings')}} style={{...styles.bottomButtonContainer, ...styles.meetingsButtonStyle, ...styles.middleLineStyle, ...styles.secondMiddleLineStyle, ...pageSpecificStyle('Meetings')}}>
                    <Text style={styles.bottomButtonText}>Meetings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logOutHandler} style={{...styles.bottomButtonContainer, ...styles.secondMiddleLineStyle}}>
                    <Text style={styles.bottomButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    bottomBarContainer: {
        flexDirection: 'row',
    },
    bottomButtonContainer: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderTopColor: colors.primary,
        borderTopWidth: 3
    },
    meetingsButtonStyle: {
        width: '40%'
    },
    middleLineStyle: {
        borderRightColor: colors.primary,
        borderRightWidth: 1
    },
    secondMiddleLineStyle: {
        borderLeftColor: colors.primary,
        borderLeftWidth: 1
    },
    bottomButtonText: {
        textAlign: 'center',
        fontSize: 20
    }
})

export default Home