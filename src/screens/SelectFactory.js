import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Platform, Text, View, TouchableOpacity, FlatList, BackHandler, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../assets/Colors';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import Card from '../utils/Card';
import axios from '../restapi/Axios';
import Loader from '../utils/LoaderInquiry';
import { apidecrypt, apiencrypt, showAlertOrToast } from '../utils/Helper';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import { TextInput } from "react-native-paper";




const SelectFactory = ({ navigation, route }) => {
    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;


    const [Data, setData] = useState([]);
    const [selectedFactoryData, setSelectedFactoryData] = useState(route.params.data)
    const [inquiryId, setInquiryId] = useState(route.params.id)
    const [userId, setUserId] = useState(route.params.userId)
    const [companyId, setCompannyId] = useState(route.params.companyId)
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(route.params.token);
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [factoryName, setFactoryName] = useState('')
    const [factoryValidationError, setFactoryValidationError] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [contactPersonValidationError, setContactPersonValidationError] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [contactNumberValidationError, setContactNumberValidationError] = useState('')
    const [email, setEmail] = useState('')
    const [emailValidationError, setEmailValidationError] = useState('')
    const [address, setAddress] = useState('')
    const [addressValidationError, setAddressValidationError] = useState('')
    const [city, setCity] = useState('')
    const [cityValidationError, setCityValidationError] = useState('')
    const inputRefCP = useRef();
    const inputRefCN = useRef();
    const inputRefEmail = useRef();
    const inputRefAddress = useRef();
    const inputRefCity = useRef();





    useEffect(() => {



        getSelectedFactoryList()

        const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            backHandler.remove()
        };
    }, [])

    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    }



    const updateCheckBox = (newValue, index) => {
        let tempArray = [...selectedFactoryData]
        tempArray[index].isNowSelected = newValue
        setSelectedFactoryData(tempArray)
    }


    const getFactoryList = () => {

        setLoading(true);



        axios.post('get-inquiry-factory', apiencrypt(), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                // console.log('response', response.data)

                //   console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data)

                if (data.hasOwnProperty('data')) {
                    setData(data.data)

                    const updatedData = data.data.map((itemData) => {

                        return {
                            id: itemData.id,
                            factory: itemData.factory,
                            contact_person: itemData.contact_person,
                            contact_number: itemData.contact_number,
                            contact_email: itemData.contact_email,
                            isSelected: false,
                            isNowSelected: false
                        };

                    });



                    setSelectedFactoryData(updatedData)


                }

            })
            .catch((error) => {
                console.log('catch error ', error.toString())
                showAlertOrToast(error.toString())
            }).then(function () {
                // always executed
                setLoading(false);
            });
    }




    const getSelectedFactoryList = () => {

        setLoading(true);

        axios.post('inquiry-factory-list', apiencrypt({
            inquiry_id: inquiryId
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log('response', response.data)

                console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data);


                if (data.hasOwnProperty('data')) {




                    let updatedData = selectedFactoryData.map((itemData) => {


                        var updatedObject = {}

                        data.data.map((itemSelected) => {

                            if (itemData.id == itemSelected.id) {

                                updatedObject = {
                                    id: itemData.id,
                                    factory: itemData.factory,
                                    contact_person: itemData.contact_person,
                                    contact_number: itemData.contact_number,
                                    contact_email: itemData.contact_email,
                                    isSelected: true,
                                    isNowSelected: true
                                }

                            }


                        });


                        if (Object.keys(updatedObject).length === 0) {

                            updatedObject = {
                                id: itemData.id,
                                factory: itemData.factory,
                                contact_person: itemData.contact_person,
                                contact_number: itemData.contact_number,
                                contact_email: itemData.contact_email,
                                isSelected: false,
                                isNowSelected: false
                            }


                        }


                        return updatedObject;

                    });





                    setSelectedFactoryData(updatedData)



                    console.log('SelectedFactoryData updatedData 12 ', selectedFactoryData)
                }





            })
            .catch((error) => {
                showAlertOrToast(error.toString())
            }).then(function () {
                // always executed
                setLoading(false);

            });


    }


    const sendButtonClick = (index) => {
        let filteredItem = selectedFactoryData.filter(item => (item.isNowSelected === true && item.isSelected === false))
        let selectedFactoryIds = filteredItem.map(item => item.id)
        console.log('Checkbox selected ids ', selectedFactoryIds)

        if (selectedFactoryIds.length > 0) {
            sendSelectedFactoryIds(selectedFactoryIds)
        } else {
            showAlertOrToast(String.pleaseSelectAtleastOneFactory)
        }
    }

    const handleModal = () => {
        resetErrorValue()
        setModalVisible(!isModalVisible);
    };

    const resetErrorValue = () => {
        setFactoryValidationError('')
        setContactPersonValidationError('')
        setContactNumberValidationError('')
        setEmailValidationError('')
        setAddressValidationError('')
        setCityValidationError('')
    }
    const validateAddFactory = () => {
        resetErrorValue()
        if (Object.keys(factoryName).length == 0) {
            setFactoryValidationError(String.pleaseEnterFactoryName)
            return
        }
        if (Object.keys(contactPerson).length == 0) {
            setContactPersonValidationError(String.pleaseEnterContactPerson)
            return
        }
        if (Object.keys(contactNumber).length == 0) {
            setContactNumberValidationError(String.pleaseEnterContactNumber)
            return
        }
        if (Object.keys(email).length == 0) {
            setEmailValidationError(String.pleasEenterYourEmailId)
            return
        }
        if (Object.keys(address).length == 0) {
            setAddressValidationError(String.pleaseEnterAddress)
            return
        }
        if (Object.keys(city).length == 0) {
            setCityValidationError(String.pleaseEnterCity)
            return
        }

        postAddNewFactory()
    }

    const sendSelectedFactoryIds = (selectedFactoryIds) => {

        setLoading(true);

        axios.post('send-inquiry', apiencrypt({
            inquiry_id: inquiryId,
            company_id: companyId,
            user_id: userId,
            factory_id: selectedFactoryIds
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log('response', response.data)

                console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data);

                if (data.status_code == 200) {
                    showAlertOrToast(String.inquirySendSuccessfully)
                    getSelectedFactoryList()
                }
            })
            .catch((error) => {
                showAlertOrToast(error.toString())
            }).then(function () {
                // always executed
                setLoading(false);

            });

    }



    const postAddNewFactory = () => {

        setLoading(true);

        axios.post('save-inquiry-contact', apiencrypt({
            factory: factoryName,
            contact_person: contactPerson,
            contact_number: contactNumber,
            contact_email: email,
            address: address,
            city: city
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log('response', response.data)

                console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data);

                if (data.status_code == 200) {
                    handleModal()
                    showAlertOrToast(String.factoryAddedSuccessfully)
                    getFactoryList()
                } else if(data.status_code == 401) {
                    if (data.hasOwnProperty('error')) {
                        if (data.error.hasOwnProperty('contact_email')) {
                            if(data.error.contact_email.length > 0) {
                                setEmailValidationError(data.error.contact_email[0])
                            }
                        }
                        if (data.error.hasOwnProperty('contact_number')) {
                            if(data.error.contact_number.length > 0) {
                                setContactNumberValidationError(data.error.contact_number[0])
                            }
                        }
                    }
                    data.error    
                }
            })
            .catch((error) => {
                showAlertOrToast(error.toString())
            }).then(function () {
                // always executed
                setLoading(false);

            });

    }

    const renderListItem = ({ item, index }) => (

        <Card style={styles.cardView}>
            <View style={styles.listContainer} key={item.inquiry_id}>


                <View style={styles.itemContainer} >
                    <View>
                        <Text style={styles.itemTitle}>{String.factory}</Text>
                        <Text style={styles.itemContent}>{item.factory}</Text>
                    </View>

                    <View style={{ width: 1, backgroundColor: Color.homeBox1 }}></View>

                    <View>
                        <Text style={styles.itemTitle}>{String.contactPerson}</Text>
                        <Text style={styles.itemContent}>{item.contact_person}</Text>
                    </View>

                    <View style={{ width: 1, backgroundColor: Color.homeBox1 }}></View>

                    <View>
                        <Text style={styles.itemTitle}>{String.contactNumber}</Text>
                        <Text style={styles.itemContent}>{item.contact_number}</Text>
                    </View>
                </View>


                <View style={{ width: ('100%'), height: 1, backgroundColor: Color.homeBox1 }}></View>

                <View style={styles.itemEmailCheckBoxContainer} >
                    <View style={styles.itemEmailInnerContainer}>
                        <Text style={styles.itemEmailTitle}>{String.emailColon}</Text>
                        <Text style={styles.itemEmailContent}>{item.contact_email}</Text>
                    </View>


                    <CheckBox
                        disabled={item.isSelected}
                        value={item.isNowSelected}
                        onValueChange={(newValue) => updateCheckBox(newValue, index)}
                        boxType={'square'}
                        onAnimationType={'bounce'}
                        offAnimationType={'stroke'}
                        style={styles.checkBox}
                        tintColors={{ true: Color.inquiryBlue }}
                    />
                </View>


            </View>
        </Card>
    );




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
                    <Text style={styles.toolBarText}>{String.selectFactory}</Text>
                </View>

                <View style={styles.navBarItemStyle}>
                </View>

            </View>

            {/* Toolbar */}


            <View style={styles.container}>

                <View style={styles.inquiryNumberLay}>
                    <Text style={styles.inquiryNoTitle}>{String.inquiryNoColon}</Text>
                    <Text style={styles.inquiryNo}>{String.inquiryShortForm + '-' + inquiryId}</Text>
                </View>


                {loading ?
                    <Loader />
                    : <FlatList
                        data={selectedFactoryData}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => {
                            return renderListItem({ item, index });
                        }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.contentContainerStyle}
                        ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
                        showsVerticalScrollIndicator={false}
                    />
                }

                {loading ? null : <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addNewFactoryButton} onPress={handleModal}>
                        <Text style={styles.buttonText}>{String.addNewFactory}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton} onPress={() => sendButtonClick()}>
                        <Text style={styles.buttonText}>{String.send}</Text>
                    </TouchableOpacity>
                </View>
                }


                <Modal
                    isVisible={isModalVisible}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    backdropTransitionInTiming={800}
                    backdropTransitionOutTiming={800}
                    onBackdropPress={handleModal}
                    onBackButtonPress={handleModal}
                    style={styles.bsModel}
                >

                    <View style={styles.bsContainer}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {loading ?
                                <Loader />
                                : <View>
                                    {/* Your bottom sheet content here */}
                                    <Text style={styles.bsTitle}>Add New Factory</Text>


                                    {/* factory textinout lay */}
                                    <View style={styles.bsTextInputContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            mode="outlined"
                                            outlineColor={Color.black}
                                            activeOutlineColor={Color.inquiryBlue}
                                            label={String.factoryMandatory}
                                            keyboardType='default'
                                            returnKeyType='next'
                                            placeholder={String.enterFactoryName}
                                            placeholderStyle={{
                                                fontFamily: Fontfamily.poppinsMedium,
                                                fontSize: 12,
                                            }}
                                            value={factoryName}
                                            onChangeText={(factoryName) => setFactoryName(factoryName)}
                                            theme={{ roundness: 5 }}
                                            editable={true}
                                            onSubmitEditing={() => inputRefCP.current.focus()}
                                        />

                                        {factoryValidationError.length > 0 ?
                                            <Image style={styles.errorImage}
                                                source={require('../assets/image/exclamation.png')}
                                            ></Image> : null
                                        }
                                    </View>

                                    <Text style={styles.errorText}>{factoryValidationError}</Text>
                                    {/* factory textinout lay */}

                                    {/* contact person textinout lay */}
                                    <View style={styles.bsTextInputContainer}>
                                        <TextInput
                                            ref={inputRefCP}
                                            style={styles.textInput}
                                            mode="outlined"
                                            outlineColor={Color.black}
                                            activeOutlineColor={Color.inquiryBlue}
                                            label={String.contactPersonMandatory}
                                            keyboardType='default'
                                            returnKeyType='next'
                                            placeholder={String.enterContactPerson}
                                            placeholderStyle={{
                                                fontFamily: Fontfamily.poppinsMedium,
                                                fontSize: 12,
                                            }}
                                            value={contactPerson}
                                            onChangeText={(contactPerson) => setContactPerson(contactPerson)}
                                            theme={{ roundness: 5 }}
                                            editable={true}
                                            onSubmitEditing={() => inputRefCN.current.focus()}
                                        />

                                        {contactPersonValidationError.length > 0 ?
                                            <Image style={styles.errorImage}
                                                source={require('../assets/image/exclamation.png')}
                                            ></Image> : null
                                        }
                                    </View>

                                    <Text style={styles.errorText}>{contactPersonValidationError}</Text>
                                    {/* contact person textinout lay */}

                                    {/* contact number textinout lay */}
                                    <View style={styles.bsTextInputContainer}>
                                        <TextInput
                                            ref={inputRefCN}
                                            style={styles.textInput}
                                            mode="outlined"
                                            outlineColor={Color.black}
                                            activeOutlineColor={Color.inquiryBlue}
                                            label={String.contactNumberMandatory}
                                            keyboardType='phone-pad'
                                            returnKeyType='next'
                                            placeholder={String.enterContactNumber}
                                            placeholderStyle={{
                                                fontFamily: Fontfamily.poppinsMedium,
                                                fontSize: 12,
                                            }}
                                            value={contactNumber}
                                            onChangeText={(contactNumber) => setContactNumber(contactNumber)}
                                            theme={{ roundness: 5 }}
                                            editable={true}
                                            onSubmitEditing={() => inputRefEmail.current.focus()}
                                        />

                                        {contactNumberValidationError.length > 0 ?
                                            <Image style={styles.errorImage}
                                                source={require('../assets/image/exclamation.png')}
                                            ></Image> : null
                                        }
                                    </View>

                                    <Text style={styles.errorText}>{contactNumberValidationError}</Text>
                                    {/* contact number textinout lay */}

                                    {/* email textinout lay */}
                                    <View style={styles.bsTextInputContainer}>
                                        <TextInput
                                            ref={inputRefEmail}
                                            style={styles.textInput}
                                            mode="outlined"
                                            outlineColor={Color.black}
                                            activeOutlineColor={Color.inquiryBlue}
                                            label={String.emailMandatory}
                                            keyboardType='email-address'
                                            returnKeyType='next'
                                            placeholder={String.enterEmailId}
                                            placeholderStyle={{
                                                fontFamily: Fontfamily.poppinsMedium,
                                                fontSize: 12,
                                            }}
                                            value={email}
                                            onChangeText={(email) => setEmail(email)}
                                            theme={{ roundness: 5 }}
                                            editable={true}
                                            onSubmitEditing={() => inputRefAddress.current.focus()}
                                        />

                                        {emailValidationError.length > 0 ?
                                            <Image style={styles.errorImage}
                                                source={require('../assets/image/exclamation.png')}
                                            ></Image> : null
                                        }
                                    </View>

                                    <Text style={styles.errorText}>{emailValidationError}</Text>
                                    {/* email textinout lay */}


                                    {/* address textinout lay */}
                                    <View style={styles.bsTextInputContainer}>
                                        <TextInput
                                            ref={inputRefAddress}
                                            style={styles.textInput}
                                            mode="outlined"
                                            outlineColor={Color.black}
                                            activeOutlineColor={Color.inquiryBlue}
                                            label={String.addressMandatory}
                                            keyboardType='default'
                                            returnKeyType='next'
                                            placeholder={String.enterAddress}
                                            placeholderStyle={{
                                                fontFamily: Fontfamily.poppinsMedium,
                                                fontSize: 12,
                                            }}
                                            value={address}
                                            onChangeText={(address) => setAddress(address)}
                                            theme={{ roundness: 5 }}
                                            editable={true}
                                            onSubmitEditing={() => inputRefCity.current.focus()}
                                        />

                                        {addressValidationError.length > 0 ?
                                            <Image style={styles.errorImage}
                                                source={require('../assets/image/exclamation.png')}
                                            ></Image> : null
                                        }
                                    </View>

                                    <Text style={styles.errorText}>{addressValidationError}</Text>
                                    {/* address textinout lay */}

                                    {/* city textinout lay */}
                                    <View style={styles.bsTextInputContainer}>
                                        <TextInput
                                            ref={inputRefCity}
                                            style={styles.textInput}
                                            mode="outlined"
                                            outlineColor={Color.black}
                                            activeOutlineColor={Color.inquiryBlue}
                                            label={String.cityMandatory}
                                            keyboardType='default'
                                            returnKeyType='done'
                                            placeholder={String.enterCity}
                                            placeholderStyle={{
                                                fontFamily: Fontfamily.poppinsMedium,
                                                fontSize: 12,
                                            }}
                                            value={city}
                                            onChangeText={(city) => setCity(city)}
                                            theme={{ roundness: 5 }}
                                            editable={true}
                                        />

                                        {cityValidationError.length > 0 ?
                                            <Image style={styles.errorImage}
                                                source={require('../assets/image/exclamation.png')}
                                            ></Image> : null
                                        }
                                    </View>

                                    <Text style={styles.errorText}>{cityValidationError}</Text>
                                    {/* city textinout lay */}




                                    {/* save canel button lay */}
                                    <View style={styles.bsButtonLay}>
                                        <TouchableOpacity style={styles.bsCancelButtonTouchable} onPress={() => handleModal()}>
                                            <Text style={styles.bsCancelButtonText}>{String.cancel}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.bsSaveButtonTouchable} onPress={() => validateAddFactory()}>
                                            <Text style={styles.bsSaveButtonText}>{String.save}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* save canel button lay */}


                                    {/* Your bottom sheet content here */}


                                </View>
                            }
                        </ScrollView>
                    </View>


                </Modal>



            </View>






        </View>
    );

};
export default SelectFactory;

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
    container: {
        flex: 1,
        backgroundColor: Color.pageBackground,
        padding: 12
    },
    inquiryNumberLay: {
        height: 50,
        backgroundColor: Color.white,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0
    },
    inquiryNoTitle: {
        color: Color.black,
        fontSize: 14,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 12
    },
    inquiryNo: {
        color: Color.inquiryBlue,
        fontSize: 14,
        fontFamily: Fontfamily.poppinsMedium
    },
    itemSeperator: {
        height: 12
    },
    contentContainerStyle: {
        paddingTop: 10,
        paddingBottom: 80
    },
    listContainer: {
        backgroundColor: Color.white,
    },
    itemContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    itemTitle: {
        color: Color.inquiryTextGray,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10
    },
    itemContent: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,
        marginBottom: 10,
        textAlign: 'center'
    },
    itemEmailCheckBoxContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Color.bottomBorder,
        paddingTop: 8,
        paddingBottom: 8
    },
    itemEmailInnerContainer: {
        flexDirection: 'row'
    },
    itemEmailTitle: {
        color: Color.inquiryTextGray,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginLeft: 16
    },
    itemEmailContent: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 4,
        marginRight: 4,
        textAlign: 'left'
    },
    checkBox: {
        width: 16,
        height: 16,
        marginRight: 12
    },
    cardView: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        shadowOpacity: 0.1
    },
    buttonContainer: {
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 20
    },
    addNewFactoryButton: {
        height: 45,
        backgroundColor: Color.inquiryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        marginRight: 10,
        paddingStart: 24,
        paddingEnd: 24
    },
    sendButton: {
        width: 125,
        height: 45,
        backgroundColor: Color.inquiryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        marginLeft: 10,
        paddingStart: 24,
        paddingEnd: 24
    },
    buttonText: {
        color: Color.white,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 12
    },
    bsTitle: {
        color: Color.black,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 16
    },
    bsModel: {
        justifyContent: 'flex-end',
        margin: 0
    },
    bsContainer: {
        backgroundColor: 'white',
        padding: 24
    },
    bsTextInputContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    textInput: {
        width: ('100%'),
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsSemiBold,
        marginTop: 5
    },
    bsButtonLay: {
        width: ('100%'),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 5
    },
    bsCancelButtonTouchable: {
        width: ('48%'),
        height: 45,
        backgroundColor: Color.inquiryBlueLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24
    },
    bsCancelButtonText: {
        color: Color.inquiryBlue,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 12,
    },
    bsSaveButtonTouchable: {
        width: ('48%'),
        height: 45,
        backgroundColor: Color.inquiryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24
    },
    bsSaveButtonText: {
        color: Color.white,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 12,
    },
    errorImage: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
        marginLeft: 'auto',
        marginRight: 10,
        marginTop: 15
    },
    errorText: {
        width: ('100%'),
        color: Color.pink,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 12,
        marginLeft: 15,
        marginTop: 5
    }
})