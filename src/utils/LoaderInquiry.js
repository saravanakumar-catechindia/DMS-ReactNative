import React, { useState, useRef, useEffect, createRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../assets/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Loader = () => {
   const [animating, setAnimation] = useState(true)
   
   useEffect(() => {
     
      return () => {
         setAnimation(false);
      };
    }, []);
  
      return (
         <View style = {styles.container}>
            <ActivityIndicator
               animating = {animating}
               color = {Colors.inquiryBlue}
               size = "large"
               style = {styles.activityIndicator}/>
         </View>
      )
}
export default Loader;

const styles = StyleSheet.create ({
   container: {
      width: wp('100%'),
      height: hp('100%'),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white
   },
   activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
   }
})