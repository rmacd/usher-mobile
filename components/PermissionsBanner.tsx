import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/UsherStore';
import {Button, Card, Chip, Colors, Divider, Paragraph, Surface, Text, Title} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const PermissionsBanner = (
    {navigation}: { navigation: NativeStackNavigationProp<any> }
) => {

    const permissions = useSelector((state: RootState) => {
        return state.permissions;
    });
    const [permissionsError, setPermissionsError] = useState(true);

    useEffect(() => {
        for (const requestedElement of permissions.requested) {
            if (!permissions.granted.includes(requestedElement)) {
                setPermissionsError(true);
                return;
            }
        }
        setPermissionsError(false);
    }, [permissions]);

    const styles = StyleSheet.create({
        permissionsError: {
            backgroundColor: Colors.red300,
        },
        permissionsCard: {
            shadowRadius: 3,
        },
        surface: {
            padding: 6,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: (permissionsError) ? Colors.yellow400 : Colors.white,
            marginBottom: 10,
        },
        permissionsErrorText: {
            paddingVertical: 5,
        },
    });

    const projects = useSelector((state: RootState) => {
        return state.projects.projects;
    });

    if (projects.length === 0) {
        return (
            <></>
        );
    }

    return (
        <Surface style={styles.surface}>
            {Boolean(permissionsError) && (
                <>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Icon name={'warning'} style={{paddingHorizontal: 10}}/>
                        <Text style={styles.permissionsErrorText}>Warning: Data collection disabled</Text>
                    </View>
                </>
            )}
            <Button onPress={() => navigation.navigate('ManagePermissions')}>Manage app permissions</Button>
        </Surface>
    );
};
