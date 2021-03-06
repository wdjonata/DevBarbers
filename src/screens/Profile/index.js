import React from 'react';
import { Text } from 'react-native';

import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'

import { Container, CustomButton,CustomButtomText } from './styles';

export default () => {

  const navigation = useNavigation()

  const handleClick = () => {
    auth().signOut()

    navigation.reset({
      routes: [{name: 'Preload'}]
  });
  }
  return (
      <Container>
          <Text>Profile</Text>
          <CustomButton onPress={handleClick}>
            <CustomButtomText>Sair</CustomButtomText>
          </CustomButton>
      </Container>
  )
}