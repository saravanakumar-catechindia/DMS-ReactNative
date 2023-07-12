import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Platform, Text, View, TouchableOpacity, FlatList, BackHandler, SafeAreaView, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../assets/Colors';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import Card from '../utils/Card';
import axios from '../restapi/Axios';
import Loader from '../utils/LoaderInquiry';
import Modal from '../utils/Model';
import { apidecrypt, apiencrypt, showAlertOrToast } from '../utils/Helper';
import Pdf from 'react-native-pdf';


const FactoryResponse = ({ navigation, route }) => {
    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;


    const DATA = [
    ];

    const [Data, setData] = useState(DATA);
    const [pdfUrl, setPdfUrl] = useState(route.params.pdfUrl)
    const [inquiryId, setInquiryId] = useState(route.params.id)
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(route.params.token);
    const [userId, setUserId] = useState(route.params.userId)


    useEffect(() => {
        getFactoryResponseList()
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [])

    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    const getFactoryResponseList = () => {

        setLoading(true);

        axios.post('inquiry-factory-response', apiencrypt({
            user_id: userId,
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
                    if (data.hasOwnProperty('data')) {
                        setData(data.data)
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

    const renderListItem = ({ item, index }) => (

        <View style={styles.listContainer}>
        

                <View style={styles.itemContainer} >
                    <Text style={styles.itemTitle}>{String.factory}</Text>
                    <Text style={styles.itemTitle}>{String.contactName}</Text>
                </View>

                <View style={styles.itemContainer} >
                    <Text style={styles.itemContent}>{item.factory}</Text>
                    <Text style={styles.itemContent}>{item.contact_person}</Text>
                </View>

                <View style={styles.itemContainer} >
                    <Text style={styles.itemTitle}>{String.phoneNumber}</Text>
                    <Text style={styles.itemTitle}>{String.price}</Text>
                </View>

                <View style={styles.itemContainerLast} >
                    <Text style={styles.itemContent}>{item.contact_number}</Text>
                    <Text style={styles.itemPrice}>{String.indianRupeeSymbol + ' ' + item.price}</Text>
                </View>


                <View style={styles.itemPOContainerLast} >
                    <Text style={styles.itemPOTitle}>{String.generatePurchaseOrder}</Text>
                    <Image style={styles.poImage}
                        source={require('../assets/image/ic_generate_po_gray.png')}>
                    </Image>
                </View>

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
                    <Text style={styles.toolBarText}>{String.factoryResponse}</Text>
                </View>

                <View style={styles.navBarItemStyle}>
                </View>

            </View>

            {/* Toolbar */}

            {loading ?
                <Loader />
                : <View style={styles.container}>

                    <View style={styles.inquiryNumberLay}>
                        <Text style={styles.inquiryNoTitle}>{String.inquiryNoColon}</Text>
                        <Text style={styles.inquiryNo}>{String.inquiryShortForm + '-' + inquiryId}</Text>
                    </View>


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

                </View>
            }





        </View>
    );

};
export default FactoryResponse;

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
        alignItems: 'center'
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
        height: 7
    },
    contentContainerStyle: {
        paddingTop: 5
    },
    listContainer: {
        backgroundColor: Color.white,
    },
    itemContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    itemContainerLast: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 8
    },
    itemPOContainerLast: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: Color.gray1,
        paddingTop: 8,
        paddingBottom: 8
    },
    itemTitle: {
        color: Color.inquiryTextGray,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8
    },
    itemPOTitle: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular,
        marginLeft: 16
    },
    itemContent: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,
        marginBottom: 2
    },
    itemPrice: {
        color: Color.inquiryPrice,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,
        marginBottom: 2
    }, 
    poImage: {
        marginRight: 16,
        width: 18,
        height: 18
    }
})