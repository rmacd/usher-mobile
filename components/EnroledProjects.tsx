import React from 'react';
import {Project} from './EnrolmentManager';
import {Button, Card, Paragraph, Text, Title} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/UsherStore';
import {View} from 'react-native';

function EnroledProject(props: { project: Project, navigation: NativeStackNavigationProp<any> }) {

    if (props.project.projectId === undefined || props.navigation === undefined) {
        return (<></>);
    }

    return (
        <>
            <Card key={`card_${props.project.projectId}`}>
                <Card.Content>
                    <Paragraph>{props.project.projectId}</Paragraph>
                    <Button
                        onPress={() => props.navigation.navigate('ProjectDetails', {projectId: props.project.projectId})}
                        mode={'outlined'}>Details</Button>
                </Card.Content>
            </Card>
        </>
    );
}

export const EnroledProjects = (
    {navigation}: { navigation: NativeStackNavigationProp<any> },
) => {

    const projects = useSelector((state: RootState) => {
        return state.projects.projects;
    });

    if (projects.length < 1) {
        return (<></>);
    }

    return (
        <View style={{paddingVertical: 5, paddingBottom: 15}}>
            <Title>Projects</Title>
            <Text>You are enroled on the following project(s):</Text>

            {projects.map((project, key) => (
                <View style={{paddingVertical: 5}} key={key}>
                    <EnroledProject key={project.projectId + key} project={project} navigation={navigation}/>
                </View>
            ))}

        </View>
    );
};
