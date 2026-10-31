import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { Panel, PrimaryButton, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { alertOrigins, alertStatuses } from '../utils/alerts';
const actor = 'Enfermeira Camila (profissional)';

export function ProfessionalAlerts() {
  const { data, storageError } = useDemo();
  const alerts = [...data.alerts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pending = alerts.filter(item => !item.reviewedAt);
  const reviewed = alerts.filter(item => item.reviewedAt);
  const render = item => { const patient = [data.people.elderly, ...data.people.otherPatients].find(person => person.id === item.elderlyId); return <Card key={item.id} title={`${item.title} · ${patient?.name || 'Pessoa não informada'}`} detail={`${alertOrigins[item.origin] || item.origin} · ${alertStatuses[item.status] || item.status}\n${formatDate(item.date)} · ${item.reviewedAt ? 'Avaliado' : 'Aguardando avaliação'}`} icon="notifications-outline" onPress={() => router.push({ pathname: '/(profissional)/alerta/[id]', params: { id: item.id } })} />; };
  return <Screen eyebrow="Enfermeira Camila" title="Alertas" subtitle="Avaliação administrativa simulada, independente do atendimento familiar."><SectionHeader>Aguardando avaliação</SectionHeader>{pending.length ? pending.map(render) : <Note>Nenhum alerta aguardando avaliação.</Note>}<SectionHeader>Avaliados</SectionHeader>{reviewed.length ? reviewed.map(render) : <Note>Nenhum alerta avaliado.</Note>}{storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}</Screen>;
}
export function ProfessionalAlertDetail() {
  const { id } = useLocalSearchParams();
  const { data, addAlertNote, reviewAlert, storageError } = useDemo();
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  const alert = data.alerts.find(item => item.id === id);
  useEffect(() => { lock.current = false; }, [alert?.history.length]);
  if (!alert) return <Screen eyebrow="Enfermeira Camila" title="Alerta não encontrado"><Note>Registro indisponível nesta demonstração.</Note></Screen>;
  function record(kind) {
    if (lock.current) return;
    const text = note.trim();
    if (!text) { setMessage('Informe uma observação fictícia antes de registrar.'); return; }
    lock.current = true;
    if (kind === 'avaliacao') reviewAlert(alert.id, text, actor);
    else addAlertNote(alert.id, `${kind === 'contato' ? 'Contato registrado' : 'Providência registrada'} (simulação): ${text}`, actor, kind);
    setNote(''); setMessage(kind === 'avaliacao' ? 'Alerta marcado como avaliado.' : 'Registro fictício adicionado ao histórico.');
  }
  return <Screen eyebrow="Enfermeira Camila" title={alert.title} subtitle="Alerta fictício neste aparelho."><Panel><Text className="text-primary text-lg font-bold">Atendimento: {alertStatuses[alert.status] || alert.status}</Text><Text className="text-ink text-base leading-6 mt-2">Revisão: {alert.reviewedAt ? `Avaliado em ${formatDate(alert.reviewedAt)} · ${alert.reviewedBy}` : 'Aguardando avaliação'}{'\n'}Origem: {alertOrigins[alert.origin] || alert.origin}{'\n'}Motivo: {alert.reason}{'\n'}Registrado em: {formatDate(alert.date)}</Text></Panel>
    <SectionHeader>Registro profissional fictício</SectionHeader><Panel><Text className="text-ink text-base mb-2">Observação</Text><TextInput accessibilityLabel="Observação profissional fictícia" value={note} onChangeText={setNote} multiline maxLength={500} placeholder="Descreva o registro simulado" placeholderTextColor="#697A71" style={{ borderWidth: 1, borderColor: '#A7B8AE', borderRadius: 14, padding: 14, minHeight: 100, textAlignVertical: 'top', fontSize: 17, color: '#25312D' }} /><Text className="text-[#596A62] text-sm mt-2 mb-4">O registro de contato é apenas uma anotação; não faz ligação nem envia mensagem.</Text><PrimaryButton title="Registrar contato" secondary onPress={() => record('contato')} /><View className="mt-3"><PrimaryButton title="Registrar providência" secondary onPress={() => record('providencia')} /></View>{!alert.reviewedAt && <View className="mt-3"><PrimaryButton title="Marcar como avaliado" onPress={() => record('avaliacao')} /></View>}</Panel>
    {message ? <Text accessibilityLiveRegion="polite" className="text-ink text-base">{message}</Text> : null}
    <SectionHeader>Linha do tempo compartilhada</SectionHeader><Panel>{alert.history.map(entry => <View key={entry.id} className="mb-4"><Text className="text-ink text-base font-bold">{formatDate(entry.date)}{entry.actor ? ` · ${entry.actor}` : ''}</Text><Text className="text-[#596A62] text-base leading-6 mt-1">{entry.text}</Text></View>)}</Panel>
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}<Note>A avaliação é administrativa e simulada; não altera o status do atendimento.</Note>
  </Screen>;
}
