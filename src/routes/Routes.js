import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import ViewInquiryScreen from '../screens/ViewInquiryScreen';
import InquiryDetails from '../screens/InquiryDetails';
import FactoryResponse from '../screens/FactoryResponse';
import SelectFactory from '../screens/SelectFactory';
import InquirySentTo from '../screens/InquirySentTo';
import ViewPO from '../screens/ViewPO';
import AddFactoryResponse from '../screens/AddFactoryResponse';
import MaterialAndLabel from '../screens/MaterialAndLabel';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator >

        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ViewInquiryScreen"
          component={ViewInquiryScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="InquiryDetails"
          component={InquiryDetails}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FactoryResponse"
          component={FactoryResponse}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SelectFactory"
          component={SelectFactory}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="InquirySentTo"
          component={InquirySentTo}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ViewPO"
          component={ViewPO}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="AddFactoryResponse"
          component={AddFactoryResponse}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="MaterialAndLabel"
          component={MaterialAndLabel}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

