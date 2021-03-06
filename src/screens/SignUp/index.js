import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import auth, {firebase} from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import SignInput from '../../components/SignInput'

import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg'
import LockIcon from '../../assets/lock.svg'
import PersonIcon from '../../assets/person.svg'

import { 
    Container,
    InputArea,
    CustomButton,
    CustomButtomText,
    SignMessageButtom,
    SignMessageButtomText,
    SignMessageButtomBold
} from './styles';

export default () => {

    const navigation = useNavigation()

    const [ nameField, setNameField ]  = useState('')
    const [ emailField, setEmailField ]  = useState('')
    const [ passwordField, setPasswordField ] = useState('')

    const handleSignClick = () => {
        auth()
            .createUserWithEmailAndPassword( emailField, passwordField )
            .then(data => {
                const uid = data.user.uid
                const users = firestore().collection('users')
                users.doc(uid).set({
                    email: emailField, name: nameField
                })
                console.log('User account created & signed in!');
                alert("User account created & signed in!")

                logout()

                navigation.reset({
                    routes: [{name: 'SignIn'}]
                });
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                alert("That email address is already in use!")
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    alert("That email address is invalid!")
                }

                console.error(error);
            });
        
    }

    const handleMessageButtomClick = () => {
        navigation.reset({
            routes: [{name: 'SignIn'}]
        });

    }

    const logout = async() => {
        await auth().signOut()
    }

    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            <InputArea>
                <SignInput
                    IconSvg={PersonIcon}
                    placeholder="Digite seu nome"
                    value={nameField}
                    onChangeText={text => setNameField(text)}
                />
                <SignInput 
                    IconSvg={EmailIcon}
                    placeholder="Digite seu email"
                    value={emailField}
                    onChangeText={text => setEmailField(text)}
                />
                <SignInput 
                    IconSvg={LockIcon}
                    placeholder="Digite sua senha"
                    value={passwordField}
                    onChangeText={text => setPasswordField(text)}
                    password={true}
                />

                <CustomButton onPress={handleSignClick} >
                    <CustomButtomText>CADASTRAR</CustomButtomText>
                </CustomButton>
            </InputArea>
            
            <SignMessageButtom onPress={handleMessageButtomClick} >
                <SignMessageButtomText>Já possui uma conta?</SignMessageButtomText>
                <SignMessageButtomBold>Faça Login</SignMessageButtomBold>
            </SignMessageButtom>
        </Container>
    )
}