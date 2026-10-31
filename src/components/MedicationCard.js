import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Panel, StatusBadge } from './ElderUI';

function MedicationOption({ label, icon, checked, type, onPress, accessibilityLabel }) {
  const selected = type === 'confirmed'
    ? { background: 'bg-deep border-deep active:bg-[#1C493E]', text: 'text-white', icon: '#FFFFFF' }
    : { background: 'bg-[#FFE6BD] border-[#80541F] active:bg-[#F4D39F]', text: 'text-[#6D4518]', icon: '#6D4518' };
  const background = checked ? selected.background : 'bg-surface border-[#9AA9A0] active:bg-[#E9EFEB]';
  const foreground = checked ? selected.text : 'text-ink';
  return <Pressable accessibilityRole="radio" accessibilityLabel={accessibilityLabel} accessibilityState={{ checked }} onPress={onPress} className={`flex-1 min-w-0 min-h-[56px] px-2 py-3 rounded-xl border-2 flex-row items-center justify-center ${background}`}>
    <Ionicons name={checked ? 'checkmark-circle' : icon} size={20} color={checked ? selected.icon : '#43544B'} style={{ marginRight: 6 }} />
    <Text className={`text-center text-base font-bold shrink ${foreground}`}>{label}</Text>
  </Pressable>;
}

export default function MedicationCard({ occurrence, onMark }) {
  const { medication, time, status } = occurrence;
  return <Panel>
    <View className="flex-row items-center justify-between flex-wrap"><View className="flex-row items-center mr-3"><Ionicons name="time-outline" size={21} color="#24584B" /><Text className="text-deep text-xl font-bold ml-2">{time}</Text></View><StatusBadge status={status} /></View>
    <View className="h-px bg-line my-4" />
    <View className="flex-row items-start"><View className="w-12 h-12 rounded-2xl bg-sage items-center justify-center mr-3"><Ionicons name="medkit-outline" size={24} color="#24584B" /></View><View className="flex-1"><Text className="text-ink text-xl font-bold">{medication.name}</Text><Text className="text-ink text-lg mt-1">{medication.dose}</Text><Text className="text-muted text-base leading-6 mt-1">{medication.instruction}</Text></View></View>
    <View accessibilityRole="radiogroup" accessibilityLabel={`Registro de ${medication.name}, horário ${time}`} className="flex-row mt-4">
      <MedicationOption label="Tomei" icon="checkmark-circle-outline" type="confirmed" checked={status === 'confirmed'} accessibilityLabel={`Tomei ${medication.name}, horário ${time}`} onPress={() => onMark(occurrence, 'confirmed')} />
      <View className="w-2" />
      <MedicationOption label="Não tomei" icon="remove-circle-outline" type="missed" checked={status === 'missed'} accessibilityLabel={`Não tomei ${medication.name}, horário ${time}`} onPress={() => onMark(occurrence, 'missed')} />
    </View>
    {status !== 'pending' && <Text className="text-muted text-base mt-3">Para corrigir, escolha a outra opção.</Text>}
  </Panel>;
}
