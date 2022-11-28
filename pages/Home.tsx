import React from 'react';
import {View} from 'react-native';
import {InitialEnrolmentBanner} from '../components/InitialEnrolmentBanner';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EnroledProjects} from '../components/EnroledProjects';
import {PermissionsBanner} from '../components/PermissionsBanner';

export const Home = ({navigation}: { navigation: NativeStackNavigationProp<any> }) => {

    return (
        <DefaultViewWrapper>
            <>
                {/*
                    if the user is enroled on a project, show the enroled project information
                    and provide the option to un-enrol, deleting all local data etc

                    if the user is not enroled on a project, provide button to enrol on a project

                    regardless of whether the user is enroled on a project, provide options to:
                    - see when data was most recently uploaded to remote endpoint
                    - see when data is scheduled to next be uploaded to remote endpoint
                    - see how much data has been gathered since last upload
                    - turn GPS functionality on or off
                    - turn upload on or off
                    - delete all local data
                    */}

                <View>

                    <PermissionsBanner navigation={navigation}/>
                    <EnroledProjects navigation={navigation}/>
                    <InitialEnrolmentBanner navigation={navigation}/>

                </View>
            </>
        </DefaultViewWrapper>
    );
};
