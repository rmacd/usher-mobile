import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Home} from "../pages/Home";
import {PreEnrolment} from "../pages/PreEnrolment";
import {ConfirmEnrolment} from "../pages/ConfirmEnrolment";
import {CompleteEnrolment} from "../pages/CompleteEnrolment";

const Stack = createNativeStackNavigator();

export const UsherStack = () => {

    return (
        <Stack.Navigator initialRouteName={"Home"} screenOptions={{animation: "fade"}}>
            <Stack.Screen name="Home" component={Home}
                          options={{headerTitle: "Usher Mobile Research Platform"}}/>
            <Stack.Screen name="PreEnrolment" component={PreEnrolment}/>
            <Stack.Screen name="ConfirmEnrolment" component={ConfirmEnrolment}
                          options={{headerTitle: "Confirm Enrolment"}}/>
            <Stack.Screen name="CompleteEnrolment" component={CompleteEnrolment}/>
        </Stack.Navigator>
    );
};
