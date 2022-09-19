import React, {useContext, useEffect, useState} from 'react';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {Button, Paragraph, TextInput, Title, Text, Chip} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppContext from '../components/AppContext';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Enrol = ({navigation}: { navigation: NativeStackNavigationProp<any> }) => {

    const [projectPIN, setProjectPIN] = useState('');
    const [networkError, setNetworkError] = useState(false);
    const [enableEnrol, setEnableEnrol] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    const {network, auth} = useContext(AppContext);

    useEffect(() => {
        const pin = projectPIN.replace(/[^0-9]/g, '');
        setProjectPIN(pin);
        setEnableEnrol(pin.length === 6);
    }, [projectPIN]);

    useEffect(() => {
        console.debug('Enrolling enabled:', enableEnrol);
    }, [enableEnrol]);

    useEffect(() => {
        setNetworkError(!(network && auth.csrf));
    }, [network, auth]);

    const styles = StyleSheet.create({
        defaultSpacing: {
            marginBottom: 15,
            lineHeight: 20,
        },
        boldText: {
            fontWeight: 'bold',
        },
        muted: {
            fontFamily: 'Courier',
            color: '#aaa',
        },
    });

    function performInitialEnrollment(projectPIN: string) {
        setEnrolling(true);
        console.debug('Enrolling with PIN', projectPIN);
        // request<PreEnrollmentResponse>("https://usher-dev.apps.rmacd.com/api/auth")
    }

    return (
        <DefaultViewWrapper>
            <View>
                <Title>
                    Enrol on project
                </Title>
                <Paragraph style={styles.defaultSpacing}>
                    Enrolling enables you to join a particular research study
                    and start sending device and questionnaire data to the study
                    lead.
                </Paragraph>
                <Paragraph style={styles.defaultSpacing}>
                    You will have been given a PIN (and potentially a participant
                    ID) which you must enter below.
                </Paragraph>
                <Paragraph style={styles.defaultSpacing}>
                    Once you have entered the project PIN, you will be asked to
                    read and accept the Terms and Conditions for the study itself,
                    as well as for the general usage of this app.
                </Paragraph>

                {Boolean(networkError) && (
                    <>
                        <Text style={{...styles.boldText, ...styles.defaultSpacing}}>
                            Due to a network error it is not currently possible to enrol you.
                            Please try again later.
                        </Text>
                        <Text style={styles.muted}>
                            Error details
                        </Text>
                        <Text style={styles.muted}>
                            Network available: {(network) ? "true" : "false"}
                        </Text>
                        <Text style={styles.muted}>
                            Token: {(auth && auth.csrf) ? "available" : "undefined"}
                        </Text>
                    </>
                )}

                {Boolean(!networkError) && (
                    <>
                        <TextInput
                            style={styles.defaultSpacing}
                            maxLength={6}
                            keyboardType={'numeric'}
                            mode={'outlined'}
                            label="Project PIN"
                            value={projectPIN}
                            onChangeText={text => setProjectPIN(text)}
                        />

                        <Button
                            onPress={() => performInitialEnrollment(projectPIN)}
                            disabled={!enableEnrol} mode={'contained'}>

                            <Text>Enrol</Text>

                            <Animatable.View
                                style={{paddingHorizontal: 5}}
                                animation={(enrolling) ? 'rotate' : undefined}
                                easing={'linear'} iterationCount={'infinite'}>
                                <Icon name={'refresh'}/>
                            </Animatable.View>
                        </Button>
                    </>
                )}
            </View>
        </DefaultViewWrapper>
    );
};
