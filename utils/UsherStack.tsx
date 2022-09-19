import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../pages/Home';
import {PreEnrolment} from '../pages/PreEnrolment';
import {ConfirmEnrolment} from '../pages/ConfirmEnrolment';

const Stack = createNativeStackNavigator();

export const UsherStack = () => {

    return (
        <Stack.Navigator initialRouteName={"Home"} screenOptions={{animation: "fade"}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="PreEnrolment" component={PreEnrolment} />
            <Stack.Screen name="ConfirmEnrolment" component={ConfirmEnrolment} />
        </Stack.Navigator>
    );
};
