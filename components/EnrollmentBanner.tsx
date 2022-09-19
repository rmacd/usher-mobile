import {Button, Card, Colors, Paragraph, Title} from 'react-native-paper';
import React, {useContext} from 'react';
import AppContext from './AppContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const EnrollmentBanner = ({navigation}: {navigation: NativeStackNavigationProp<any> }) => {

    const {network} = useContext(AppContext);

    return (
        <>
            <Card>
                <Card.Content style={{shadowRadius: 3, backgroundColor: Colors.orange300}}>
                    <Title>Enrol on project</Title>
                    <Paragraph>You are currently not enrolled on any research projects.</Paragraph>
                    {Boolean(network) && (
                        <Button
                            onPress={() => navigation.navigate("Enrol")}
                            mode={'outlined'} style={{marginVertical: 5}}>Enrol</Button>
                    )}
                    {Boolean(!network) && (
                        <Paragraph>To enrol on a project, your device must be online.</Paragraph>
                    )}
                </Card.Content>
            </Card>
        </>
    );
};
