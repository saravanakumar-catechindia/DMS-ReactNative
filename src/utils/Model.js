import React, { useState, useRef, useEffect, createRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Alert,
  ImageBackground, TextInput, BackHandler, ScrollView, Animated,
  FlatList, useWindowDimensions,
  ActivityIndicator
} from 'react-native';
import Colors from '../assets/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontfamily from '../components/Fontfamily';
import RNModal from "react-native-modal";



export const Modal = ({ isVisible = false, children, ...props }) => {

  return (
    <RNModal
      isVisible={isVisible}
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={800}
      {...props}>
      {children}
    </RNModal>
  );
};

const ModalContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);
const ModalHeader = ({ children }) => (
  <View style={styles.header}>{children}</View>
);

const ModalBody = ({ children }) => (
  <View style={styles.body}>{children}</View>
);

const ModalFooter = ({ children }) => (
  <View style={styles.footer}>{children}</View>
);

export default Modal;

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  body: {
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 12
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 12,
    marginBottom: 20
  },
})

Modal.Header = ModalHeader;
Modal.Container = ModalContainer;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;