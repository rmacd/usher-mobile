import React from 'react';
import {Button, Colors, Modal, Title} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {hideSettings, showDatabase, showResetApp} from '../redux/reducers/ModalReducer';
import {RootState} from '../redux/UsherStore';
import {StyleSheet} from 'react-native';

export const ModalSettings = () => {

    const dispatch = useDispatch();

    const showModalSettings = useSelector((state: RootState) => {
        return state.modal.showSettings;
    });

    const containerStyle = {backgroundColor: 'white', padding: 20};

    const styles = StyleSheet.create({
        button: {
            marginVertical: 5,
        },
    });

    return (
        <Modal visible={showModalSettings}
               onDismiss={() => dispatch(hideSettings())} contentContainerStyle={containerStyle}>
            <Title>Settings</Title>
            <Button style={styles.button} onPress={() => dispatch(showDatabase())}
                    mode={'outlined'} icon={'eye'} color={Colors.blue500}>Inspect data</Button>
            <Button style={styles.button} onPress={() => dispatch(showResetApp())}
                    mode={'outlined'} icon={'delete'} color={Colors.red300}>Reset app</Button>
        </Modal>
    );
};
