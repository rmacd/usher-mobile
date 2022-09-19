import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

export const LoadingSpinner = () => {
    return (
        <>
            <Animatable.View
                animation={"rotate"}
                easing={"linear"} iterationCount={"infinite"}>
                <Icon name={"refresh"}/>
            </Animatable.View>
        </>
    );
};
