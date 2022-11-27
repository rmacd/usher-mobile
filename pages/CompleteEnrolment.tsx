import React from 'react';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {View} from 'react-native';
import {Paragraph, Title} from 'react-native-paper';
import {ManagePermissionsForProject} from '../components/ManagePermissionsForProject';
import {RouteProp} from '@react-navigation/native';
import {Project} from '../components/EnrolmentManager';

export const CompleteEnrolment = ({route}: { route: RouteProp<any> }) => {

    const project = route.params?.project as Project;

    return (
        <DefaultViewWrapper>
            <View>
                <Title>Enrolment complete</Title>
                <Paragraph>
                    You have now completed enrolment on this project.
                    Before we can start gathering and submitting data, we must ask you to
                    manually switch on the following functions for the app.
                </Paragraph>
                <Paragraph>
                    For each option you select, your phone may prompt you to
                    permit access to the feature via your device settings.
                </Paragraph>
                <ManagePermissionsForProject project={project}/>
            </View>
        </DefaultViewWrapper>
    );
};
