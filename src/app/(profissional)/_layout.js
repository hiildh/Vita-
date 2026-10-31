import React from 'react';
import { Stack } from 'expo-router';
export default function Layout() { return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" />{['paciente/[id]', 'visita/[id]', 'alerta/[id]'].map(name => <Stack.Screen key={name} name={name} options={{ headerShown: true, title: 'Voltar', headerBackTitle: 'Voltar', headerTintColor: '#2D705F', headerStyle: { backgroundColor: '#F8F6F2' }, headerShadowVisible: false }} />)}</Stack>; }
