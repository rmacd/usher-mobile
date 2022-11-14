import React, {useState} from 'react';
import {Project} from './EnrolmentManager';
import {Button, Checkbox, Colors, Text} from 'react-native-paper';
import {ProjectPermission} from '../generated/UsherTypes';
import {StyleSheet, View} from 'react-native';

// displays all permissions for a particular app
export const ManagePermissions = (props: {project: Project}) => {

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
            marginTop: 5,
            borderTopStyle: 'solid',
            borderTopWidth: 2,
            borderTopColor: Colors.grey300
        },
    });

    const getPermissionString = (permission: string) => {
        return ProjectPermission[permission as keyof typeof ProjectPermission].toString();
    };

    const [enabledPermissions, setEnabledPermissions] = useState([] as ProjectPermission[]);

    if (!props.project.projectId) {
        return (<></>);
    }

    function toggleEnable(permission: ProjectPermission) {
        return true;
    }

    function isEnabled(permission: ProjectPermission) {
        return false;
    }

    return (
        <>
            <View>
                {props.project.projectPermissions.map((permission, key) => (
                    <>
                        <View style={styles.permissionArea}>
                        <Text>
                            {getPermissionString(permission)}
                        </Text>
                        <Checkbox.Item
                            style={styles.interactiveArea} mode={'android'}
                            label={`Grant "${permission.toLowerCase().replaceAll("_", " ")}" permission`}
                            onPress={() => toggleEnable(permission)}
                            status={(isEnabled(permission)) ? 'checked' : 'unchecked'}/>
                        </View>
                    </>
                ))}

                {/*<Button*/}
                {/*    mode={'outlined'}*/}
                {/*    style={styles.interactiveArea}*/}
                {/*    onPress={() => completeEnrolment()}*/}
                {/*    disabled={(!checkedTerms || !checkedData || generatingKeypair || !keys)}>*/}
                {/*    Confirm enrolment*/}
                {/*</Button>*/}
            </View>

        </>
    );
};
