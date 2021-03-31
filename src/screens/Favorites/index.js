import React, { useState, useEffect } from 'react';
import { RefreshControl } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { firebase } from "@react-native-firebase/auth"

import { 
  Container,

  HeaderArea,
  HeaderTitle,
 
  Scroller,
  ListArea,
  EmptyWarning
} from './styles';

import BarberItem from '../../components/BarberItem'

export default () => {

  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    getFavorites()
    console.log(list)
  }, []  );

  const getIdUser = async() => {
    const data = await firebase.auth().currentUser
    return data.uid
  }

  const getFavorites = async() => {
    setLoading(true)
    setList([])

    await getFavoriteList()

  }

    
  const getFavoriteList = async() => {

    const userId = await getIdUser()

    const listId = (await firestore().collection('users').doc(userId).get()).data().favorites
    
    console.log(listId)
    
    await getBarbers(listId)
    
  }

  const getBarbers = async(listId) => {
    
    const barbersFav = [];

    for(const barberId of listId) {
      console.log(123,barberId)

      const subscriber = (await firestore().collection('barbers').doc(barberId).get()).data()

      async function getTodos() {

        const url = await getAvatar(barberId)

        barbersFav.push({
          ...subscriber,
          key: barberId,
          avatar: url
        })

      }
      await getTodos()

    }
    setList(barbersFav)
    setLoading(false)

  }

  const getAvatar = async (barberId) => {
    const url = await storage().ref().child('Barbers/'+barberId+'/perfil.jpg').getDownloadURL()
    return url
  }

  return (
    <Container>
      <HeaderArea>
        <HeaderTitle>Favoritos</HeaderTitle>
      </HeaderArea>

      <Scroller refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getFavorites}/>
      }>
        {!loading && list.length === 0 &&
          <EmptyWarning>Não há favoritos.</EmptyWarning>
        }

        <ListArea>
          {list.map((item, key)=>(
            console.log(23,item),
            <BarberItem key={key} data={item} />
          ))}
        </ListArea>
      </Scroller>
    </Container>
  )
}