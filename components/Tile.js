import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

import colors from '../constants/colors'

const Tile = props => {

    const styler = () => {
        if (props.new=='true'){
            return {backgroundColor: colors.primary}
        }
        return {backgroundColor: colors.accentOne}
    }

    return (
        <TouchableOpacity style={{...styles.tileStyle, ...styler()}} onLongPress={props.arrangeMeeting} onPress={props.arrangeMeetingMore}>
            <Text style={styles.tileText}>Item Name: <Text style={styles.innerText}>{props.itemName}</Text></Text>
            { props.showPrice===true
                ?
                <Text style={styles.tileText}>Item Price: <Text style={styles.innerText}>${props.itemPrice}</Text></Text>
                : null
            }
            <Text style={styles.tileText}>Other Party: <Text style={styles.innerText}>{props.seller}</Text></Text>
            { props.message!== ''
                ?
                <Text style={styles.tileText}>IMPORTANT MESSAGE: <Text style={styles.innerText}>Transaction {props.message}. Press to remove.</Text></Text>
                : null
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    tileStyle: {
        margin: 8,
        padding: 8,
        borderRadius: 5
    },
    tileText: {
        fontSize: 18
    },
    innerText: {
        fontWeight: 'bold'
    }
})

export default Tile