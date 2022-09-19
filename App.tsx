import React, {useEffect, useState} from "react";
import AppContext from "./components/AppContext";
import {useColorScheme} from "react-native";
import {useNetInfo} from "@react-native-community/netinfo";
import {UsherStack} from "./utils/UsherStack";
import FAIcons from "./utils/FAIcons";
import {AuthResponse} from "./generated/UsherTypes";
import {request} from "./utils/Request";
import Toast from "react-native-toast-message";
import {BASE_API_URL} from "@env";

const App = () => {
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
    const isDarkMode = useColorScheme() === "dark";
    const [auth, setAuth] = useState({} as AuthResponse);

    const applicationSettings = {
        enrolled: enrolled,
        network: (netInfo.isConnected) ? netInfo.isConnected : false,
        isDarkMode: isDarkMode,
        auth: auth,
    };

    useEffect(() => {
        if (applicationSettings.network) {
            console.debug("Requesting CSRF token at", BASE_API_URL + "/auth");
            request<AuthResponse>(BASE_API_URL + "/auth", {})
                .then((response) => {
                    setAuth(response);
                })
                .catch((err) => console.log(err));
        }
    }, [applicationSettings.network]);

    useEffect(() => {
        console.debug("CSRF token set:", auth);
    }, [auth]);

    return (
        <AppContext.Provider value={applicationSettings}>
            <UsherStack/>
            <Toast/>
        </AppContext.Provider>
    );
};

export default App;
