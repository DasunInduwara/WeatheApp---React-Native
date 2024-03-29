import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import { ROUTE_NAMES } from '../config';
import Landing from '../screens/Landing';
import Main from '../screens/Main';
import Detail from '../screens/Detail';
import helpers from '../helpers';

export type RootStackParamsList = {
  Landing: undefined;
  Main: undefined;
  Detail: { forecast: ForecastDay };
};

export interface ILandingProps {
  navigation: StackNavigationProp<RootStackParamsList, ROUTE_NAMES.LANDING>;
}
export interface IMainProps {
  navigation: StackNavigationProp<RootStackParamsList, ROUTE_NAMES.MAIN>;
}
export interface IDetailProps {
  navigation: StackNavigationProp<RootStackParamsList, ROUTE_NAMES.DETAIL>;
}

const Stack = createStackNavigator<RootStackParamsList>();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTE_NAMES.LANDING}>
      <Stack.Screen
        name={ROUTE_NAMES.LANDING}
        component={Landing}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.MAIN}
        component={Main}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.DETAIL}
        //@ts-expect-error
        component={Detail}
        options={({ route }) => ({
          title: `${helpers.dateHelper.getDateLabel(
            route.params.forecast.date_epoch,
          )} Forecast`,
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
