import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Platform, Text, View, TouchableOpacity, FlatList, BackHandler, SafeAreaView, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Color from '../assets/Colors';
import String from '../assets/Strings';
import Fontfamily from '../components/Fontfamily';
import Card from '../utils/Card';
import axios from '../restapi/Axios';
import Loader from '../utils/LoaderInquiry';
import { apidecrypt, apiencrypt, showAlertOrToast } from '../utils/Helper';



const InquirySentTo = ({ navigation, route }) => {
    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;

    const [Data, setData] = useState([]);
    const [inquiryId, setInquiryId] = useState(route.params.id)
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(route.params.token);

    useEffect(() => {
        getInquirySentToList()
        const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            backHandler.remove()
        };
    }, [])

    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    }


    const getInquirySentToList = () => {

        setLoading(true);



        axios.post('inquiry-factory-list', apiencrypt(
            {
                inquiry_id: inquiryId
            }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data)

                if (data.hasOwnProperty('data')) {
                    setData(data.data)
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

                <View style={styles.itemEmailContainer} >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.itemEmailTitle}>{String.emailColon}</Text>
                        <Text style={styles.itemEmailContent}>{item.contact_email}</Text>
                    </View>

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
                    <Text style={styles.toolBarText}>{String.inquirySentTo}</Text>
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
                        data={Data}
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

            </View>



        </View>
    );

};
export default InquirySentTo;

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
        paddingBottom: 50
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
    itemEmailContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.bottomBorder,
        paddingTop: 8,
        paddingBottom: 8
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
    cardView: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        shadowOpacity: 0.1
    },
})