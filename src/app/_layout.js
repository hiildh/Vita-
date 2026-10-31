import '../../global.css';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoProvider, useDemo } from '../context/DemoContext';
function Navigation() { const { ready } = useDemo(); if (!ready) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8F6F2' }}><ActivityIndicator color="#2D705F" accessibilityLabel="Carregando demonstração" /></View>; return <Stack initialRouteName="index" screenOptions={{ headerShown: false }}><Stack.Screen name="index" /><Stack.Screen name="selecionar-perfil" /></Stack>; }
export default function RootLayout() { return <SafeAreaProvider><DemoProvider><Navigation /></DemoProvider></SafeAreaProvider>; }
