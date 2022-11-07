import React from "react";
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {View} from 'react-native';
import {Title, Paragraph} from 'react-native-paper';
import {ManagePermissions} from '../components/ManagePermissions';
import {RouteProp} from '@react-navigation/native';
import {PreEnrolmentResponse} from '../generated/UsherTypes';

export const CompleteEnrolment = ({route}: {route: RouteProp<any>}) => {

    const preEnrolment = route.params?.project as PreEnrolmentResponse;

    return (
        <DefaultViewWrapper>
            <View>
                <Title>Enrolment complete</Title>
                <Paragraph>
                    You have now completed enrolment on this project.
                    Before we can start gathering and submitting data, we must ask you to
                    manually switch on the following functions for the app.
                    For each option, you may be asked to confirm that you are giving
                    us permission to gather this data, via your device settings.
                </Paragraph>
                <ManagePermissions projectId={preEnrolment.projectId}/>
            </View>
        </DefaultViewWrapper>
    );
};
