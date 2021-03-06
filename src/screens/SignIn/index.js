import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

import SignInput from '../../components/SignInput'

import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg'
import LockIcon from '../../assets/lock.svg'

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

    const [ emailField, setEmailField ]  = useState('')
    const [ passwordField, setPasswordField ] = useState('')

    const handleSignClick = () => {
        auth()
            .signInWithEmailAndPassword( emailField, passwordField )
            .then(() => {
                navigation.reset({
                    routes: [{name: 'MainTab'}]
                });
            })
            .catch(error => {
                alert(error.code)
                console.log(error.code)
            })
        
    }

    const handleMessageButtomClick = () => {
        navigation.reset({
            routes: [{name: 'SignUp'}]
        });

    }

    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            <InputArea>
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
                    <CustomButtomText>LOGIN</CustomButtomText>
                </CustomButton>
            </InputArea>
            
            <SignMessageButtom onPress={handleMessageButtomClick} >
                <SignMessageButtomText>Ainda não possui uma conta?</SignMessageButtomText>
                <SignMessageButtomBold>Cadastre-se</SignMessageButtomBold>
            </SignMessageButtom>
        </Container>
    )
}