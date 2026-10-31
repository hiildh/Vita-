import React from 'react';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Simple local shapes, intentionally hidden from screen readers as decoration.
export default function CareIllustration({ small = false }) {
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: small ? 76 : 96, height: small ? 76 : 96, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: small ? 62 : 80, height: small ? 62 : 80, borderRadius: 50, backgroundColor: '#E5F0E9', top: 4, right: 2 }} />
    <View style={{ position: 'absolute', width: small ? 35 : 44, height: small ? 35 : 44, borderRadius: 22, backgroundColor: '#F5E5DC', bottom: 5, left: 3 }} />
    <Image source={require('../../assets/icon.png')} resizeMode="cover" style={{ width: small ? 47 : 58, height: small ? 47 : 58, borderRadius: 17, borderWidth: 1, borderColor: '#E7E4DF' }} />
    <Ionicons name="leaf" size={small ? 17 : 20} color="#709C87" style={{ position: 'absolute', right: 1, bottom: 10, transform: [{ rotate: '-25deg' }] }} />
  </View>;
}
