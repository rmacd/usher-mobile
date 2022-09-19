import React, {useEffect, useState} from 'react';
import {List, Paragraph, Title} from 'react-native-paper';
import {styles} from '../utils/LocalStyles';
import {View} from 'react-native';
import {DefaultViewWrapper} from '../utils/DefaultViewWrapper';
import {PermissionDTO, PreEnrolmentResponse, ProjectPermissions} from '../generated/UsherTypes';
import {RouteProp} from '@react-navigation/native';
import {BASE_API_URL} from '@env';
import {LoadingSpinner} from '../components/LoadingSpinner';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

function RenderAsHtml(props: { width: number, contents: string | undefined, title: string }) {
    if (!props.contents) {
        return <></>;
    }
    return (
        <>
            <Title>{props.title}</Title>
            <RenderHtml baseStyle={{
                backgroundColor: "#ddd",
                borderRadius: 10,
                paddingHorizontal: 10,
                marginBottom: 15,
            }} contentWidth={props.width} source={{html: props.contents || ""}} />
        </>
    );
}

function RenderPermissions(props: { allPermissions: PermissionDTO[] | undefined, appPermissions: ProjectPermissions[] | undefined }) {
    if (!props.allPermissions || !props.appPermissions) {
        return <></>
    }
    return (
        <>
            <Title>Project Permissions</Title>

            {Boolean(props.appPermissions.length === 0) && (
                <List.Item
                    title="No permissions listed"
                />
            )}

            <>
            {props.appPermissions.map((p, k) => {
                return <List.Item title={p}
                    description={props.allPermissions?.find(m => m.name === p)?.description}/>;
            })}
            </>
        </>
    )
}

export const ConfirmEnrolment = ({route}: {route: RouteProp<any>}) => {

    const preEnrolment = route.params?.project as PreEnrolmentResponse;

    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([] as PermissionDTO[]);
    const { width } = useWindowDimensions();

    useEffect(() => {
        fetch(BASE_API_URL + "/permissions", {})
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    setPermissions(data);
                } else {
                    console.error("error", data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <DefaultViewWrapper>
            <View>
                <Title>
                    Project: {preEnrolment?.projectName}
                </Title>
                <RenderAsHtml width={width} contents={preEnrolment.projectDescription} title={"Description"}/>
                <RenderAsHtml width={width} contents={preEnrolment.projectTerms} title={"Terms and Conditions"}/>
                <RenderPermissions allPermissions={permissions} appPermissions={preEnrolment.requiredPermissions}/>
            </View>
        </DefaultViewWrapper>
    );
};
