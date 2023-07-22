import React, { useState, useRef, useEffect, createRef } from 'react';
import { StyleSheet, View, Text, Button, Image, TouchableOpacity, StatusBar, NativeModules } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Color from '../assets/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Card from '../utils/Card';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import { TextInput } from "react-native-paper";
import axios from '../restapi/Axios';
import Loader from '../utils/Loader';
import Modal from '../utils/Model';
import { apidecrypt, apiencrypt, validateEmail, showAlertOrToast } from '../utils/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [enterEmail, setEnterEmail] = useState(String.pleasEenterYourEmailId)
    const [emailValidError, setEmailValidError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState('user');
    const [isModalVisible, setModalVisible] = useState(false);
    const [loginError, setloginError] = useState('');

    useEffect(() => {
    }, [])

    const nextpage = async () => {
        navigation.navigate('OTPScreen', { name: 'OTPScreen', email: email })
    }
    const handleModal = () => {
        setModalVisible(!isModalVisible)
    }
    const Validate = () => {
        let isValid = true;
        setEmailValidError('');

        if (email.length === 0) {
            isValid = false;
            console.log('Please Enther the Emadil');
            setEmailValidError('Please Enther the Email');
        }

        if (email.length > 0) {
            if (!validateEmail(email)) {
                console.log('Invalid Email');
                setEmailValidError('Please Enter the Valid Email');
                isValid = false;
            }
        }

        return isValid;
    }



    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (e) {
            console.log('saving error ' + e);
        }
    }


    const getLoginOTP = () => {
        if (Validate() === true) {
            setLoading(true);

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
                        nextpage()
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
    }

    return (
        <View style={styles.MainContainer}>

            <StatusBar translucent={false} backgroundColor={Color.colorPrimaryDark} barStyle="light-content" />

            <View style={styles.TopView}>

                <View style={styles.topViewContainer}>
                    <Text style={styles.welcomeText}>{String.welcomeBack}</Text>
                    <Image style={{ width: 64, height: 64, resizeMode: 'contain', marginTop: 16 }}
                        source={require('../assets/image/ic_mail_white.png')}>
                    </Image>

                    <Text style={styles.enterEmailText}>{String.pleasEenterYourEmailId}</Text>
                </View>

            </View>


            <View style={styles.centerView}>
                {loading ?
                    <Loader />
                    :
                    <Card style={styles.carView}>

                        <View style={styles.centerViewContainer}>

                            <View style={{ width: wp('70%'), alignItems: 'center', marginLeft: 5, flexDirection: 'row' }}>
                                <TextInput
                                    style={styles.textInput}
                                    mode="outlined"
                                    outlineColor={Color.black}
                                    activeOutlineColor={Color.colorPrimaryDark}
                                    label={String.emailId}
                                    keyboardType='email-address'
                                    placeholder={String.enterEmailId}
                                    placeholderStyle={{
                                        fontFamily: Fontfamily.poppinsMedium,
                                        fontSize: 12,
                                    }}
                                    value={email}
                                    onChangeText={(email) => setEmail(email)}
                                    theme={{ roundness: 5 }}
                                    editable={true}
                                />

                                {emailValidError.length > 0 ?
                                    <Image style={{ width: 18, height: 18, resizeMode: 'contain', marginLeft: 'auto', marginRight: 10 }}
                                        source={require('../assets/image/exclamation.png')}
                                    ></Image> : null
                                }
                            </View>

                            <Text style={{ width: wp('70%'), color: Color.pink, fontFamily: Fontfamily.poppinsMedium, fontSize: 12, marginLeft: 15, marginTop: 5 }}>{emailValidError}</Text>

                            <TouchableOpacity onPress={() => getLoginOTP()} activeOpacity={0.5}>
                                <View style={styles.buttonView}>
                                    <Text style={styles.buttonTextView}>{String.getOTP}</Text>

                                </View>
                            </TouchableOpacity>

                        </View>


                    </Card>
                }
            </View>


            {/* Modal Popup  lay*/}
            <Modal isVisible={isModalVisible}>
                <Modal.Container>
                    <Modal.Header style={{ alignItems: 'center' }}>
                        <View style={{ width: wp('80%'), backgroundColor: '#fff', justifyContent: 'center' }}>
                            <Text style={{ color: Color.black, fontFamily: Fontfamily.poppinsMedium, fontSize: 16, }}>{String.LoginError}</Text>
                        </View>
                    </Modal.Header>
                    <Modal.Body>
                        <View style={{ width: wp('80%'), backgroundColor: '#fff', justifyContent: 'center' }}>
                            <Text style={{
                                color: Color.black, fontSize: 12,
                                fontFamily: Fontfamily.poppinsRegular
                            }} >{loginError}
                            </Text>
                        </View>

                    </Modal.Body>
                    <Modal.Footer>
                        <View style={{ width: wp('80%'), alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <TouchableOpacity style={{
                                width: 60, height: 30, backgroundColor: Color.colorPrimary, alignItems: 'center', justifyContent: 'center',
                                borderRadius: 24,
                            }} onPress={() => handleModal()}>
                                <Text style={{ color: Color.white, fontFamily: Fontfamily.poppinsMedium, fontSize: 12, }}>{String.ok}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal.Footer>
                </Modal.Container>
            </Modal>
            {/* Modal Popup  lay*/}



        </View>
    );

};

export default LoginScreen;

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
    topViewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    welcomeText: {
        color: Color.white,
        fontSize: 24,
        fontFamily: Fontfamily.poppinsSemiBold
    },
    enterEmailText: {
        color: Color.white,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginTop: 16
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
    centerViewContainer: {
        width: wp('85%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        flexDirection: 'column'
    },
    carView: {
        width: wp('85%'),
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
        alignItems: 'center',
        marginTop: 16
    },
    textInput: {
        width: wp('70%'),
        color: Color.black,
        fontSize: 12,
        height: 50,
        fontFamily: Fontfamily.poppinsSemiBold
    },
    buttonView: {
        width: wp('70%'),
        height: 40,
        borderRadius: 10,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.colorPrimary,
        borderRadius: 10
    },
    buttonTextView: {
        fontSize: 14,
        color: Color.white,
        fontFamily: Fontfamily.poppinsSemiBold,
        marginTop: 0,
        textAlign: 'center',
        marginRight: 5
    }

})