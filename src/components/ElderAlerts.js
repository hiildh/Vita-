import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Note } from './Screen';
import { Panel, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { alertOrigins, alertStatuses } from '../utils/alerts';

export default function ElderAlerts() {
  const { data, storageError } = useDemo();
  const [expanded, setExpanded] = useState({});
  const entries = [...data.alerts.map(item => ({ ...item, kind: 'alert' })), ...data.sensorEvents.map(item => ({ ...item, kind: 'event' }))].sort((a, b) => new Date(b.date) - new Date(a.date));
  return <Screen eyebrow="Dona Maria" title="Alertas e eventos" subtitle="Histórico fictício desta demonstração neste aparelho.">
    <SectionHeader>Histórico</SectionHeader>
    {entries.length ? entries.map(item => {
      const isEvent = item.kind === 'event';
      const origin = isEvent ? 'Evento de sensor simulado' : (alertOrigins[item.origin] || item.origin);
      const icon = isEvent || item.origin === 'sensor' ? 'radio-outline' : item.origin === 'pedido_de_ajuda' ? 'hand-left-outline' : 'notifications-outline';
      const isOpen = !!expanded[`${item.kind}-${item.id}`];
      return <Panel key={`${item.kind}-${item.id}`}><Pressable accessibilityRole="button" accessibilityState={{ expanded: isOpen }} onPress={() => setExpanded(current => ({ ...current, [`${item.kind}-${item.id}`]: !isOpen }))}>
        <View className="flex-row items-center"><Ionicons name={icon} size={25} color="#2D705F" /><Text className="text-primary text-base font-bold ml-2 flex-1">{origin}</Text><Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#2D705F" /></View>
        <Text className="text-ink text-lg font-bold mt-2">{isEvent ? item.reason : item.title}</Text>
        {!isEvent && <Text className="text-ink text-base mt-1">Motivo: {item.reason}</Text>}
        <Text className="text-muted text-base mt-2">{formatDate(item.date)}</Text><View className={`self-start rounded-full px-3 py-1 mt-2 ${isEvent ? 'bg-[#F0EFEC]' : item.status === 'pendente' ? 'bg-[#FFF1DC]' : item.status === 'resolvido' ? 'bg-sage' : 'bg-peach'}`}><Text className={`font-bold text-sm ${!isEvent && item.status === 'pendente' ? 'text-[#754D1D]' : 'text-ink'}`}>{isEvent ? 'Evento registrado' : (alertStatuses[item.status] || item.status)}</Text></View>
        <Text className="text-primary text-base font-bold mt-3">{isOpen ? 'Ocultar detalhes' : 'Ver detalhes'}</Text>
      </Pressable>
      {isOpen && <View className="mt-4 border-t border-line pt-4"><Text className="text-ink text-base font-bold mb-3">Linha do tempo</Text>{isEvent ? <Text className="text-muted text-base leading-6">{formatDate(item.date)} · {item.reason} (simulado).{item.alertId ? '\nAlerta de verificação criado para este evento.' : ''}</Text> : item.history.map(entry => <View key={entry.id} className="mb-3 pl-3 border-l-2 border-[#B7CFC2]"><Text className="text-ink text-base font-bold">{formatDate(entry.date)}{entry.actor ? ` · ${entry.actor}` : ''}</Text><Text className="text-muted text-base leading-6">{entry.text}</Text></View>)}</View>}</Panel>;
    }) : <Note>Nenhum alerta ou evento registrado.</Note>}
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}
    <Note>Todos os alertas e eventos são simulados; nenhuma notificação real é enviada.</Note>
  </Screen>;
}
