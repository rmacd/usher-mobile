/**
 * @format
 */

import {AppRegistry} from "react-native";
import App from "./App";
import {Colors, DefaultTheme, Provider as PaperProvider} from "react-native-paper";
import {name as appName} from "./app.json";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.blue900,
    accent: Colors.grey400,
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
