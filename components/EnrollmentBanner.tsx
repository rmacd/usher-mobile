import {Button, Card, Colors, Paragraph, Title} from 'react-native-paper';
import React, {useContext} from 'react';
import AppContext from './AppContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const EnrollmentBanner = ({navigation}: {navigation: NativeStackNavigationProp<any> }) => {

    const {network, auth} = useContext(AppContext);

    return (
        <>
            <Card>
                <Card.Content style={{shadowRadius: 3, backgroundColor: Colors.orange300}}>
                    <Title>Not enrolled</Title>
                    <Paragraph>You are currently not enrolled on any projects.</Paragraph>
                    {Boolean(network && auth && auth.csrf) && (
                        <Button
                            onPress={() => navigation.navigate("Enrol")}
                            mode={'outlined'} style={{marginVertical: 5}}>Enrol</Button>
                    )}
                    {Boolean(!network || !auth || !auth.csrf) && (
                        <Paragraph>To enrol on a project, your device must be online.</Paragraph>
                    )}
                </Card.Content>
            </Card>
        </>
    );
};
