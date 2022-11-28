import React from 'react';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {StyleSheet, View} from 'react-native';
import {Checkbox, Colors, Paragraph, Text, Title} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/UsherStore';
import {ProjectPermission} from '../generated/UsherTypes';
import {grantPermission, refusePermission} from '../redux/reducers/PermissionsReducer';

export const ManagePermissions = () => {

    const dispatch = useDispatch();
    const permissions = useSelector((state: RootState) => {
        return state.permissions;
    });

    const getPermissionString = (permission: string) => {
        return ProjectPermission[permission as keyof typeof ProjectPermission].toString();
    };

    function isEnabled(permission: ProjectPermission) {
        return permissions.granted.includes(permission);
    }

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
        inactive: {
            ...styles.interactiveArea,
            backgroundColor: Colors.yellow300,
        },
    });

    const toggleEnable = (v: string) => {
        const p = v as ProjectPermission;
        if (isEnabled(p)) {
            dispatch(refusePermission(p));
        } else {
            dispatch(grantPermission(p));
        }
    };

    return (
        <DefaultViewWrapper>
            <View>
                <Title>Requested permissions</Title>
                <Paragraph>
                    The following permissions are required by one or more projects
                </Paragraph>

                {permissions.requested.map((permission, key) => (
                    <View style={styles.permissionArea} key={key}>
                        <Text>
                            {getPermissionString(permission)}
                        </Text>
                        <Checkbox.Item
                            style={(isEnabled(permission) ? {...interactiveArea.active} : {...interactiveArea.inactive})}
                            mode={'android'}
                            label={`Grant "${permission.toLowerCase().replaceAll('_', ' ')}" permission`}
                            onPress={() => toggleEnable(permission)}
                            uncheckedColor={Colors.grey600}
                            color={Colors.green800}
                            status={(isEnabled(permission)) ? 'checked' : 'unchecked'}/>
                    </View>
                ))}
            </View>
        </DefaultViewWrapper>
    );
};
