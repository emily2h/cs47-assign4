import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SongMain from "./Screens/SongMain";
import SongPreview from "./Screens/SongPreview";
import SongDetail from "./Screens/SongDetail";



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SongMain" component={SongMain} 
                                      options={{ headerShown: false}}/>
        <Stack.Screen name="SongPreview" component={SongPreview}
                                        options={{
                                          headerStyle:{backgroundColor: 'black'},
                                          headerTintColor:'white',  
                                          title: "Song Preview",
                                        }}/>
        <Stack.Screen name="SongDetail" component={SongDetail}
                                        options={{
                                          headerStyle:{backgroundColor: 'black'},
                                          headerTintColor:'white',  
                                          title: "Song Detail",
                                        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
