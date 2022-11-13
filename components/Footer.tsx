import React from "react";
import {StyleSheet, View} from 'react-native';
import {Colors, Text} from 'react-native-paper';
import VersionNumber from 'react-native-version-number';

export const Footer = () => {

    const styles = StyleSheet.create({
        bottom: {
            // marginTop: 15,
            backgroundColor: Colors.grey300,
            padding: 5,
            // borderRadius: 5,
        },
    });

    return (
        <>
            <View>
                <>
                    <View style={styles.bottom}>
                        <Text style={{color: Colors.grey500}}>Build version {VersionNumber.buildVersion} (v{VersionNumber.appVersion})</Text>
                    </View>
                </>
            </View>
        </>
    );
};
