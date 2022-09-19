import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import AppContext from '../components/AppContext';

interface childrenProps {
    children: JSX.Element;
}

export const DefaultViewWrapper = ({children}: childrenProps) => {

    const {isDarkMode} = useContext(AppContext);

    return (
        <SafeAreaView>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={{padding: "5%"}}>
                {children}
            </ScrollView>
        </SafeAreaView>
    );
};
