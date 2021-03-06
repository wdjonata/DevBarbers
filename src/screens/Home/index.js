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
  const [avat, setAvatar] = useState('')


  
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


  const getBarbers = () => {
    setLoading(true);
    setList([]);

    const subscriber = firestore()
      .collection('barbers')
      .onSnapshot(querySnapshot => {
        var barbers = [];
    
        querySnapshot.forEach(documentSnapshot => {

          const getAvatar = async() => {
            
            const url = await storage().ref().child('Barbers/'+documentSnapshot.id+'/perfil.jpg').getDownloadURL()
            return url
          }

          const getPhotos = async () => {
            const avatar = await getAvatar()
            barbers.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
              avatar: avatar
            })
          }
          
          getPhotos()

          setTimeout(() => {
            
            setLoading(false)
          },1000)
        })
        setList(barbers)

      });
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
              <BarberItem key={k} data={item}/>
            ))}

          </ListArea>

        </Scroller>
      </Container>
  )
}