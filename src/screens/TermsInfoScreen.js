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
import Modal from '../utils/Model';



const TermsInfoScreen = ({ navigation, route }) => {
    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;

    const [Data, setData] = useState([]);
    const [companyId, setCompanyId] = useState('')
    const [workspaceId, setWorkspaceId] = useState('')
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [pdfPath, setPdfPath] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)
    const [poId, setPoId] = useState('')

    useEffect(() => {
      //  getViewPOList()
        const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            backHandler.remove()
        };
    }, [])

    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    }


    const viewInquiryDetails = async (id) => {
        navigation.navigate('InquiryDetails', {
            name: 'InquiryDetails',
            pdfUrl: pdfPath + id + '.pdf'
        })
    }

    const showCancelPopUp = (id) => {
        setPoId(id)
        handleModal()
    }

    const handleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const getViewPOList = () => {

        setLoading(true);

        axios.post('view-po', apiencrypt(
            {
                company_id: companyId,
                workspace_id: workspaceId,
                page: 1
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
                    setData(data.data.data)
                }
                if (data.hasOwnProperty('pdfpath')) {
                    setPdfPath(data.pdfpath)
                }

            })
            .catch((error) => {
                showAlertOrToast(error.toString())
            }).then(function () {
                // always executed
                setLoading(false);
            });
    }


    const cancelPO = () => {

        handleModal()
        setLoading(true);

        axios.post('cancel-po', apiencrypt({
            po_id: poId,
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

                let data = apidecrypt(response.data);

                console.log(data)

                if (data.status_code == 200) {
                    getViewPOList()
                    showAlertOrToast(String.poCancelledSuccessfully)
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

                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{String.poId}</Text>
                    <Text style={styles.itemTitle}>{String.inquiryNo}</Text>
                    <Text style={styles.itemTitle}>{String.factoryName}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: Color.homeBox1 }}></View>
                <View style={styles.itemContainer}>

                    <Text style={styles.itemContent}>{String.po + "-" + item.po_id}</Text>


                    <View style={{ width: 1, backgroundColor: Color.homeBox1 }}></View>


                    <Text style={styles.itemContent}>{String.inquiryShortName + "-" + item.inquiry_id}</Text>


                    <View style={{ width: 1, backgroundColor: Color.homeBox1 }}></View>


                    <Text style={styles.itemContent}>{item.factory}</Text>

                </View>


                <View style={{ width: ('100%'), height: 1, backgroundColor: Color.homeBox1 }}></View>

                <View style={styles.itemButtonContainer} >
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        {item.po_status == 2 || item.po_status == 0 ? null :
                            <TouchableOpacity style={styles.viewButton} onPress={() => viewInquiryDetails(item.po_id)}>
                                <Text style={styles.viewButtonText}>{String.view}</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.cancelButton} onPress={() => showCancelPopUp(item.po_id)} disabled={item.po_status == 2}>
                            <Text style={styles.cancelButtonText}>{item.po_status == 2 ? String.cancelled : String.cancel}</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
        </Card>
    );



    return (

        <View style={styles.MainContainer}>
           

           


            <View style={styles.container}>
                {loading ?
                    <Loader />
                    :  
                    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white', alignItems: 'center'}}>
                    <Text style={styles.buttonSaveText}>{"Terms Info"}</Text>
                </View>
                }

            </View>


        </View>
    );

};
export default TermsInfoScreen;

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
        backgroundColor: Color.pageBackground
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
        marginTop: 15,
        marginBottom: 15,
        flex: 1
    },
    itemContent: {
        color: Color.black,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium,
        marginLeft: 18,
        marginRight: 16,
        marginTop: 12,
        marginBottom: 12,
        flex: 1
    },
    itemButtonContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.homeBox1
    },
    cardView: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        shadowOpacity: 0.1
    },
    viewButton: {
        height: 40,
        width: '100%',
        backgroundColor: Color.inquiryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        flex: 1,
        marginTop: 4,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2
    },
    viewButtonText: {
        color: Color.white,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 12
    },
    cancelButton: {
        height: 40,
        width: '100%',
        backgroundColor: Color.cancelButtonBg,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        flex: 1,
        marginTop: 4,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2
    },
    cancelButtonText: {
        color: Color.black,
        fontFamily: Fontfamily.poppinsMedium,
        fontSize: 12
    },
    modelHeaderImage: {
        width: 54,
        height: 54
    },
})