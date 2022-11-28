import {Button, Colors, Dialog, Paragraph} from 'react-native-paper';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/UsherStore';
import {hideResetApp} from '../redux/reducers/ModalReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dropDatabase} from '../utils/DAO';
import RNRestart from 'react-native-restart';

export const ConfirmResetApp = () => {

    const dispatch = useDispatch();

    const showResetApp = useSelector((state: RootState) => {
        return state.modal.showResetApp;
    });

    const callResetApp = () => {
        console.info('Resetting app');
        return AsyncStorage.getAllKeys((_err, result) => {
            AsyncStorage.multiRemove(result as string[]).then(() => {
                console.info('Removed all AsyncStorage data');
            });
        }).then(() => {
            return dropDatabase();
        }).then(() => {
            RNRestart.Restart();
        });
    };

    return (
        <Dialog visible={showResetApp} onDismiss={() => dispatch(hideResetApp())}>
            <Dialog.Title>Confirm app reset</Dialog.Title>
            <Dialog.Content>
                <Paragraph>
                    This will delete all data stored on the app and remove you from
                    all projects. This action cannot be undone.
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    color={Colors.red300}
                    onPress={() => callResetApp()}>Confirm</Button>
                <Button onPress={() => dispatch(hideResetApp())}>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
    );

};
