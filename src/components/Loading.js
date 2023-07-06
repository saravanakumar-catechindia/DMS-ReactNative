import * as React from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';
import Colors from '../assets/Colors';
const MyComponent = () => (
  <Modal
    transparent={true}
    animationType={'none'}
    loading={true}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
      <View style={{
        width: '85%', height: 80, backgroundColor: Colors.white, elevation: 2, borderRadius: 4, position: 'absolute', alignItems: 'center',
        flexDirection: 'row'
      }}>
        <ActivityIndicator size="small" style={{ marginLeft: 20 }} animating={true} color={Colors.green} />
        <Text style={{ color: Colors.dimText, marginLeft: 15, fontSize: 16 }}>Progress...</Text>
      </View>
    </View>
  </Modal>
);

export default MyComponent;