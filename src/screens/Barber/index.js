import React, { useState, useEffect} from 'react';

import { useNavigation, useRoute } from '@react-navigation/native'
import Swiper from 'react-native-swiper'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import Stars from '../../components/Stars'

import FavoriteIcon from '../../assets/favorite.svg'
import BackIcon from '../../assets/back.svg'

import { Container,
  Scroller,
  PageBody,
  UserInfoArea,
  ServiceArea,
  TestimonialArea,
  FakeSwiper,
  UserAvatar,
  UserInfo,
  UserInfoName,
  UserFavButton,
  SwipeDot,
  SwipeDotActive,
  SwipeItem,
  SwipeImage,
  BackButton
} from './styles';


export default () => {

  const navigation = useNavigation()
  const route = useRoute()

  const [userInfo, setUserInfo] = useState({
    id: route.params.id,
    avatar: route.params.avatar,
    name: route.params.name,
    stars: route.params.stars,
    photos: [],
    services: []

  })

  useEffect(()=>{
    getBarber()
  })

  const getBarber = () => {
    let photos = []

    const getPhotosServices = async () => {

      var storageRef = storage().ref().child('Barbers/'+userInfo.id+'/Services')
      await storageRef.listAll().then((result)=>{
        result.items.forEach((imageRef)=>{
          imageRef.getDownloadURL().then((url)=> {
            
            photos.push(url)
          })
        })
      })
    }

    const getInfoBarber = async() => {
      const subscriber = firestore()
        .collection('barbers')
        .doc(userInfo.id)
        .onSnapshot(documentSnapshot => {
          console.log(userInfo.id,userInfo.name)
          
      })
      return () => subscriber();
    }

    const setInfoBarber = async() => {
      //await getPhotosServices()
      await getInfoBarber()
      
      //console.log(userInfo.services)
    }
    setInfoBarber()
    //setUserInfo(prevState => {
    //  return { ...prevState, photos: photos }
    //});
  }


  const handleBackButton = () => {
    navigation.goBack()
  }

  return (
      <Container>
          <Scroller>
            {userInfo.photos && userInfo.photos.length > 0 ?
              <Swiper 
                style={{height: 240}}
                dot={<SwipeDot/>}
                activeDot={<SwipeDotActive/>}
                paginationStyle={{top: 15, right: 15, bottom: null, left: null}}
                autoplay={true}
              >
                {userInfo.photos.map((item, key)=>(
                  <SwipeItem key={key}>
                    <SwipeImage source={{uri: item}} resizeMode="cover"/>
                  </SwipeItem>
                ))}
              </Swiper>
              :
              <FakeSwiper>

              </FakeSwiper>
            }
            
            <PageBody>
              <UserInfoArea>
                <UserAvatar source={{uri: userInfo.avatar}}/>
                <UserInfo>
                  <UserInfoName>{userInfo.name}</UserInfoName>
                  <Stars stars={userInfo.stars} showNumber={true}/>
                    
                </UserInfo>
                <UserFavButton>
                  <FavoriteIcon width="24" height="24" fill="#FF0000"/>
                </UserFavButton>

              </UserInfoArea>
              <ServiceArea>

              </ServiceArea>
              <TestimonialArea>
                
              </TestimonialArea>
            </PageBody>
          </Scroller>
          <BackButton onPress={handleBackButton}>
            <BackIcon width="44" height="44" fill="#FFFFFF"/>
          </BackButton>
      </Container>
  )
}