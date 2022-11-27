import React, {useContext, useEffect, useState} from 'react';
import {Project} from './EnrolmentManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';
import AppContext from './AppContext';
import {Button, Card, Paragraph, Text, Title} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function EnrolledProject(props: {project: Project, navigation: NativeStackNavigationProp<any>}) {

    if (props.project.projectId === undefined || props.navigation === undefined) {
        return (<></>);
    }

    return (
        <>
            <Card key={`card_${props.project.projectId}`}>
                <Card.Content>
                    <Paragraph>{props.project.projectId}</Paragraph>
                    <Button onPress={() => props.navigation.navigate('ProjectDetails', {projectId: props.project.projectId})} mode={"outlined"}>Details</Button>
                </Card.Content>
            </Card>
        </>
    );
}

export const EnrolledProjects = (
    {navigation}: { navigation: NativeStackNavigationProp<any> }
) => {

    const {debugFlags} = useContext(AppContext);
    const [projects, setProjects] = useState([] as Project[]);

    useEffect(() => {
        let projList = [] as Project[];
        AsyncStorage.getAllKeys((_error, result) => {
            return result?.filter(function (r) {
                r.startsWith(ASYNC_DB_PROJ_BASE);
            }).keys;
        }).then((res: readonly string[]) => {
            for (const projKey of res) {
                AsyncStorage.getItem(projKey, (_itemErr, itemVal) => {
                    projList.push(JSON.parse(itemVal || '') as Project);
                });
            }
        }).then(() => {
            setProjects(projList);
        });
    }, []);

    if (projects.length < 1) {
        return (<></>);
    }

    return (
        <>
            <Title>Projects</Title>
            <Text>Below is a list of all projects you are enrolled on:</Text>

            {projects.map((project, key) => (
                <EnrolledProject key={project.projectId + key} project={project} navigation={navigation}/>
            ))}
        </>
    );
};
