import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { useVisualContext } from './VisualContext';

export function SectionHeader({ children }) { const { elderly } = useVisualContext(); return <View className="flex-row items-center mt-6 mb-3"><View className="w-1 h-5 bg-mint rounded-full mr-3" /><Text className={`text-ink font-bold ${elderly ? 'text-xl' : 'text-lg'}`}>{children}</Text></View>; }
export function StatusBadge({ status }) {
  const styles = { pending: ['Pendente', '#F0EFEC', '#43544B', 'time-outline'], confirmed: ['Confirmado', '#E5F0E9', '#24584B', 'checkmark-circle-outline'], missed: ['Não tomado', '#FFE6BD', '#6D4518', 'alert-circle-outline'] };
  const [label, backgroundColor, color, icon] = styles[status] || styles.pending;
  return <View style={{ backgroundColor, alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}><Ionicons name={icon} size={16} color={color} /><Text style={{ color, fontWeight: '700', fontSize: 14, marginLeft: 5 }}>{label}</Text></View>;
}
export function PrimaryButton({ title, onPress, secondary = false, selected = false, accessibilityHint, accessibilityLabel, variant, icon }) {
  const { elderly } = useVisualContext();
  const kind = variant || (secondary ? 'outline' : 'primary');
  const variants = {
    primary: { container: 'bg-deep active:bg-[#1C493E]', text: 'text-white', icon: '#FFFFFF' },
    outline: { container: 'bg-surface border border-[#78988A] active:bg-sage', text: 'text-deep', icon: colors.deep },
    soft: { container: 'bg-sage active:bg-[#D3E6DA]', text: 'text-deep', icon: colors.deep },
    missed: { container: 'bg-[#FFE6BD] active:bg-[#F4D39F]', text: 'text-[#6D4518]', icon: '#6D4518' },
    ghost: { container: 'bg-transparent active:bg-sage', text: 'text-deep', icon: colors.deep },
    danger: { container: 'bg-[#9E3F3F] active:bg-[#833333]', text: 'text-white', icon: '#FFFFFF' },
  };
  const style = variants[kind] || variants.primary;
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel || title} accessibilityState={{ selected }} accessibilityHint={accessibilityHint} onPress={onPress} className={`flex-row items-center justify-center px-4 ${elderly ? 'min-h-[54px] rounded-2xl py-3' : 'min-h-[46px] rounded-xl py-2.5'} ${style.container}`}>{icon && <Ionicons name={icon} size={20} color={style.icon} style={{ marginRight: 8 }} />}<Text className={`font-bold text-center shrink ${elderly ? 'text-[17px]' : 'text-[15px]'} ${style.text}`}>{title}</Text></Pressable>;
}
export function Panel({ children, tone = 'surface' }) { const { elderly } = useVisualContext(); const backgrounds = { surface: 'bg-surface border-line', sage: 'bg-sage border-sage', peach: 'bg-peach border-peach', warning: 'bg-[#FFF1DC] border-[#F5E3CB]' }; return <View className={`${backgrounds[tone] || backgrounds.surface} border rounded-3xl mb-3 ${elderly ? 'p-5' : 'p-4'}`}>{children}</View>; }
