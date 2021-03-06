import React from 'react';
import styled from 'styled-components/native'

import HomeIcon from '../assets/home.svg'
import SearchIcon from '../assets/search.svg'
import TodayIcon from '../assets/today.svg'
import FavoriteIcon from '../assets/favorite.svg'
import AccountIcon from '../assets/account.svg'

const TabArea = styled.View`
    height: 60px;
    background-color: #4EADBE;
    flex-direction: row;
`;

const TabItem = styled.TouchableOpacity`
    flex: 1;
    alignItems: center;
    justifyContent: center;
`;

const TabItemCenter = styled.TouchableOpacity`
    width: 70px;
    height: 70px;
    alignItems: center;
    justifyContent: center;
    background-color: #FFF;
    border-radius: 35px;
    border: 3px solid #4EADBE;
    margin-top: -20px;
`;

export default ({ state, navigation}) => {

    const goTo = (screenName) => {
        navigation.navigate(screenName)
    }

    return (
        <TabArea>
            <TabItem onPress={() => goTo('Home')}>
                <HomeIcon style={{opacity: state.index===0? 1 : 0.5}} width="24"  height="24" fill="#FFFFFF"/>
            </TabItem >
            <TabItem onPress={() => goTo('Search')}>
                <SearchIcon style={{opacity: state.index===1? 1 : 0.5}} width="24"  height="24" fill="#FFFFFF"/>
            </TabItem>
            <TabItemCenter onPress={() => goTo('Appointments')}>
                <TodayIcon width="32"  height="32" fill="#4EADBE"/>
            </TabItemCenter>
            <TabItem onPress={() => goTo('Favorites')}>
                <FavoriteIcon style={{opacity: state.index===3? 1 : 0.5}} width="24"  height="24" fill="#FFFFFF"/>
            </TabItem>
            <TabItem onPress={() => goTo('Profile')}>
                <AccountIcon style={{opacity: state.index===4? 1 : 0.5}} width="24"  height="24" fill="#FFFFFF"/>
            </TabItem>
        </TabArea>
    )
};