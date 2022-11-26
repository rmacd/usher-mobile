import React from 'react';
import {Modal, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {hideSettings} from '../redux/reducers/ModalReducer';
import {RootState} from '../redux/UsherStore';

export const ModalSettings = () => {

    const dispatch = useDispatch();

    const showModalSettings = useSelector((state: RootState) => {
        return state.modal.showSettings;
    });

    const containerStyle = {backgroundColor: 'white', padding: 20};

    return (
        <Modal visible={showModalSettings}
               onDismiss={() => dispatch(hideSettings())} contentContainerStyle={containerStyle}>
            <Text>Modal settings</Text>
        </Modal>
    );
};
