import React, { useState, useRef, useEffect, createRef } from 'react';
import { StyleSheet, View, Text, Button, Image, TouchableOpacity, StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Color from '../assets/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Card from '../utils/Card';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import { TextInput } from "react-native-paper";
import { Icon } from 'react-native-vector-icons';
import OTPTextView from 'react-native-otp-textinput';
import { apidecrypt, apiencrypt, showAlertOrToast } from '../utils/Helper';
import axios from '../restapi/Axios';
import Loader from '../utils/Loader';
import Modal from '../utils/Model';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OTPScreen = ({ navigation, route }) => {

    const [otp, setOtp] = useState('')
    const [email, setEmail] = useState(route.params.email)
    let otpInput = useRef(null);
    const [otpError, setOTPError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(otp);
    }, [])

    const nextpage = async () => {
        navigation.navigate('HomeScreen', { name: 'HomeScreen' })
    }

    clear = () => {
        otpInput.current.clear();
    }
    updateOtpText = () => {
        otpInput.current.setValue(otp);
    };

    const handleModal = () => {
        setModalVisible(!isModalVisible)
    }


    const storeObjectData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            // saving error
            console.log('saving error ' + e);
        }
    }

    const Validate = () => {
        var isValid = true;

        if (otp.length === 0) {
            isValid = false;
            showAlertOrToast(String.pleaseEntherOTP)
        }

        return isValid;
    }


    const resendOTP = () => {

        setLoading(true);

        // Make a request for a user with a given ID
        axios.post('user-get-otp', apiencrypt({ email: email }))
            .then(function (response) {
                // handle success
                console.log(response.data);

                console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data);
                let status = data.status_code;
                var message = data.message;
                console.log(status);
                console.log(message);
                if (status == 200) {
                    showAlertOrToast(message.toString())
                } else {
                    if (data.hasOwnProperty('validation_error')) {
                        if (data.validation_error.hasOwnProperty('email')) {
                            message = data.validation_error.email[0]
                        }
                    }
                    setloginError(message)
                    handleModal()
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error);
                showAlertOrToast(error.toString())
            })
            .then(function () {
                // always executed
                setLoading(false);
            });


    }




    const verifyOTP = () => {


        if (Validate() === true) {
            setLoading(true);

            // Make a request for a user with a given ID
            axios.post('verify-otp', apiencrypt({
                email: email,
                otp: otp,
                deviceId: '',
                platform: Platform.OS
            }))
                .then(function (response) {
                    // handle success
                    console.log(response.data);

                    console.log(apidecrypt(response.data))


                    let data = apidecrypt(response.data);
                    let status = data.status_code;
                    let message = data.message;
                    console.log(status);
                    console.log(message);
                    console.log(data);
                    if (status == 200) {


                        showAlertOrToast(message.toString())

                        var userId = '';
                        var userName = '';
                        var email = '';
                        var companyId = '';
                        var workspaceId = '';
                        var language = '';
                        var workspaceName = '';
                        var workspaceType = '';
                        var role = '';
                        var dateformat = '';
                        var token = '';

                        if (data.hasOwnProperty('user_id')) {
                            userId = data.user_id
                        }

                        if (data.hasOwnProperty('user_name')) {
                            userName = data.user_name
                        }

                        if (data.hasOwnProperty('email')) {
                            email = data.email
                        }

                        if (data.hasOwnProperty('company_id')) {
                            companyId = data.company_id
                        }

                        if (data.hasOwnProperty('workspace_id')) {
                            workspaceId = data.workspace_id
                        }

                        if (data.hasOwnProperty('language')) {
                            language = data.language
                        }

                        if (data.hasOwnProperty('workspaceName')) {
                            workspaceName = data.workspaceName
                        }

                        if (data.hasOwnProperty('workspaceType')) {
                            workspaceType = data.workspaceType
                        }

                        if (data.hasOwnProperty('role')) {
                            role = data.role
                        }

                        if (data.hasOwnProperty('dateformat')) {
                            dateformat = data.dateformat
                        }

                        if (data.hasOwnProperty('token')) {
                            token = data.token
                        }


                        const userObject = {
                            userId: userId,
                            userName: userName,
                            email: email,
                            companyId: companyId,
                            workspaceId: workspaceId,
                            language: language,
                            workspaceName: workspaceName,
                            workspaceType: workspaceType,
                            role: role,
                            dateformat: dateformat,
                            token: token
                        }

                        storeObjectData('user_data', userObject);

                        nextpage()
                    } else {
                        if (data.hasOwnProperty('validation_error')) {
                            if (data.validation_error.hasOwnProperty('otp')) {
                                message = data.validation_error.otp[0]
                            }
                        }
                        setOTPError(message)
                        handleModal()
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    showAlertOrToast(error.toString())

                })
                .then(function () {
                    // always executed
                    setLoading(false);
                });

        }
    }


    return (
        <View style={styles.MainContainer}>

            <StatusBar translucent={false} backgroundColor={Color.colorPrimaryDark} barStyle="light-content" />


            {loading ?

                <Loader />

                : <View style={{ flex: 1 }}>

                    <View style={styles.TopView}>

                        <View style={styles.topViewContainer}>
                            <Text style={styles.titleText}>{String.enterCode}</Text>
                            <Image
                                style={styles.starImage}
                                source={require('../assets/image/ic_stars.png')}>
                            </Image>

                            <Text style={styles.otpDiscription}>{String.otpDescription + '\n' + email}</Text>
                        </View>

                    </View>



                    <View style={styles.centerView}>
                        <Card style={styles.cardView}>

                            <View style={styles.centerViewItemContainer}>

                                <OTPTextView
                                    ref={e => (otpInput = e)}
                                    containerStyle={styles.textInputContainer}
                                    handleTextChange={(otp) => setOtp(otp)}
                                    inputCount={6}
                                    keyboardType="numeric"
                                    tintColor={Color.colorPrimary}
                                    textInputStyle={[styles.roundedTextInput]}
                                    inputCellLength={1}
                                />

                                <TouchableOpacity onPress={() => verifyOTP()} activeOpacity={0.5}>
                                    <View style={styles.buttonStyle}>
                                        <Text style={styles.buttonTextView}>{String.signIn}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </Card>
                    </View>


                    <Text style={styles.notReceivedOtp}>{String.didNotReceiveCode}</Text>
                    <TouchableOpacity onPress={() => resendOTP()} >
                        <Text style={styles.reSendOtp}>{String.reSend}</Text>
                    </TouchableOpacity>
                </View>}


            {/* Modal Popup  lay*/}
            <Modal isVisible={isModalVisible}>
                <Modal.Container>
                    <Modal.Header style={{ alignItems: 'center' }}>
                        <View style={{ width: wp('80%'), height: 40, backgroundColor: '#fff', justifyContent: 'center', marginTop: 20, marginLeft: 10 }}>
                            <Text style={{ color: Color.black, fontFamily: Fontfamily.poppinsSemiBold, fontSize: 18, }}>{String.otpError}</Text>
                        </View>
                    </Modal.Header>
                    <Modal.Body>
                        <View style={{ width: wp('80%'), backgroundColor: '#fff', justifyContent: 'center', marginLeft: 10 }}>
                            <Text style={{
                                color: Color.black, fontSize: 14,
                                fontFamily: Fontfamily.poppinsMedium, marginLeft: 0, marginRight: 10,
                            }} >{otpError}
                            </Text>
                        </View>

                    </Modal.Body>
                    <Modal.Footer>
                        <View style={{ width: wp('80%'), height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <TouchableOpacity style={{
                                width: 60, height: 30, backgroundColor: Color.colorPrimary, alignItems: 'center', justifyContent: 'center',
                                borderRadius: 10
                            }} onPress={() => handleModal()}>
                                <Text style={{ color: Color.white, fontFamily: Fontfamily.poppinsSemiBold, fontSize: 16, }}>{String.ok}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal.Footer>
                </Modal.Container>
            </Modal>
            {/* Modal Popup  lay*/}



        </View>
    );

};

export default OTPScreen;

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: Color.white
    },
    TopView: {
        backgroundColor: Color.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('100%'),
        height: hp('50%'),
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    textInputContainer: {
        marginBottom: 25,
    },

    roundedTextInput: {
        borderRadius: 0,
        borderBottomWidth: 1,
        borderWidth: 0,
        width: 40
    },
    cardView: {
        width: wp('85%'),
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        marginTop: 16
    },
    topViewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        color: Color.white,
        fontSize: 24,
        fontFamily: Fontfamily.poppinsSemiBold
    },
    starImage: {
        width: wp('100%'),
        height: 32,
        resizeMode: 'contain',
        marginTop: 16
    },
    otpDiscription: {
        color: Color.white,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginTop: 16,
        textAlign: 'center'
    },
    centerView: {
        width: wp('100%'),
        height: hp("100%"),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    centerViewItemContainer: {
        width: wp('85%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        flexDirection: 'column'
    },
    buttonStyle: {
        width: wp('70%'),
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.colorPrimary,
        borderRadius: 10, marginBottom: 10
    },
    buttonTextView: {
        fontSize: 14,
        color: Color.white,
        fontFamily: Fontfamily.poppinsSemiBold,
        marginTop: 0,
        textAlign: 'center',
        marginRight: 5
    },
    notReceivedOtp: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginTop: 120,
        alignSelf: 'center'
    },

    reSendOtp: {
        color: Color.red,
        fontSize: 14,
        fontFamily: Fontfamily.poppinsRegular,
        marginTop: 42,
        alignSelf: 'center'
    },
})