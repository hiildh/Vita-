import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { alertOrigins, alertStatuses } from '../utils/alerts';

const filters = [['todos', 'Todos'], ['pendente', 'Pendentes'], ['em_atendimento', 'Em atendimento'], ['resolvido', 'Resolvidos']];
export default function FamilyAlerts() {
  const { data, storageError } = useDemo();
  const [filter, setFilter] = useState('todos');
  const alerts = data.alerts.filter(item => item.elderlyId === data.people.elderly.id && (filter === 'todos' || item.status === filter)).sort((a, b) => new Date(b.date) - new Date(a.date));
  return <Screen eyebrow="Ana · familiar" title="Alertas" subtitle="Registros simulados compartilhados nesta instalação.">
    <View className="flex-row flex-wrap mb-2">{filters.map(([value, label]) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} className={`min-h-[44px] justify-center px-4 mr-2 mb-2 rounded-full border ${filter === value ? 'bg-deep border-deep active:bg-[#1C493E]' : 'bg-surface border-[#78988A] active:bg-sage'}`}><Text className={`font-bold ${filter === value ? 'text-white' : 'text-deep'}`}>{label}</Text></Pressable>)}</View>
    <SectionHeader>Alertas registrados</SectionHeader>
    {alerts.length ? alerts.map(item => <Card key={item.id} title={item.title} detail={`${alertOrigins[item.origin] || item.origin} · ${alertStatuses[item.status] || item.status}\n${item.reason}\n${formatDate(item.date)}`} icon={item.origin === 'sensor' ? 'radio-outline' : item.origin === 'pedido_de_ajuda' ? 'hand-left-outline' : 'notifications-outline'} onPress={() => router.push({ pathname: '/(familiar)/alerta/[id]', params: { id: item.id } })} />) : <Note>Nenhum alerta neste filtro.</Note>}
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}
  </Screen>;
}
