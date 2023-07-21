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
import FactoryResponse from './FactoryResponse';


const ViewInquiryScreen = ({ navigation, route }) => {

    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;

    const DATA = [
    ];

    const [Data, setData] = useState(DATA);
    const [pdfPath, setPdfPath] = useState('')
    const [inquiryDate, setInquiryDate] = useState('')
    const [styleNo, setStyleNo] = useState('')
    const [articleName, setArticleName] = useState('')
    const [userId, setUserId] = useState(route.params.userId)
    const [companyId, setCompannyId] = useState(route.params.companyId)
    const [workspaceId, setWorkspaceId] = useState(route.params.workspaceId)
    const [token, setToken] = useState(route.params.token);
    const [loading, setLoading] = useState(false);
    const [encryptedText, setEnctyptedText] = useState('');


    useEffect(() => {
        getInquiryList()

        const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
         return () => {
            backHandler.remove();
           //  BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
         };

        //return () => backHandler.remove()
    }, [])

    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }
    const nextpage = async () => {

    }


    const getInquiryList = () => {


        setLoading(true);

        axios.post('get-inquiry', apiencrypt({
            user_id: userId,
            company_id: companyId,
            workspace_id: workspaceId
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

                // response.data.data.data
                if (data.hasOwnProperty('data')) {
                    if (data.data.hasOwnProperty('data')) {
                        if (data.hasOwnProperty('pdfpath')) {
                            setPdfPath(data.pdfpath)
                        }
                        setData(data.data.data)
                    }
                }

            })
            .catch((error) => {
                showAlertOrToast(error.toString())
            }).then(function () {
                // always executed
                setLoading(false);
            });


    }


    const getSelectFactoryList = (inquiryId) => {

        setLoading(true);

        axios.post('get-inquiry-factory', apiencrypt(), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {


                let data = apidecrypt(response.data)

                if (data.hasOwnProperty('data')) {

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


                    try {
                          selectFactory(inquiryId, updatedData)
                    } catch(e) {
                        console.log('saving error ' + e);
                    }
                    

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

    const viewInquiryDetails = async (id) => {
        navigation.navigate('InquiryDetails', {
            name: 'InquiryDetails',
            pdfUrl: pdfPath + id + '.pdf'
        })
    }

    const viewFactoryResponse = async (id) => {
        navigation.navigate('FactoryResponse', {
            name: 'FactoryResponse',
            id: id,
            token: token,
            userId: userId,
            companyId: companyId,
            workspaceId: workspaceId,
            fromInquiryList: false
        })
    }

    const selectFactory = async (id, data) => {
        navigation.navigate('SelectFactory', {
            name: 'SelectFactory',
            id: id,
            token: token,
            data: data
        })
    }

    const inquirySentTo = async (id) => {
        navigation.navigate('InquirySentTo', {
            name: 'InquirySentTo',
            id: id,
            token: token
        })
    }

    const renderListItem = ({ item, index }) => (

        <View style={styles.listContainer} key={item.id}>
            <Card style={styles.cardView}>

                <View style={styles.itemGrayContainer} >
                    <Text style={styles.itemTitle}>{String.inquiryNo}</Text>
                    <Text style={styles.itemTitle}>{String.inquiryDate}</Text>
                </View>

                <View style={styles.itemBlueContainer} >
                    <Text style={styles.itemContent}>{'IN-' + item.id}</Text>
                    <Text style={styles.itemContent}>{item.created_date}</Text>
                </View>

                <View style={styles.itemGrayContainer} >
                    <Text style={styles.itemTitle}>{String.styleNo}</Text>
                    <Text style={styles.itemTitle}>{String.itemOrArticleName}</Text>
                </View>

                <View style={styles.itemBlueContainer} >
                    <Text style={styles.itemContent}>{item.style_no}</Text>
                    <Text style={styles.itemContent}>{item.name}</Text>
                </View>

                <View style={styles.itemIconContainer} >

                    <TouchableOpacity onPress={() => viewInquiryDetails(item.id)}>
                        <Image style={styles.menuIcon}
                            source={require('../assets/image/ic_eye_gray.png')} />
                    </TouchableOpacity>
                    <View style={styles.verticalLine}></View>
                    <TouchableOpacity onPress={() => viewFactoryResponse(item.id)}>
                        <Image style={styles.menuIcon}
                            source={require('../assets/image/ic_factory_response_gray.png')} />
                    </TouchableOpacity>
                    <View style={styles.verticalLine}></View>
                    <TouchableOpacity onPress={() => getSelectFactoryList(item.id)}>
                        <Image style={styles.menuIcon}
                            source={require('../assets/image/ic_select_supplier.png')} />
                    </TouchableOpacity>
                    <View style={styles.verticalLine}></View>
                    <TouchableOpacity onPress={() => inquirySentTo(item.id)}>
                        <Image style={styles.menuIcon}
                            source={require('../assets/image/ic_inquiry_sent_to.png')} />
                    </TouchableOpacity>
                    <View style={styles.verticalLine}></View>
                    <TouchableOpacity>
                        <Image style={styles.menuIcon}
                            source={require('../assets/image/ic_delete_gray.png')} />
                    </TouchableOpacity>

                </View>

            </Card>


        </View>
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
                    <Text style={styles.toolBarText}>{String.viewInquiry}</Text>
                </View>

                <View style={styles.navBarItemStyle}>
                </View>

            </View>

            {/* Toolbar */}

            {loading ?
                <Loader />
                :
                <FlatList
                    data={Data}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => {
                        return renderListItem({ item, index });
                    }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}
                    ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
                />
            }

        </View>

    );

};

export default ViewInquiryScreen;

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
    verticalLine: {
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