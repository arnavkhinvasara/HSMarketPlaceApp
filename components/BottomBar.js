import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

import colors from '../constants/colors'

const BottomBar = props => {

    const pageSpecificStyle = page => {
        if (page===props.onPage) {
            return {borderTopWidth: 0}
        }
    }
    
    return (
        <View style={styles.bottomBarContainer}>
            <TouchableOpacity onPress={props.buyHandler} style={{...styles.bottomButtonContainer, ...styles.middleLineStyle, ...pageSpecificStyle('Buy')}}>
                <Text style={styles.bottomButtonText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.sellHandler} style={{...styles.bottomButtonContainer, ...styles.middleLineStyle, ...styles.secondMiddleLineStyle, ...pageSpecificStyle('Sell')}}>
                <Text style={styles.bottomButtonText}>Sell</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.meetingsHandler} style={{...styles.bottomButtonContainer, ...styles.meetingsButtonStyle, ...styles.middleLineStyle, ...styles.secondMiddleLineStyle, ...pageSpecificStyle('Meetings')}}>
                <Text style={styles.bottomButtonText}>Meetings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.logOutHandler} style={{...styles.bottomButtonContainer, ...styles.secondMiddleLineStyle}}>
                <Text style={styles.bottomButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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

export default BottomBar