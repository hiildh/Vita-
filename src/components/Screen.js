import React from 'react';
import { ScrollView, Text, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSegments } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useDemo } from '../context/DemoContext';
import { VisualContext, useVisualContext } from './VisualContext';

export function Screen({ eyebrow, title, subtitle, children, decoration }) {
  const { storageReadError } = useDemo();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const elderly = segments.includes('(idoso)');
  return <VisualContext.Provider value={{ elderly }}><SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.cream }}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-cream" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 36 + insets.bottom, flexGrow: 1 }}><View className="w-full max-w-xl self-center">
    {storageReadError && <Text accessibilityRole="alert" className="text-[#754D1D] bg-[#FFF1DC] rounded-2xl p-4 mb-4 text-base leading-6">Não foi possível ler os dados salvos. Os dados exibidos são temporários e não serão salvos. Reabra o app ou restaure a demonstração no perfil.</Text>}
    <View className="flex-row items-center mb-6"><View className="flex-1 pr-2"><Text className="text-primary font-bold text-xs uppercase tracking-widest">{eyebrow || 'VITA+'}</Text><Text className="text-ink text-3xl font-bold mt-2 leading-9">{title}</Text>{subtitle ? <Text className="text-muted text-base leading-6 mt-2">{subtitle}</Text> : null}</View>{decoration || null}</View>
    {children}
  </View></ScrollView></KeyboardAvoidingView></SafeAreaView></VisualContext.Provider>;
}
const iconTones = { 'calendar-outline': 'peach', 'time-outline': 'peach', 'notifications-outline': 'peach', 'hand-left-outline': 'peach', 'person-outline': 'peach', 'people-outline': 'peach' };
export function Card({ title, detail, icon = 'heart-outline', onPress, trailing, tone }) {
  const { elderly } = useVisualContext();
  const iconTone = tone || iconTones[icon] || 'sage';
  const body = <><View className={`items-center justify-center mr-4 ${elderly ? 'w-12 h-12 rounded-2xl' : 'w-11 h-11 rounded-2xl'} ${iconTone === 'peach' ? 'bg-peach' : 'bg-sage'}`}><Ionicons name={icon} size={elderly ? 24 : 22} color={colors.deep} /></View><View className="flex-1"><Text className={`text-ink font-bold ${elderly ? 'text-lg' : 'text-base'}`}>{title}</Text>{detail ? <Text className={`text-muted leading-6 mt-1 ${elderly ? 'text-base' : 'text-sm'}`}>{detail}</Text> : null}</View>{trailing || (onPress ? <Ionicons name="chevron-forward" size={20} color={colors.primary} /> : null)}</>;
  const style = `bg-surface rounded-3xl border border-line mb-3 flex-row items-center ${elderly ? 'p-4 min-h-[84px]' : 'p-4 min-h-[76px]'}`;
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} className={`${style} active:bg-[#F0F4EF]`}>{body}</Pressable> : <View className={style}>{body}</View>;
}
export function Note({ children }) { const { elderly } = useVisualContext(); return <Text className={`text-muted leading-5 mt-4 ${elderly ? 'text-base' : 'text-sm'}`}>{children}</Text>; }
