import React, {useEffect, useState} from 'react';
import {Project} from './EnrolmentManager';
import {Button, Checkbox, Colors, Text} from 'react-native-paper';
import {ProjectPermission} from '../generated/UsherTypes';
import {StyleSheet, View} from 'react-native';
import Toast from 'react-native-toast-message';
import BackgroundGeolocation, {State} from 'react-native-background-geolocation';

// displays all permissions for a particular app
export const ManagePermissions = (props: { project: Project }) => {

    const styles = StyleSheet.create({
        interactiveArea: {
            borderRadius: 5,
            borderStyle: 'solid',
            borderWidth: 2,
            borderColor: Colors.grey400,
            backgroundColor: Colors.blueGrey200,
            marginVertical: 10,
        },
        permissionArea: {
            padding: 10,
            paddingBottom: 0,
            marginVertical: 5,
            borderTopStyle: 'solid',
            borderTopWidth: 2,
            borderTopColor: Colors.grey300,
        },
    });

    const interactiveArea = StyleSheet.create({
        active: {
            ...styles.interactiveArea,
            backgroundColor: Colors.green300,
        },
    });

    const getPermissionString = (permission: string) => {
        return ProjectPermission[permission as keyof typeof ProjectPermission].toString();
    };

    const [enabledPermissions, setEnabledPermissions] = useState([] as ProjectPermission[]);

    useEffect(() => {
        console.debug('length of requested permissions === length of granted permissions',
            props.project.projectPermissions.length === enabledPermissions.length,
        );
    }, [enabledPermissions.length, props.project.projectPermissions.length]);

    if (!props.project.projectId) {
        return (<></>);
    }

    const addPermission = (permission: ProjectPermission) => {
        // sadly cannot safely use our DEF = "value" enums in cases
        switch (permission.toString()) {
            case 'GPS_BACKGROUND':
            case 'GPS_FOREGROUND':
                BackgroundGeolocation.ready({
                    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                    distanceFilter: 50,
                }).then((state: State) => {
                    console.debug('BackgroundGeolocation is ready: ', state);
                    setEnabledPermissions([...enabledPermissions, permission]);
                }).catch((error) => {
                    console.error(error);
                    Toast.show({
                        type: 'error',
                        text1: 'Cannot enable GPS',
                        text2: error,
                    });
                });
                break;
            default:
                console.debug(`Enabling permission ${permission}: Nothing to do`);
        }
    };

    function toggleEnable(permission: ProjectPermission) {
        if (isEnabled(permission)) {
            setEnabledPermissions(enabledPermissions.filter((p) => p !== permission));
        } else {
            addPermission(permission);
        }
    }

    function isEnabled(permission: ProjectPermission) {
        return enabledPermissions.includes(permission);
    }

    function completeEnrolment() {
        console.debug('Complete enrolment called');
    }

    return (
        <>
            <View>
                {props.project.projectPermissions.map((permission, key) => (

                    <View style={styles.permissionArea} key={key}>
                        <Text>
                            {getPermissionString(permission)}
                        </Text>
                        <Checkbox.Item
                            style={(isEnabled(permission) ? {...interactiveArea.active} : {...styles.interactiveArea})}
                            mode={'android'}
                            label={`Grant "${permission.toLowerCase().replaceAll('_', ' ')}" permission`}
                            onPress={() => toggleEnable(permission)}
                            uncheckedColor={Colors.grey600}
                            color={Colors.green800}
                            status={(isEnabled(permission)) ? 'checked' : 'unchecked'}/>
                    </View>

                ))}

                <View style={styles.permissionArea}>
                    <Button
                        mode={'outlined'}
                        style={styles.interactiveArea}
                        onPress={() => completeEnrolment()}
                        color={Colors.green800}
                        disabled={(props.project.projectPermissions.length !== enabledPermissions.length)}>
                        Confirm enrolment
                    </Button>
                </View>
            </View>

        </>
    );
};
