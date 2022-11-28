import React from 'react';
import {useDispatch} from 'react-redux';
import {Appbar} from 'react-native-paper';
import {showSettings} from '../redux/reducers/ModalReducer';

export const UsherMenu = () => {
    const dispatch = useDispatch();

    return (
        <Appbar.Header>
            <Appbar.Content title="Usher Mobile"/>
            <Appbar.Action icon={'cog'} accessibilityLabel={'open settings'}
                           onPress={() => {
                               dispatch(showSettings());
                           }}/>
        </Appbar.Header>
    );
};
