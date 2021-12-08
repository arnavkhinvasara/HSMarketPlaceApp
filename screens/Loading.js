import React, { useEffect} from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import firebase from 'firebase'

import colors from '../constants/colors'

const Loading = ({navigation}) => {

    useEffect(() => {
        firebase
        .auth()
        .onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate('Buy')
            } else {
                navigation.navigate('Register')
            }
        })
    }, [])

    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={100} color={colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Loading