import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../pages/Home';
import {Enrol} from '../pages/Enrol';

const Stack = createNativeStackNavigator();

export const UsherStack = () => {

    return (
        <Stack.Navigator initialRouteName={"Home"} screenOptions={{animation: "fade"}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Enrol" component={Enrol} />
        </Stack.Navigator>
    );
};
