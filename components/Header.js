import React from 'react'
import { View, Text, StyleSheet} from 'react-native'

import colors from '../constants/colors'
import genericInfo from '../constants/genericInfo'

const Header = props => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{genericInfo.appName} - {props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        paddingTop: 40,
        paddingHorizontal: 15,
        paddingBottom: 20,
        borderBottomColor: colors.primary,
        borderBottomWidth: 2
    },
    headerText: {
        fontSize: 30
    }
})

export default Header