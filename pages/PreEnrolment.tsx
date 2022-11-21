import React, {useContext, useEffect, useState} from 'react';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {Button, Paragraph, Text, TextInput, Title} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppContext from '../components/AppContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BASE_API_URL} from '@env';
import {GenericError, PreEnrolmentResponse} from '../generated/UsherTypes';
import Toast from 'react-native-toast-message';
import {styles} from '../utils/LocalStyles';

export const PreEnrolment = ({navigation}: { navigation: NativeStackNavigationProp<any> }) => {
    const [projectPIN, setProjectPIN] = useState('');
    const [networkError, setNetworkError] = useState(false);
    const [enableEnrol, setEnableEnrol] = useState(false);
    const [enroling, setEnroling] = useState(false);
    const [errorObject, setErrorObject] = useState({} as GenericError);
    const [preEnrolmentResponse, setPreEnrolmentResponse] = useState({} as PreEnrolmentResponse);

    const {network, auth} = useContext(AppContext);

    useEffect(() => {
        const pin = projectPIN.replace(/[^0-9]/g, '');
        setProjectPIN(pin);
        setEnableEnrol(pin.length === 6);
    }, [projectPIN]);

    useEffect(() => {
        // todo remove me
        console.info('debug: entering default pin');
        setProjectPIN('123123');
    }, []);

    useEffect(() => {
        console.debug('Enroling enabled:', enableEnrol);
    }, [enableEnrol]);

    useEffect(() => {
        setNetworkError(!(network && auth.csrf));
    }, [network, auth]);

    useEffect(() => {
        if (!preEnrolmentResponse || !preEnrolmentResponse.termsUpdated) {
            return;
        }
        console.debug('Got pre-enrolment response', preEnrolmentResponse);
        navigation.navigate('ConfirmEnrolment', {project: preEnrolmentResponse});
    }, [navigation, preEnrolmentResponse]);

    useEffect(() => {
        if (!errorObject || !errorObject.message) {
            return;
        }
        Toast.show({
            type: 'error',
            text1: `${errorObject.message}`,
            position: 'bottom',
            visibilityTime: 5000,
        });
    }, [errorObject]);

    function performInitialEnrolment(pin: string) {
        setEnroling(true);
        console.debug('Enroling with PIN', pin);
        let requestBody = JSON.stringify({pin: pin});
        console.debug('request_body:', requestBody);
        fetch(BASE_API_URL + '/enrol/initial',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: requestBody,
            })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    setPreEnrolmentResponse(data);
                } else {
                    console.debug('error', data);
                    setErrorObject(data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setEnroling(false);
            });
    }

    return (
        <DefaultViewWrapper>
            <View>
                <Title>
                    Enrol on project
                </Title>
                <Paragraph style={styles.defaultSpacing}>
                    Enroling enables you to join a particular research study
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
                            Network available: {(network) ? 'true' : 'false'}
                        </Text>
                        <Text style={styles.muted}>
                            Token: {(auth && auth.csrf) ? 'available' : 'undefined'}
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
                            onPress={() => performInitialEnrolment(projectPIN)}
                            disabled={!enableEnrol} mode={'contained'}>

                            <Text>Enrol</Text>

                            <Animatable.View
                                style={{paddingHorizontal: 5}}
                                animation={(enroling) ? 'rotate' : undefined}
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
