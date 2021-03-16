import React, { useState } from 'react';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import { 
  Container,
  SearchArea,
  SearchInput,
  Scroller,
  ListArea,
  LoadingIcon,
  EmptyWarning
} from './styles';

import BarberItem from '../../components/BarberItem'

export default () => {

  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [emptyList, setEmptyList] = useState(false)

  const searchBarbers = async() => {
    setLoading(true)
    setList([])
    setEmptyList(false)

    if (searchText != ''){
      getBarbers()

    }
  }

  const getBarbers = async() => {
    setList([]);

    const getAvatar = async (barberId) => {
      const url = await storage().ref().child('Barbers/'+barberId+'/perfil.jpg').getDownloadURL()
      return url
    }

    const subscriber =  firestore()
      .collection('barbers')
      .onSnapshot(querySnapshot => {

        const barbers = [];
        
        async function getTodos() {
          for (const doc of querySnapshot.docs) {
            const url = await getAvatar(doc.id)

            var strName = doc.data().name
            var result = strName.indexOf(searchText) > -1

            if(result){
              barbers.push({
                ...doc.data(),
                key: doc.id,
                avatar: url
              })
            }
          }
          setList(barbers)
          setLoading(false)

          if(barbers.length === 0){
            setEmptyList(true)
          }
        }
        getTodos()

      });
    return () => subscriber();

  }

  return (
      <Container>
          <SearchArea>
            <SearchInput
              placeholder="Digite o nome do barbeiro"
              placeholderTextColor="#FFFFFF"
              value={searchText}
              onChangeText={t=>setSearchText(t)}
              onEndEditing={searchBarbers}
              returnKeyType="search"
              autoFocus
              selectTextOnFocus
            />
          </SearchArea>

          <Scroller>
            {loading &&
              <LoadingIcon size="large" color="#000000" />
            }

            {emptyList &&
              <EmptyWarning>Não achamos barbeiros com o nome "{searchText}"</EmptyWarning>
            }
            <ListArea>
              {list.map((item, key)=>(
                <BarberItem key={key} data={item} />
              ))}
            </ListArea>
          </Scroller>
      </Container>
  )
}