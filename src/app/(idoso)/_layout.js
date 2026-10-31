import React from 'react';
import { Stack } from 'expo-router';
export default function Layout() { return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="residencia" options={{ headerShown: true, title: "Residência", headerBackTitle: "Voltar", headerTintColor: "#2D705F", headerStyle: { backgroundColor: "#F8F6F2" }, headerShadowVisible: false }} /></Stack>; }
