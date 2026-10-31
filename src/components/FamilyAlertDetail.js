import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Note, Screen } from './Screen';
import { Panel, PrimaryButton, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { alertOrigins, alertStatuses } from '../utils/alerts';
const actor = 'Ana (familiar)';
export default function FamilyAlertDetail() {
  const { id } = useLocalSearchParams();
  const { data, changeAlertStatus, addAlertNote, storageError } = useDemo();
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const actionLock = useRef(false);
  const alert = data.alerts.find(item => item.id === id && item.elderlyId === data.people.elderly.id);
  useEffect(() => { actionLock.current = false; }, [alert?.status, alert?.history.length]);
  if (!alert) return <Screen eyebrow="Ana · familiar" title="Alerta não encontrado"><Note>O registro não está disponível nesta demonstração.</Note></Screen>;
  function recordNote() {
    if (actionLock.current) return;
    if (!note.trim()) { setMessage('Escreva uma providência para registrar.'); return; }
    actionLock.current = true;
    addAlertNote(alert.id, note, actor); setNote(''); setMessage('Providência fictícia registrada.');
  }
  function updateStatus(status) {
    if (actionLock.current) return;
    actionLock.current = true;
    if (note.trim()) addAlertNote(alert.id, note, actor);
    changeAlertStatus(alert.id, status, actor); setNote(''); setMessage(`Status atualizado: ${alertStatuses[status]}.`);
  }
  return <Screen eyebrow="Ana · familiar" title={alert.title} subtitle="Alerta fictício registrado neste aparelho.">
    <Panel><Text className="text-primary text-lg font-bold">{alertStatuses[alert.status] || alert.status}</Text><Text className="text-ink text-base leading-6 mt-3">Motivo: {alert.reason}{'\n'}Origem: {alertOrigins[alert.origin] || alert.origin}{'\n'}Registrado em: {formatDate(alert.date)}</Text></Panel>
    {alert.status !== 'resolvido' && <><SectionHeader>Providência fictícia</SectionHeader><Panel><Text className="text-ink text-base mb-2">Observação opcional</Text><TextInput accessibilityLabel="Providência ou observação fictícia" value={note} onChangeText={setNote} multiline maxLength={500} placeholder="Descreva a providência" placeholderTextColor="#697A71" style={{ borderWidth: 1, borderColor: '#A7B8AE', borderRadius: 14, padding: 14, minHeight: 100, textAlignVertical: 'top', fontSize: 17, color: '#25312D' }} /><Text className="text-[#596A62] text-sm mt-2 mb-4">A data e a hora serão registradas ao salvar. O texto também é salvo ao alterar o status.</Text><PrimaryButton title="Registrar providência" secondary onPress={recordNote} />{alert.status === 'pendente' && <View className="mt-3"><PrimaryButton title="Iniciar atendimento" onPress={() => updateStatus('em_atendimento')} /></View>}<View className="mt-3"><PrimaryButton title="Marcar como resolvido" onPress={() => updateStatus('resolvido')} /></View></Panel></>}
    {message ? <Text accessibilityLiveRegion="polite" className="text-ink text-base mb-2">{message}</Text> : null}
    <SectionHeader>Histórico de providências</SectionHeader><Panel>{alert.history.length ? alert.history.map(entry => <View key={entry.id} className="mb-4"><Text className="text-ink text-base font-bold">{formatDate(entry.date)}{entry.actor ? ` · ${entry.actor}` : ''}</Text><Text className="text-[#596A62] text-base leading-6 mt-1">{entry.text}</Text></View>) : <Text className="text-[#596A62] text-base">Nenhuma alteração registrada.</Text>}</Panel>
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}<Note>As providências são apenas registros fictícios locais.</Note>
  </Screen>;
}
