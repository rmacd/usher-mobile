import React, {useEffect, useState} from 'react';
import {List, Title, Text, Paragraph, Colors, Checkbox, Button} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {
    AESPayload,
    ConfirmEnrolmentRequest,
    PermissionDTO,
    PreEnrolmentResponse,
    ProjectPermissions,
} from '../generated/UsherTypes';
import {RouteProp} from '@react-navigation/native';
import {BASE_API_URL} from '@env';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getClientKeys} from '../components/EnrolmentManager';
import {decryptPayload, getAESKey} from '../utils/AESPayloadManager';
// @ts-ignore - local library (for now)
import {KeyPair} from 'react-native-fast-rsa';

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

function RenderPermissions(props: { allPermissions: PermissionDTO[] | undefined, appPermissions: ProjectPermissions[] | undefined }) {
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

export const ConfirmEnrolment = ({navigation, route}: { navigation: NativeStackNavigationProp<any>, route: RouteProp<any> }) => {

    const preEnrolment = route.params?.project as PreEnrolmentResponse;

    Icon.loadFont();

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

    function completeEnrolment() {
        const enrolmentRequest = {
            projectId: preEnrolment.projectId,
            publicKey: keys.publicKey,
            participantId: preEnrolment.participantId,
            signature: preEnrolment.signature,
        } as ConfirmEnrolmentRequest;

        console.debug("Sending enrolment confirmation", enrolmentRequest);
        return fetch(BASE_API_URL + '/enrol/confirm', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(enrolmentRequest),
        })
        .then(response => response.json() as AESPayload)
        .then((response: AESPayload) => {
            setConfirmEnrolmentResponse(response);
        })
        .catch((err) => {
            console.log("Error confirming enrolment:", err);
        });
        // navigation.navigate("CompleteEnrolment", {});
    }

    useEffect(() => {
        if (!keys || !keys.privateKey || !keys.publicKey || !confirmEnrolmentResponse || !confirmEnrolmentResponse.key) {
            return;
        }
        getAESKey(confirmEnrolmentResponse, keys.privateKey)
            .then((key: string) => {
                if (key === undefined) {
                    throw new Error("Key not defined");
                }
                decryptPayload(confirmEnrolmentResponse, key);
            });
    }, [keys, confirmEnrolmentResponse]);

    useEffect(() => {
        // todo remove me
        console.info("debug: checking boxes");
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
