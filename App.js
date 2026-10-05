import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddScreen from "./screens/AddScreen";
import DetailScreen from "./screens/DetailScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "PocketMoney - บัญชีของฉัน" }}
        />{" "}
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "เพิ่มรายการใหม่" }}
        />{" "}
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "รายละเอียดรายการ" }}
        />{" "}
      </Stack.Navigator>{" "}
    </NavigationContainer>
  );
}
