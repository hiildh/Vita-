import React from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { Panel, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { dailyOccurrences } from '../utils/medications';
import { useCurrentTime } from '../utils/useCurrentTime';

export default function FamilyOverview() {
  const { data, storageError } = useDemo();
  const now = useCurrentTime();
  const occurrences = dailyOccurrences(data, now);
  const count = status => occurrences.filter(item => item.status === status).length;
  const pendingAlerts = data.alerts.filter(item => item.elderlyId === data.people.elderly.id && item.status === 'pendente');
  const attendingAlerts = data.alerts.filter(item => item.elderlyId === data.people.elderly.id && item.status === 'em_atendimento');
  const attention = pendingAlerts.length > 0 || attendingAlerts.length > 0 || occurrences.some(item => item.status !== 'confirmed');
  const latest = [...data.measurements].sort((a, b) => (b.recordedAt || '').localeCompare(a.recordedAt || ''));
  const next = data.appointments.filter(item => item.patientId === data.people.elderly.id && item.status !== 'realizada' && new Date(item.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const event = [...data.sensorEvents].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return <Screen eyebrow="Ana · familiar" title="Acompanhamento de Dona Maria" subtitle="Dados fictícios — acompanhamento local de demonstração">
    <Panel tone="peach"><Text className="text-deep text-base font-bold">Acesso simulado e autorizado</Text><Text className="text-ink text-sm leading-5 mt-1">Autorização fictícia para o protótipo; não é um controle real de privacidade.</Text></Panel>
    <Panel tone={attention ? 'warning' : 'sage'}><Text style={{ color: attention ? '#754D1D' : '#24584B', fontSize: 20, fontWeight: '700' }}>{attention ? 'Atenção necessária' : 'Tudo atualizado'}</Text><Text className="text-ink text-base leading-6 mt-2">Situação baseada nos medicamentos de hoje e nos alertas locais.</Text></Panel>
    <SectionHeader>Alertas e eventos</SectionHeader>
    <Card title={`${pendingAlerts.length} ${pendingAlerts.length === 1 ? 'alerta pendente' : 'alertas pendentes'}`} detail={`${attendingAlerts.length} em atendimento · Ver alertas e providências`} icon="notifications-outline" onPress={() => router.navigate('/(familiar)/(tabs)/alertas')} />
    <Card title="Eventos da residência" detail={event ? `Último: ${event.reason} · ${formatDate(event.date)}` : 'Nenhum evento simulado registrado'} icon="radio-outline" onPress={() => router.push('/(familiar)/residencia')} />
    <SectionHeader>Medicamentos de hoje</SectionHeader>
    <Card title="Resumo dos horários" detail={`${count('confirmed')} confirmados · ${count('pending')} pendentes · ${count('missed')} não tomados`} icon="medkit-outline" onPress={() => router.push('/(familiar)/medicamentos')} />
    <SectionHeader>Saúde</SectionHeader>
    <Card title="Medições recentes" detail={latest.length ? latest.slice(0, 3).map(item => `${item.type}: ${item.value} ${item.unit}`).join('\n') : 'Nenhuma medição registrada'} icon="pulse-outline" onPress={() => router.push('/(familiar)/saude')} />
    <SectionHeader>Próximo compromisso</SectionHeader>
    <Card title={next ? next.title : 'Nenhum compromisso futuro'} detail={next ? `${formatDate(next.date)} · ${next.professional}\n${next.detail}` : 'Ver agenda de demonstração'} icon="calendar-outline" onPress={() => router.navigate('/(familiar)/(tabs)/agenda')} />
    <SectionHeader>Residência simulada</SectionHeader>
    <Card title="Sensores simulados" detail={data.sensors.map(sensor => `${sensor.name}: ${sensor.status}\nÚltima atividade: ${sensor.lastActivity} · ${sensor.updatedAt ? formatDate(sensor.updatedAt) : 'atualização não informada'}`).join('\n\n')} icon="home-outline" onPress={() => router.push('/(familiar)/residencia')} />
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}
  </Screen>;
}
