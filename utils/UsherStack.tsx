import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../pages/Home';
import {PreEnrolment} from '../pages/PreEnrolment';
import {ConfirmEnrolment} from '../pages/ConfirmEnrolment';
import {ProjectDetails} from '../pages/ProjectDetails';
import {ManagePermissions} from '../pages/ManagePermissions';

const Stack = createNativeStackNavigator();

export const UsherStack = () => {

    return (
        <Stack.Navigator initialRouteName={'Home'} screenOptions={{animation: 'fade'}}>
            <Stack.Screen name={'Home'} component={Home}
                          options={{headerTitle: 'Usher Mobile Research App', headerShown: false}}/>
            <Stack.Screen name={'PreEnrolment'} component={PreEnrolment}
                          options={{headerTitle: 'Pre-enrolment'}}/>
            <Stack.Screen name={'ConfirmEnrolment'} component={ConfirmEnrolment}
                          options={{headerTitle: 'Confirm Enrolment'}}/>
            <Stack.Screen name={"ProjectDetails"} component={ProjectDetails}
                          options={{headerTitle: "Project Details"}} />
            <Stack.Screen name={'ManagePermissions'} component={ManagePermissions}
                          options={{headerTitle: 'Manage permissions'}}/>
        </Stack.Navigator>
    );
};
