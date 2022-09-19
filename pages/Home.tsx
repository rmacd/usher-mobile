import React, {useContext} from 'react';
import {View} from 'react-native';
import {EnrollmentBanner} from '../components/EnrollmentBanner';
import AppContext from '../components/AppContext';

export const Home = () => {

    const {enrolled} = useContext(AppContext);

    return (
        <>
            {/*
                    if the user is enrolled on a project, show the enrolled project information
                    and provide the option to un-enrol, deleting all local data etc

                    if the user is not enrolled on a project, provide button to enrol on a project

                    regardless of whether the user is enrolled on a project, provide options to:
                    - see when data was most recently uploaded to remote endpoint
                    - see when data is scheduled to next be uploaded to remote endpoint
                    - see how much data has been gathered since last upload
                    - turn GPS functionality on or off
                    - turn upload on or off
                    - delete all local data
                    */}

            <View style={{padding: '5%'}}>

                {Boolean(!enrolled) && (
                    <EnrollmentBanner/>
                )}

            </View>
        </>
    );
};
