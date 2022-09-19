import React, {useState} from 'react';
import AppContext from './components/AppContext';
import {SafeAreaView, ScrollView, StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import {UsherStack} from './utils/UsherStack';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    // application startup:
    //  1. check network connectivity
    //     i) display network infobox
    //    ii) check remote validity/pinning
    //  2. check whether enrolled on project
    //     i) check project remains valid (if on network)
    //    ii) display project details, permit upload, etc.
    //   iii) check/update keypair
    //  3. display global details (regardless of whether enrolled)

    const [enrolled, setEnrolled] = useState(false);
    const netInfo = useNetInfo();

    const applicationSettings = {
        enrolled: enrolled,
        network: (netInfo.isConnected) ? netInfo.isConnected : false,
    };

    return (
        <NavigationContainer>
            <AppContext.Provider value={applicationSettings}>
                <SafeAreaView>
                    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <UsherStack/>
                    </ScrollView>
                </SafeAreaView>
            </AppContext.Provider>
        </NavigationContainer>
    );
};

export default App;
