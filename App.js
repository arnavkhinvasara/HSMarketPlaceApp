import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import firebase from 'firebase'
import firebaseConfig from './keys/firebaseConfig'

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import Loading from './screens/Loading'
import Register from './screens/Register'
import Login from './screens/Login'
import Buy from './screens/Buy'
import Sell from './screens/Sell'
import Meetings from './screens/Meetings'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Loading' component={Loading}/>
        <Stack.Screen name='Register' component={Register}/>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Buy' component={Buy}/>
        <Stack.Screen name='Sell' component={Sell}/>
        <Stack.Screen name='Meetings' component={Meetings}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
