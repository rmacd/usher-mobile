import {Button, Card, Colors, Paragraph, Title} from 'react-native-paper';
import React, {useContext} from 'react';
import AppContext from './AppContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const EnrollmentBanner = ({navigation}: {navigation: NativeStackNavigationProp<any> }) => {

    const {network, auth, refreshAuthCB} = useContext(AppContext);

    return (
        <>
            <Card>
                <Card.Content style={{shadowRadius: 3, backgroundColor: Colors.orange300}}>
                    <Title>Not enrolled</Title>
                    <Paragraph>You are currently not enrolled on any projects.</Paragraph>
                    {Boolean(network && auth && auth.csrf) && (
                        <Button
                            onPress={() => navigation.navigate("PreEnrolment")}
                            mode={'outlined'} style={{marginTop: 10}}>Enrol</Button>
                    )}
                    {Boolean(!network || !auth || !auth.csrf) && (
                        <>
                            <Paragraph>To enrol on a project, your device must be online.</Paragraph>
                            <Button onPress={() => refreshAuthCB()}>Retry</Button>
                        </>
                    )}
                </Card.Content>
            </Card>
        </>
    );
};
