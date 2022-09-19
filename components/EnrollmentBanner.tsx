import {Banner} from 'react-native-paper';
import React from 'react';

export const EnrollmentBanner = () => {
    return <>
        <Banner
            visible={true}
            actions={[
                {
                    label: 'Help',
                    // onPress: () => setVisible(false),
                },
                {
                    label: 'Enrol',
                    // onPress: () => setVisible(false),
                },
            ]}
        >
            You are not currently enrolled on a project
        </Banner>
    </>;
};
