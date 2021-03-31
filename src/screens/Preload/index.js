import React, { useEffect } from 'react';

import { Container, LoadingIcon } from './styles';
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from '@react-navigation/native'

import { firebase } from "@react-native-firebase/auth"

import BarberLogo from '../../assets/barber.svg';

export default () => {

    const navigation = useNavigation()

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user)=>{
            if(user) {
                navigation.navigate('MainTab')
            } else {
                navigation.navigate('SignIn')
            }
        })

    })
    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            <LoadingIcon  size="large" color="#FFFFFF" />
        </Container>
    )
}