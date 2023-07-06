import React, { useState, useRef, useEffect, createRef } from 'react';
import {
    StyleSheet,
    View,
    StatusBar, Image, ImageBackground
} from 'react-native';
import Color from '../assets/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    const [isWelcomeScreen, setIsWelcomeScreen] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        let timeout = setTimeout(() => {
            toNavigateScreen('user_data')
        }, 2000);
        return () => clearTimeout(timeout);

    }, [])

    const toNavigateScreen = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_data')
            if (jsonValue !== null) {
                console.log('Stored AsynStorage object ' + key + ':' + jsonValue);
                const parsedValue = JSON.parse(jsonValue);
                var userId = parsedValue.userId
                if (userId.toString().length > 0) {
                    navigation.replace('HomeScreen')
                } else {
                    navigation.replace('LoginScreen')
                }
            } else {
                navigation.replace('LoginScreen')
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.MainContainer}>

            <StatusBar backgroundColor="transparent" translucent={true} />
            <ImageBackground source={require('../assets/image/ic_splash.png')} resizeMode="stretch" style={styles.ImageBackground}>
                <Image style={styles.innerImage}
                    source={require('../assets/image/ic_splash_inner.png')}>
                </Image>
            </ImageBackground>

        </View>
    );
};
export default SplashScreen;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Color.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    ImageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        width: wp('100%'),
        height: hp('100%')
    },
    innerImage: {
        width: wp('100%'),
        height: 100,
        resizeMode: 'contain'
    }

})