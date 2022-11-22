import React, {useEffect} from 'react';
import {Modal, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';

export const ModalSettings = () => {

    const showModalSettings = useSelector((state) => {
        console.log("state", state);
        return state.settingsModal.showSettings;
    });
    // const {showSettings, showSettingsCB} = useContext(AppContext);
    const containerStyle = {backgroundColor: 'white', padding: 20};

    const showSettingsCB = (_b?: boolean) => {};

    useEffect(() => {
        console.debug("showmodal", showModalSettings);
        console.debug();
    }, [showModalSettings]);

    return (
        <Modal visible={showModalSettings} onDismiss={() => showSettingsCB(false)} contentContainerStyle={containerStyle}>
            <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
    );
};
