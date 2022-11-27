import React, {useEffect, useState} from 'react';
import {deleteProject, getEventsCount} from '../utils/DAO';
import {Button, Colors, Dialog, Paragraph, Title} from 'react-native-paper';
import {RouteProp} from '@react-navigation/native';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {View} from 'react-native';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProjectDetails = (
    {navigation, route}: { navigation: NativeStackNavigationProp<any>, route: RouteProp<any> }
) => {

    const INITIAL_EVENTS = 0;
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const projectId = route.params?.projectId as string;
    useEffect(() => {
        getEventsCount(projectId).then((res) => {
            const count = parseInt(res, 10);
            if (count > INITIAL_EVENTS) {
                setEvents(count);
            }
        });
    }, [INITIAL_EVENTS, projectId]);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    function callDeleteProject(id: string) {
        console.debug('Deleting enrolment for project', id);
        deleteProject(id).then(() => {
            console.debug("Removed entries from DB");
            AsyncStorage.removeItem(`${ASYNC_DB_PROJ_BASE}_${id}`)
                .then(() => {
                    console.debug("Removed entries from AsyncStorage");
                });
        }).then(() => {
            navigation.navigate('Home');
        });
    }

    return (
        <>
            <DefaultViewWrapper>
                <View>
                    <Title>Project ID</Title>
                    <Paragraph>{projectId}</Paragraph>
                    <Title>Events recorded</Title>
                    <Paragraph>{events}</Paragraph>
                    <Title>Manage enrolment</Title>
                    <Paragraph>
                        If you wish to remove the project from your device and unenrol from the
                        project, you can do so here.
                    </Paragraph>
                    <Paragraph>
                        Alternatively, you can temporarily pause enrolment (ie pause data collection
                        for this project).
                    </Paragraph>
                    <Button onPress={() => setShowConfirmDelete(true)}
                            mode={'outlined'} icon={'delete'} color={Colors.red300}>Unenrol and delete data</Button>
                </View>
            </DefaultViewWrapper>
            <Dialog visible={showConfirmDelete} onDismiss={() => setShowConfirmDelete(false)}>
                <Dialog.Title>Confirm unenrolment</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>
                        This will remove the project from your device and will stop any
                        uploads of data to the project owners. You can re-enrol at a later date
                        by re-entering the project PIN.
                    </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        color={Colors.red300}
                        onPress={() => callDeleteProject(projectId)}>Confirm</Button>
                    <Button onPress={() => setShowConfirmDelete(false)}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};
