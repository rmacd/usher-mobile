import React, {useEffect, useState} from 'react';
import {List, Title, Text, Paragraph, Colors, Checkbox, Button} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {
    AESPayload,
    ConfirmEnrolmentRequest, ConfirmEnrolmentResponse,
    PermissionDTO,
    PreEnrolmentResponse,
    ProjectPermission, ResponseWrapper,
} from '../generated/UsherTypes';
import {RouteProp} from '@react-navigation/native';
import {BASE_API_URL} from '@env';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getClientKeys, Project} from '../components/EnrolmentManager';
import {decryptPayload, getAESKey} from '../utils/AESPayloadManager';
// @ts-ignore - local library (for now)
import {KeyPair} from 'react-native-fast-rsa';
import {useToast} from 'react-native-toast-message/lib/src/useToast';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';

const styles = StyleSheet.create({
    header: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.grey400,
    },
    container: {
        backgroundColor: '#ddd',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    interactiveArea: {
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: Colors.grey400,
        marginVertical: 10,
    },
    forceMarginBottom: {
        marginBottom: 50,
    },
});

function RenderAsHtml(props: { width: number, contents: string | undefined, title: string }) {
    if (!props.contents) {
        return <></>;
    }

    return (
        <>
            <View style={styles.header}>
                <Title style={{}}>{props.title}</Title>
            </View>

            <RenderHtml baseStyle={styles.container} contentWidth={props.width} source={{html: props.contents || ''}}/>
        </>
    );
}

function RenderPermissions(props: { allPermissions: PermissionDTO[] | undefined, appPermissions: ProjectPermission[] | undefined }) {
    if (!props.allPermissions || !props.appPermissions) {
        return <></>;
    }
    return (
        <>
            <View style={styles.header}>
                <Title>Project Permissions</Title>
            </View>

            <View style={styles.container}>
                {Boolean(props.appPermissions.length === 0) && (
                    <List.Item
                        title="No permissions listed"
                    />
                )}

                <>
                    {props.appPermissions.map((p, k) => {
                        return <List.Item title={p} key={k}
                                          description={props.allPermissions?.find(m => m.name === p)?.description}/>;
                    })}
                </>
            </View>
        </>
    );
}

export const ConfirmEnrolment = ({
                                     navigation,
                                     route,
                                 }: { navigation: NativeStackNavigationProp<any>, route: RouteProp<any> }) => {

    const preEnrolment = route.params?.project as PreEnrolmentResponse;

    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([] as PermissionDTO[]);
    const {width} = useWindowDimensions();
    const [checkedTerms, setCheckedTerms] = useState(false);
    const [checkedData, setCheckedData] = useState(false);
    const [generatingKeypair, setGeneratingKeypair] = useState(false);
    const [keys, setKeys] = useState({} as KeyPair);
    const [confirmEnrolmentResponse, setConfirmEnrolmentResponse] = useState({} as AESPayload);

    useEffect(() => {
        if (preEnrolment === undefined || preEnrolment.projectId === undefined) {
            return;
        }
        getClientKeys(preEnrolment.projectId)
            .then((keyPair: KeyPair) => {
                setKeys(keyPair);
            });
    }, [preEnrolment]);

    const showError = (line1: string, line2: string | undefined) => {
        Toast.show({
            type: 'error',
            text1: line1,
            text2: line2,
            position: 'top',
        });
    };

    function completeEnrolment() {
        const enrolmentRequest = {
            projectId: preEnrolment.projectId,
            publicKey: keys.publicKey,
            participantId: preEnrolment.participantId,
            signature: preEnrolment.signature,
        } as ConfirmEnrolmentRequest;

        console.debug('Sending enrolment confirmation', enrolmentRequest);
        return fetch(BASE_API_URL + '/enrol/confirm', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(enrolmentRequest),
        })
            .then(response => {
                if (!response.ok) {
                    showError('Unable to complete enrolment', 'please restart app and try again');
                } else {
                    return response.json();
                }
            })
            .then((response) => {
                console.debug('Got enrolment response', response);
                setConfirmEnrolmentResponse(response as AESPayload);
            })
            .catch((err) => {
                console.error('Error confirming enrolment:', err);
            });
    }

    function addEnrolment(enrolmentResponse: ConfirmEnrolmentResponse) {
        console.debug('Processing enrolment:', enrolmentResponse);
        AsyncStorage.mergeItem(`${ASYNC_DB_PROJ_BASE}_${enrolmentResponse.projectId}`, JSON.stringify(
            {
                projectId: enrolmentResponse.projectId,
                projectPublicKey: enrolmentResponse.publicKey,
                projectPermissions: enrolmentResponse.requiredPermissions,
            } as Project,
        ))
            .then(() => {
                return AsyncStorage.getItem(`${ASYNC_DB_PROJ_BASE}_${enrolmentResponse.projectId}`);
            })
            .then((res: string | null) => {
                if (res === null) {
                    console.error(`Error retrieving project ${enrolmentResponse.projectId}`);
                }
                return JSON.parse(res || '') as Project;
            })
            .then((proj: Project) => {
                Toast.show({
                    type: 'info',
                    text1: 'Completed enrolment',
                    text2: `Project ID: ${proj.projectId}`,
                });
                navigation.navigate("CompleteEnrolment", {project: proj});
            });
    }

    useEffect(() => {
        if (!keys || !keys.privateKey || !keys.publicKey || !confirmEnrolmentResponse || !confirmEnrolmentResponse.key) {
            return;
        }
        console.debug('Attempting to handle enrolment response');
        getAESKey(confirmEnrolmentResponse, keys.privateKey)
            .then((key: string) => {
                if (key === undefined) {
                    throw new Error('Key not defined');
                }
                return decryptPayload(confirmEnrolmentResponse, key);
            })
            .then((wrapper: ResponseWrapper) => {
                if (!wrapper.type || !wrapper.type.endsWith('ConfirmEnrolmentResponse')) {
                    throw new Error('Unexpected response');
                }
                return wrapper.value as ConfirmEnrolmentResponse;
            })
            .then((enrolmentResponse: ConfirmEnrolmentResponse) => {
                addEnrolment(enrolmentResponse);
            });
    }, [keys, confirmEnrolmentResponse]);

    useEffect(() => {
        // todo remove me
        console.info('debug: checking boxes');
        setCheckedTerms(true);
        setCheckedData(true);
    }, []);

    useEffect(() => {
        fetch(BASE_API_URL + '/permissions', {})
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    setPermissions(data);
                } else {
                    console.error('error', data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <DefaultViewWrapper>
            <View>
                <View style={{borderRadius: 10, backgroundColor: Colors.blue500, marginVertical: 20}}>
                    <Title style={{paddingHorizontal: 10, color: Colors.white}}>Important</Title>
                    <Paragraph style={{padding: 10, paddingTop: 0, color: Colors.white}}>
                        The following description and project terms have been provided by the study lead to help you
                        understand what data is being collected and how this might affect you. Please read all
                        information below before confirming participation in the project.
                    </Paragraph>
                </View>
                <RenderAsHtml width={width} contents={preEnrolment.projectDescription} title={'Project Description'}/>
                <RenderAsHtml width={width} contents={preEnrolment.projectTerms} title={'Terms and Conditions'}/>
                <RenderPermissions allPermissions={permissions} appPermissions={preEnrolment.requiredPermissions}/>
                <Title>Confirm enrolment</Title>
                <Text>Please check each of the following boxes before completing enrolment:</Text>
                <View>
                    <Checkbox.Item
                        style={styles.interactiveArea} mode={'android'}
                        label="I agree to the project terms and conditions"
                        onPress={() => setCheckedTerms(!checkedTerms)}
                        status={(checkedTerms) ? 'checked' : 'unchecked'}/>
                    <Checkbox.Item
                        style={styles.interactiveArea} mode={'android'}
                        label="I understand the types of data that this project may gather about me"
                        onPress={() => setCheckedData(!checkedData)}
                        status={(checkedData) ? 'checked' : 'unchecked'}/>
                    <Button
                        mode={'outlined'}
                        style={styles.interactiveArea}
                        onPress={() => completeEnrolment()}
                        disabled={(!checkedTerms || !checkedData || generatingKeypair || !keys)}>
                        Confirm enrolment
                    </Button>
                </View>
                <View style={styles.forceMarginBottom}/>
            </View>
        </DefaultViewWrapper>
    );
};
