import React, { useRef } from 'react';
import { Alert, Text } from 'react-native';
import { router } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { Panel, PrimaryButton, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate, formatToday } from '../utils/date';
import { dailyOccurrences } from '../utils/medications';
import { useCurrentTime } from '../utils/useCurrentTime';
import CareIllustration from './CareIllustration';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function ElderHome() {
  const { data, storageError, createAlert } = useDemo();
  const helpLock = useRef(false);
  const now = useCurrentTime();
  const occurrences = dailyOccurrences(data, now);
  const pending = occurrences.filter(item => item.status === 'pending');
  const attention = occurrences.some(item => item.status !== 'confirmed') || data.alerts.some(item => item.status === 'pendente');
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const nextMedication = pending.find(item => item.time >= currentTime) || pending[0];
  const nextAppointment = data.appointments.filter(item => item.patientId === data.people.elderly.id && item.status !== 'realizada' && new Date(item.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  function requestHelp() {
    if (helpLock.current) return;
    helpLock.current = true;
    let confirmed = false;
    Alert.alert('Registrar pedido de ajuda?', 'Este pedido ficará somente nesta demonstração, neste aparelho. Nenhuma ligação, notificação ou socorro será acionado.', [
      { text: 'Cancelar', style: 'cancel', onPress: () => { helpLock.current = false; } },
      { text: 'Confirmar', onPress: () => {
        if (confirmed) return;
        confirmed = true;
        createAlert({ elderlyId: data.people.elderly.id, origin: 'pedido_de_ajuda', reason: 'Pedido de ajuda feito por Dona Maria.' });
        Alert.alert('Pedido registrado', 'Pedido de ajuda registrado nesta demonstração. Ele estará visível no perfil familiar deste aparelho.', [{ text: 'Entendi', onPress: () => { helpLock.current = false; } }], { cancelable: true, onDismiss: () => { helpLock.current = false; } });
      } },
    ], { cancelable: true, onDismiss: () => { if (!confirmed) helpLock.current = false; } });
  }
  return <Screen eyebrow={formatToday(now)} title="Olá, Dona Maria!" subtitle="Seu cuidado, com tranquilidade, um dia de cada vez." decoration={<CareIllustration small />}>
    <Panel tone={attention ? 'peach' : 'sage'}><View className="flex-row items-center"><Ionicons name={attention ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={25} color={attention ? '#854B1B' : '#24584B'} /><Text style={{ color: attention ? '#854B1B' : '#24584B', fontSize: 20, fontWeight: '700', marginLeft: 8, flexShrink: 1 }}>{attention ? 'Atenção necessária' : 'Tudo atualizado'}</Text></View><Text className="text-ink text-base leading-6 mt-2">{attention ? 'Confira seus medicamentos e alertas de hoje.' : 'Seus registros de hoje estão em dia.'}</Text></Panel>
    <PrimaryButton title="Preciso de ajuda" icon="hand-left-outline" variant="danger" accessibilityHint="Abre uma confirmação para registrar um pedido nesta demonstração" onPress={requestHelp} />
    <SectionHeader>Próximo medicamento</SectionHeader>
    {nextMedication ? <Card title={nextMedication.medication.name} detail={`${nextMedication.medication.dose} · ${nextMedication.time}`} icon="medkit-outline" onPress={() => router.navigate('/(idoso)/(tabs)/medicamentos')} /> : <Card title="Nenhuma ocorrência pendente" detail="Consulte os registros de hoje em Medicamentos." icon="checkmark-circle-outline" onPress={() => router.navigate('/(idoso)/(tabs)/medicamentos')} />}
    <SectionHeader>Próxima consulta ou visita</SectionHeader>
    {nextAppointment ? <Card title={nextAppointment.title} detail={`${formatDate(nextAppointment.date)} · ${nextAppointment.professional}`} icon="calendar-outline" tone="peach" /> : <Card title="Nenhum compromisso futuro" detail="Não há consultas ou visitas futuras cadastradas." icon="calendar-outline" />}
    <SectionHeader>Seu cuidado</SectionHeader><Card title="Saúde" detail="Ver e registrar informações fictícias" icon="heart-outline" onPress={() => router.navigate('/(idoso)/(tabs)/saude')} /><Card title="Residência" detail="Ver sensores simulados" icon="home-outline" onPress={() => router.push('/(idoso)/residencia')} />
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}<Note>Modo demonstração — dados fictícios.</Note>
  </Screen>;
}
