import React, { useState, useEffect } from 'react';
import { Platform, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { request, PERMISSIONS } from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import BarberItem from "../../components/BarberItem"

import { 
  Container,
  Scroller,

  HeaderArea,
  HeaderTitle,
  SearchButton,

  LocationArea,
  LocationInput,
  LocationFinder,

  LoadingIcon,
  ListArea,

} from './styles';

import MyLocation from '../../assets/my_location.svg'
import SearchIcon from '../../assets/search.svg'

export default () => {

  const navigation = useNavigation()

  const [locationText, setLocationText] = useState('')
  const [coords, setCoords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [refreshing, setRefreshing] = useState(false)


  
  const handleLocationFinder = async () => {
    setCoords(null)
    let result = await request(
      Platform.OS === 'ios' ?
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        :
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );
    if(result == 'granted') {
      setLoading(true)
      setLocationText('')
      setList([])


      Geolocation.getCurrentPosition((info) => {
        setCoords(info.coords)
        getBarbers()
      })
    }
  }




  const getBarbers = async() => {
    setLoading(true);
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
            barbers.push({
              ...doc.data(),
              key: doc.id,
              avatar: url
            })
            
          }
          console.log(barbers);
          setList(barbers)
          setLoading(false)
          console.log('Finished!');
        }
        getTodos()

        //setList(barbers)
        
        console.log(10)

      });
      console.log(20)
    return () => subscriber();
    

  }

  const onRefresh = () => {
    setRefreshing(false)
    getBarbers()
  }


  useEffect(() => {
    getBarbers()
  }, []  );

  return (
      <Container>
        <Scroller refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }>

          <HeaderArea>

            <HeaderTitle numberOfLines={2} >Encontre seu barbeiro favorito</HeaderTitle>
            <SearchButton onPress={()=>navigation.navigate('Search')}>
              <SearchIcon width="26" height="26" fill="#FFFFFF"></SearchIcon>
            </SearchButton>

          </HeaderArea>

          <LocationArea>
            <LocationInput
              placeholder="Onde você está?"
              placeholderTextColor="#FFFFFF"
              value={locationText}
              onChangeText={(t)=>setLocationText(t)}
            />
            <LocationFinder onPress={handleLocationFinder}>
              <MyLocation width="26" height="26" fill="#FFFFFF"/>
            </LocationFinder>
          </LocationArea>
          {loading &&
            <LoadingIcon size="large" color="#FFFFFF"/>
          }

          <ListArea>
            {list.map((item, k)=>(
              console.log(list),
              <BarberItem key={k} data={item}/>
            ))}

          </ListArea>

        </Scroller>
      </Container>
  )
}