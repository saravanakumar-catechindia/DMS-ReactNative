import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Platform, Text, View, TouchableOpacity, FlatList, BackHandler, SafeAreaView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../assets/Colors';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import Card from '../utils/Card';
import axios from '../restapi/Axios';
import Loader from '../utils/LoaderInquiry';
import Modal from '../utils/Model';
import { apidecrypt, apiencrypt, showAlertOrToast } from '../utils/Helper';

const InquiryDetails = ({ navigation, route }) => {
    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;

    useEffect(() => {

        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };

    }, [])

    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    return (

        <View style={styles.MainContainer}>
          <View style={{
                width: "100%",
                height: STATUS_BAR_HEIGHT,
                backgroundColor: Color.inquiryBlueDark
            }}>
                <StatusBar translucent={false} backgroundColor={Color.inquiryBlueDark} barStyle="light-content" hidden={false} animated />

            </View>

            {/* Toolbar */}
            <View style={styles.navBar} >

                <TouchableOpacity onPress={() => handleBackButtonClick()} style={styles.backButton}>
                    <Image style={styles.backButtonImage}
                        source={require('../assets/image/ic_back_white.png')}>
                    </Image>
                </TouchableOpacity>

                <View style={styles.navBarTitleStyle}>
                    <Text style={styles.toolBarText}>{String.inquiryDetails}</Text>
                </View>

                <View style={styles.navBarItemStyle}>
                </View>

            </View>

            {/* Toolbar */}
          


            </View>
);

};
export default InquiryDetails;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Color.white
    },
    navBar: {
        width: wp('100%'),
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.inquiryBlue,
        marginTop: Platform.OS === 'ios' ? 0 : 0,
    },
    navBarTitleStyle: {
        flex: 2,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBarItemStyle: {
        flex: 1,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        flex: 1,
        height: 55,
        justifyContent: 'center',
        marginLeft: 10
    },
    backButtonImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    toolBarText: {
        color: Color.white,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 18,
        alignSelf: 'center'
    },
    listContainer: {
        width: wp('100%'),
        backgroundColor: Color.white,
        alignItems: 'center'
    },
    itemSeperator: {
        height: 10
    },
    contentContainerStyle: {
        paddingTop: 10,
        paddingBottom: 10
    },
    itemGrayContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Color.viewInquiryBorderGray,

    },
    itemBlueContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Color.viewInquiryBorderBlue,
    },
    itemIconContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Color.white,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 10
    },
    menuIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 8,
        marginBottom: 8
    },
    veticalLine: {
        width: 0.5,
        backgroundColor: Color.gIBox
    },
    itemIcon: {
        width: 36,
        height: 36
    },
    itemTitle: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 10
    },
    itemContent: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 10
    },
    cardView: {
        width: wp('90%'),
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0

    },
})