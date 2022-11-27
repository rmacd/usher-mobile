import React, {useEffect, useState} from 'react';
import {Button, Colors, Modal, Text, Title} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {hideDatabase} from '../redux/reducers/ModalReducer';
import {RootState} from '../redux/UsherStore';
import JSONTree from 'react-native-json-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native';
import {getEvents} from '../utils/DAO';

export const InspectData = () => {

    const dispatch = useDispatch();

    const showDatabaseBool = useSelector((state: RootState) => {
        return state.modal.showDatabase;
    });

    const [data, setData] = useState({});
    useEffect(() => {
        setData([]);
        AsyncStorage.getAllKeys(async (_err, res) => {
            if (!res) {return;}
            for (const key of res) {
                await AsyncStorage.getItem(key)
                    .then(async (val) => {
                        let parsed;
                        try {
                            parsed = await JSON.parse(val || '');
                        } catch (e) {
                            parsed = val;
                        }
                        setData([...data, parsed]);
                    });
            }
        });
    }, []);

    const [events, setEvents] = useState([]);
    useEffect(() => {
        getEvents().then((res) => {
            setEvents(res || []);
        });
    }, []);

    const containerStyle = {backgroundColor: 'white', padding: 20};

    return (
        <Modal visible={showDatabaseBool}
               onDismiss={() => dispatch(hideDatabase())} contentContainerStyle={containerStyle}>
            <Title>Inspect app data</Title>

            <Text>Project config</Text>
            <ScrollView>
                <JSONTree data={data}/>
            </ScrollView>

            <Text>Database</Text>

            {Boolean(events && events.length < 1) && (
                <Text>No events found</Text>
            )}

            {Boolean(events && events.length > 0) && (
                <Text>{events.length} events found</Text>
            )}

            <Button onPress={() => dispatch(hideDatabase())}
                    mode={'outlined'} icon={'cancel'} color={Colors.grey400}>Close</Button>
        </Modal>
    );
};
