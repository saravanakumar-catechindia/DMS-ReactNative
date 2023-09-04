import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../assets/Colors';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import Card from '../utils/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../utils/Loader';
import axios from '../restapi/Axios';
import { apidecrypt, apiencrypt, showAlertOrToast } from '../utils/Helper';


const HomeScreen = ({ navigation }) => {

    const [userId, setUserId] = useState('')
    const [companyId, setCompannyId] = useState('')
    const [workspaceId, setWorkspaceId] = useState('')
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;

    useEffect(() => {
        getObjectData('user_data')
    }, [])

    const viewInquiry = async () => {
        navigation.navigate('ViewInquiryScreen', {
            name: 'ViewInquiryScreen',
            userId: userId,
            companyId: companyId,
            workspaceId: workspaceId,
            token: token
        })
    }

    const postLogout = () => {
        setLoading(true);
        axios.post('logout', apiencrypt({
            user_id: userId,
            staff_id: 0
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(function (response) {
                // handle success
                console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data);
                let status = data.status_code;
                var message = data.message;
                console.log(status);
                console.log(message);
                if (status == 200) {
                    showAlertOrToast(message.toString())
                    logOut()
                } else {
                    showAlertOrToast(message.toString())
                }

            })
            .catch(function (error) {
                // handle error
                showAlertOrToast(error.toString())
            })
            .then(function () {
                // always executed
                setLoading(false);
            });

    }

    const logOut = async () => {
        removeValue('user_data');
        navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
        });
    }

    removeValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            console.log(e)
        }
    }

    const getObjectData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            if (jsonValue !== null) {
                // value previously stored
                console.log('Stored AsynStorage object ' + key + ':' + jsonValue);
                const parsedValue = JSON.parse(jsonValue);

                if (key === 'user_data') {
                    setUserId(parsedValue.userId);
                    setCompannyId(parsedValue.companyId);
                    setWorkspaceId(parsedValue.workspaceId);
                    setToken(parsedValue.token)
                }
                return parsedValue;
            }
        } catch (e) {
            // error reading value
            console.log(e);
        }
    }

    const viewFactoryResponse = async () => {
        navigation.navigate('FactoryResponse', {
            name: 'FactoryResponse',
            id: 0,
            token: token,
            userId: userId,
            companyId: companyId,
            workspaceId: workspaceId,
            fromInquiryList: true
        })
    }

    const viewPO = async () => {
        navigation.navigate('ViewPO', {
            name: 'ViewPO',
            token: token,
            userId: userId,
            companyId: companyId,
            workspaceId: workspaceId
        })
    }

    return (
        <View style={styles.MainContainer}>

            {/* StatusBar */}
            <View style={{
                width: "100%",
                height: STATUS_BAR_HEIGHT,
                backgroundColor: Color.inquiryBlueDark
            }}>
                <StatusBar translucent={false} backgroundColor={Color.inquiryBlueDark} barStyle="light-content" hidden={false} animated />
            </View>

            {/* StatusBar */}

            {/* Toolbar */}
            <View style={styles.navBar} >

                <TouchableOpacity onPress={() => postLogout()} style={styles.sideMenuContainer}>
                    <Image style={styles.sideMenuImage}
                        source={require('../assets/image/ic_side_menu.png')}>
                    </Image>
                </TouchableOpacity>

                <View style={styles.navBarTitleStyle}>
                    <Text style={styles.toolBarText}>{String.home}</Text>
                </View>

                <View style={styles.navBarItemStyle}>
                </View>

            </View>

            {/* Toolbar */}


            {/* Top Bg */}

            <View style={styles.TopView}>

            </View>
            {/* Top Bg */}


            {/* Menu container */}
            <View style={{ width: wp('100%'), flexDirection: 'column', position: 'absolute' }}>

                <Card style={styles.cardView}>
                    {/* View Inquiry */}
                    <TouchableOpacity style={styles.itemContainerTop} onPress={() => viewInquiry()}>
                        <Image
                            style={styles.itemIcon}
                            source={require('../assets/image/ic_view_inquiry.png')}>
                        </Image>

                        <Text style={styles.itemTitle}>{String.viewInquiry}</Text>

                        <View style={styles.flexEnd}>
                            <Image
                                style={styles.itemArrowIcon}
                                source={require('../assets/image/ic_forward_arrow_black.png')}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                    {/* View Inquiry */}
                </Card>



                {/* Logo image */}
                <Image
                    style={styles.logoImage}
                    source={require('../assets/image/ic_app_logo_blue.png')}>
                </Image>

                {/* Logo image */}


            </View>
            {/* Menu container */}


            <View style={{ width: wp('100%'), flexDirection: 'column', height: 300, flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 65 }}>


                <Card style={styles.cardViewItem}>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => viewFactoryResponse()}>
                        <Image
                            style={styles.itemIcon}
                            source={require('../assets/image/ic_factory_response_green.png')}>
                        </Image>

                        <Text style={styles.itemTitle}>{String.factoryResponse}</Text>

                        <View style={styles.flexEnd}>
                            <Image
                                style={styles.itemArrowIcon}
                                source={require('../assets/image/ic_forward_arrow_black.png')}>
                            </Image>
                        </View>

                    </TouchableOpacity>
                </Card>

                <Card style={styles.cardViewItem}>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => viewPO()}>
                        <Image
                            style={styles.itemIcon}
                            source={require('../assets/image/ic_view_po.png')}>
                        </Image>

                        <Text style={styles.itemTitle}>{String.viewPurchaseOrder}</Text>

                        <View style={styles.flexEnd}>
                            <Image
                                style={styles.itemArrowIcon}
                                source={require('../assets/image/ic_forward_arrow_black.png')}>
                            </Image>
                        </View>

                    </TouchableOpacity>
                </Card>


                <Card style={styles.cardViewItem}>
                    <TouchableOpacity style={styles.itemContainer}>
                        <Image
                            style={styles.itemIcon}
                            source={require('../assets/image/ic_material_label.png')}>
                        </Image>

                        <Text style={styles.itemTitle}>{String.materialsAndLabel}</Text>

                        <View style={styles.flexEnd}>
                            <Image
                                style={styles.itemArrowIcon}
                                source={require('../assets/image/ic_forward_arrow_black.png')}>
                            </Image>
                        </View>

                    </TouchableOpacity>
                </Card>

            </View>




        </View>
    );

};

export default HomeScreen;

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: Color.white,
        flexDirection: 'column',

    },
    TopView: {
        backgroundColor: Color.inquiryBlue,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: wp('100%'),
        height: hp('15%'),
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

    },
    topViewContainer: {
        width: wp('100%'),
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    cardView: {
        width: wp('90%'),
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 0,
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        marginTop: Platform.OS === 'ios' ? 150 : 110,
    },

    cardViewItem: {
        width: wp('90%'),
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 10 : 10,
        padding: 0,
        borderRadius: 5,
    },
    titleText: {
        color: Color.white,
        fontSize: 18,
        fontFamily: Fontfamily.poppinsMedium
    },
    logoImage: {
        width: Platform.OS === 'ios' ? 96 : 100,
        height: Platform.OS === 'ios' ? 96 : 100,
        resizeMode: 'contain',
        position: 'absolute',
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 102 : 60,
    },
    itemContainerTop: {
        width: wp('90%'),
        height: Platform.OS === 'ios' ? 70 : 74,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 5,
        borderColor: Color.inquiryBlue,
        borderRadius: 4,
        marginTop: 50
    },
    itemContainer: {
        width: wp('90%'),
        height: Platform.OS === 'ios' ? 70 : 74,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 5,
        borderColor: Color.inquiryBlue,
        borderRadius: 5,
        marginTop: 0
    },
    itemIcon: {
        width: Platform.OS === 'ios' ? 32 : 36,
        height: Platform.OS === 'ios' ? 32 : 36,
        marginLeft: 16,
        marginTop: 12,
        marginBottom: 12
    },
    itemTitle: {
        color: Color.black,
        fontSize: 16,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 16,
        marginRight: 5,
        flex: 1,
        marginTop: 12,
        marginBottom: 12
    },
    flexEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        marginBottom: 12
    },
    itemArrowIcon: {
        width: 12,
        height: 12,
        marginRight: 16

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
    sideMenuContainer: {
        flex: 1,
        height: 55,
        justifyContent: 'center',
        marginLeft: 10
    },
    sideMenuImage: {
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
})