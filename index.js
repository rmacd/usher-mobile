/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {Colors, DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import {NavigationContainer} from '@react-navigation/native';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.blue400,
        accent: Colors.grey400,
    },
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <App/>
            </NavigationContainer>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
