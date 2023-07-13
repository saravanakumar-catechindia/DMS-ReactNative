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
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';





const FactoryResponse = ({ navigation, route }) => {
    const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;

    const countries = ["Egypt", "Canada", "Australia", "Ireland"]


    const DATA = [
    ];

    const [Data, setData] = useState(DATA);
    const [pdfUrl, setPdfUrl] = useState(route.params.pdfUrl)
    const [inquiryId, setInquiryId] = useState(route.params.id)
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(route.params.token);
    const [userId, setUserId] = useState(route.params.userId)
    const [companyId, setCompanyId] = useState(route.params.companyId)
    const [workspaceId, setWorkspaceId] = useState(route.params.workspaceId)
    const [isFocus, setIsFocus] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const data1 = []
    const [dropDownValues, setDropDownValues] = useState([])

    const upArrow = require('../assets/image/ic_drop_down_up.png')
    const downArrow = require('../assets/image/ic_drop_down_down.png')


    useEffect(() => {
        getInquuiryList()
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

    const getInquuiryList = () => {

        setLoading(true);

        console.log('user_id', userId)
        console.log('companyId', companyId)
        console.log('workspaceId', workspaceId)

        axios.post('get-inquiry', apiencrypt({
            user_id: userId,
            company_id: companyId,
            workspace_id: workspaceId,
            page: 1,
            article_id: '',
            factory_id: '',
            from_date: '',
            to_date: ''
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
               // console.log('response', response.data)

              //  console.log(apidecrypt(response.data))

                let data = apidecrypt(response.data);

                if (data.hasOwnProperty('data')) {
                    if (data.hasOwnProperty('data')) {
                       // setDropDownValues(data.data.data)

                        var dataArray = data.data.data
                        console.log('dataArray inside ', dataArray)
                       
                        let inData = [...dropDownValues]
                        dataArray.map((item) => {
                            console.log('dataArray loop ', item.id)
                            inData.push({title: String.inquiryShortForm + '-' + item.id, id: item.id})
                        });
                        setDropDownValues(inData)
                       // setDropDownValues([...dropDownValues, inData])

                       // setDropDownValues((array) => [...array, inData]);

                      //  handleChange(inData)

                        console.log('dataArray inData ', inData)
                        console.log('dataArray dropDownValues here ', dropDownValues)
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

    const handleChange = (newValue) => {
        setDropDownValues((prevState) => [...prevState, newValue]);
      };

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

        <View style={styles.listContainer} key={item.id}>


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


    const renderLabel = () => {
        if (selectedItem || isFocus) {
          return (
            <Text style={[styles.label, isFocus && { color: Color.inquiryBlue }]}>
              {String.inquiryNo}
            </Text>
          );
        }
        return null;
      };


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

                    <View style={styles.dropDownContainer}>

                    {renderLabel()}
                    <SelectDropdown
                        data={dropDownValues}
                        defaultButtonText={String.selectInquiryNo}
                        onSelect={(selectedItem, index) => {
                            setSelectedItem(selectedItem)
                            console.log(selectedItem, index)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}


                        buttonStyle={styles.dropdownBtnStyle}
                        buttonTextStyle={styles.dropdownBtnTxtStyle}
                        renderDropdownIcon={isOpened => {
                            return <Image style={{ width: 14, height: 14 }} source={isOpened ? upArrow : downArrow}></Image>
                        }}
                        dropdownIconPosition={'right'}
                        renderCustomizedButtonChild={(selectedItem, index) => {
                            return (
                              <View style={styles.dropdown3BtnChildStyle}>
                                <Text style={styles.dropdown3BtnTxt}>{selectedItem ? selectedItem.title : String.selectInquiryNo}</Text>
                              </View>
                            );
                          }}
                        dropdownStyle={styles.dropdownDropdownStyle}
                        rowStyle={styles.dropdownRowStyle}
                        rowTextStyle={styles.dropdownRowTxtStyle}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}

                        renderCustomizedRowChild={(item, index) => {
                            return (
                              <View style={styles.dropdown3RowChildStyle}>
                                <Text style={styles.dropdown3RowTxt}>{item.title}</Text>
                              </View>
                            );
                          }}
                    />
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
    },

    dropdownBtnStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444'
    },
    dropdownBtnTxtStyle: { color: Color.black, textAlign: 'left', fontSize: 12, fontFamily: Fontfamily.poppinsMedium },
    dropdownDropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdownRowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdownRowTxtStyle: { color: Color.black, textAlign: 'left', fontSize: 12, fontFamily: Fontfamily.poppinsRegular },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 12,
        fontFamily: Fontfamily.poppinsRegular
      },
      dropDownContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginTop: 8
      },
      dropdown3RowChildStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdown3RowTxt: {
        color: Color.black,
        textAlign: 'left',
        fontSize: 12,
        marginHorizontal: 12,
        fontFamily: Fontfamily.poppinsRegular
      },
      dropdown3BtnChildStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
      },
      dropdown3BtnTxt: {
        color: Color.black,
        textAlign: 'left',
        fontSize: 12,
        fontFamily: Fontfamily.poppinsMedium
      },
})