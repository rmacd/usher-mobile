import {Button, Card, Colors, Paragraph, Title} from 'react-native-paper';
import React, {useCallback, useContext, useEffect} from 'react';
import AppContext from './AppContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {setAuthToken} from '../redux/reducers/AuthReducer';
import {BASE_API_URL} from '@env';
import {request} from '../utils/Request';
import {AuthResponse} from '../generated/UsherTypes';
import {RootState} from '../redux/UsherStore';

export const InitialEnrolmentBanner = ({navigation}: { navigation: NativeStackNavigationProp<any> }) => {

    const {network, debugFlags} = useContext(AppContext);

    const dispatch = useDispatch();
    const auth: string = useSelector((state: RootState) => {
        return state.auth.token;
    });
    const projects = useSelector((state: RootState) => {
        return state.projects.projects;
    });

    const updateAuthTokenCallback = useCallback(() => {
        if (network) {
            if (debugFlags?.debugNetwork) {
                console.debug('Requesting CSRF token at', BASE_API_URL + '/auth');
            }
            request<AuthResponse>(BASE_API_URL + '/auth', {method: 'POST'})
                .then((response) => {
                    dispatch(setAuthToken(response.csrf || ''));
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [debugFlags?.debugNetwork, dispatch, network]);

    useEffect(() => {
        updateAuthTokenCallback();
    }, [updateAuthTokenCallback]);

    return (
        <>
            <Card>
                <Card.Content style={{shadowRadius: 3, backgroundColor: Colors.grey300}}>
                    <Title>{(projects.length > 0) ? 'Add project' : 'Not enroled'}</Title>

                    {Boolean(projects.length > 0) && (
                        <Paragraph>Note you can enrol on multiple projects at the same time.</Paragraph>
                    )}
                    {Boolean(projects.length === 0) && (
                        <Paragraph>You are currently not enroled on any projects.</Paragraph>
                    )}

                    {Boolean(network && auth) && (
                        <Button
                            onPress={() => navigation.navigate('PreEnrolment')}
                            mode={'outlined'} style={{marginTop: 10}}>Enrol</Button>
                    )}
                    {Boolean(!network || !auth) && (
                        <>
                            {Boolean(!network) && (
                                <Paragraph>To enrol on a project, your device must be online.</Paragraph>
                            )}
                            {Boolean(network) && (
                                <Paragraph>
                                    Unfortunately you cannot enrol at the minute as there
                                    seems to be a remote server issue. Please try again later.
                                </Paragraph>
                            )}
                            <Button onPress={() => updateAuthTokenCallback()}>Retry</Button>
                        </>
                    )}
                </Card.Content>
            </Card>
        </>
    );
};
