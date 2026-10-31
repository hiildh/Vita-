import React from 'react';
import { Tabs, useSegments } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const icons = { index: 'home-outline', saude: 'heart-outline', medicamentos: 'medical-outline', alertas: 'notifications-outline', agenda: 'calendar-outline', pacientes: 'people-outline', perfil: 'person-outline' };
export default function ProfileTabs({ screens }) {
  const elderly = useSegments().includes('(idoso)');
  const { bottom } = useSafeAreaInsets();
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.deep, tabBarInactiveTintColor: '#596761', tabBarLabelStyle: { fontSize: elderly ? 10 : 11, fontWeight: '700' }, tabBarItemStyle: { paddingTop: 4 }, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line, height: 64 + bottom + 12, paddingBottom: bottom + 12, paddingTop: 4 }, tabBarIcon: ({ color, focused }) => {
    const base = route.name === 'index' && screens[0][1] === 'Pacientes' ? 'people-outline' : icons[route.name];
    return <View style={{ width: 42, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.sage : 'transparent' }}><Ionicons name={focused ? base.replace('-outline', '') : base} color={color} size={21} /></View>;
  } })}>{screens.map(([name, title]) => <Tabs.Screen key={name} name={name} options={{ title, tabBarAccessibilityLabel: title }} />)}</Tabs>;
}
