import React, { useState, useEffect} from 'react';

import { useNavigation, useRoute } from '@react-navigation/native'
import Swiper from 'react-native-swiper'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import Stars from '../../components/Stars'

import FavoriteFullIcon from '../../assets/favorite_full.svg' 
import FavoriteIcon from '../../assets/favorite.svg'
import BackIcon from '../../assets/back.svg'

import { Container,
  Scroller,
  PageBody,
  BackButton,
  LoadingIcon,

  UserInfoArea,
  UserAvatar,
  UserInfo,
  UserInfoName,
  UserFavButton,

  SwipeDot,
  SwipeDotActive,
  SwipeItem,
  SwipeImage,
  FakeSwiper,

  ServiceArea,
  ServicesTitle,
  ServiceItem,
  ServiceInfo,
  ServiceName,
  ServicePrice,
  ServiceChooseButton,
  ServiceChooseBtnText,

  TestimonialArea
} from './styles';


export default () => {

  const navigation = useNavigation()
  const route = useRoute()

  const [userInfo, setUserInfo] = useState({
    id: route.params.id,
    avatar: route.params.avatar,
    name: route.params.name,
    stars: route.params.stars,
    services: route.params.services

  })
  const [barberPhotos, setBarberPhotos] = useState({})
  const [loading, setLoading] = useState(false)
  const [favorite, setFavorite] = useState(false)

  useEffect(()=>{
    getBarber()
    console.log(userInfo.services)
  }, [])

  const getBarber = () => {
    let photos = []
    
    setLoading(true)

    const getPhotosServices = async () => {

      var storageRef = storage().ref().child('Barbers/'+userInfo.id+'/Services')
      await storageRef.listAll().then(async(result)=>{

        async function getTodos() {
          for (const photo of result.items) {
            const url = await photo.getDownloadURL()
            photos.push(url)
            
          }
          console.log(photos);
          setBarberPhotos(photos)
          console.log('Finished!');
        }
        getTodos()
        
      })
    }

    getPhotosServices().then(
      setLoading(false)
    )
    
  }


  const handleBackButton = () => {
    navigation.goBack()
  }

  return (
      <Container>
          <Scroller>
            {barberPhotos && barberPhotos.length > 0 ?
              <Swiper 
                style={{height: 240}}
                dot={<SwipeDot/>}
                activeDot={<SwipeDotActive/>}
                paginationStyle={{top: 15, right: 15, bottom: null, left: null}}
                autoplay={true}
              >
                {barberPhotos.map((item, key)=>(
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
                  {favorited ?
                    <FavoriteFullIcon width="24" height="24" fill="#FF0000"/>
                    :
                    <FavoriteIcon width="24" height="24" fill="#FF0000"/>
                  }
                  
                </UserFavButton>

              </UserInfoArea>

              {loading &&
                  <LoadingIcon size="large" color="#000000"/>
              }

              {userInfo.services &&
                <ServiceArea>
                  <ServicesTitle>Lista de serviços</ServicesTitle>

                  {userInfo.services.map((item, key) => (
                    <ServiceItem key={key}>
                      <ServiceInfo>
                        <ServiceName>{item.name}</ServiceName>
                        <ServicePrice>R$ {item.value}</ServicePrice>
                      </ServiceInfo>
                      <ServiceChooseButton>
                        <ServiceChooseBtnText>Agendar</ServiceChooseBtnText>
                      </ServiceChooseButton>
                    </ServiceItem>
                  ))}
              
                </ServiceArea>
              }
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