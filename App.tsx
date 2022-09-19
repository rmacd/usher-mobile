import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Header } from './components/Header';
import {useNetInfo} from '@react-native-community/netinfo';
import {EnrollmentBanner} from './components/EnrollmentBanner';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const netInfo = useNetInfo();

  // application startup:
  //  1. check network connectivity
  //     i) display network infobox
  //    ii) check remote validity/pinning
  //  2. check whether enrolled on project
  //     i) check project remains valid (if on network)
  //    ii) display project details, permit upload, etc.
  //   iii) check/update keypair
  //  3. display global details (regardless of whether enrolled)

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Header title={'Init'} />

        {/* if the user is enrolled on a project, show the enrolled project information
            and provide the option to un-enrol, deleting all local data etc
         */}

        {/* if the user is not enrolled on a project, provide button to enrol on a project */}

        {/* regardless of whether the user is enrolled on a project, provide options to:
            - see when data was most recently uploaded to remote endpoint
            - see when data is scheduled to next be uploaded to remote endpoint
            - see how much data has been gathered since last upload
            - turn GPS functionality on or off
            - turn upload on or off
            - delete all local data
        */}

        <EnrollmentBanner/>

      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
