import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { Panel, PrimaryButton, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { useCurrentTime } from '../utils/useCurrentTime';
import { formatDate } from '../utils/date';

function patientName(data, id) { return [data.people.elderly, ...data.people.otherPatients].find(item => item.id === id)?.name || 'Pessoa não informada'; }
export function ProfessionalAgenda() {
  const { data, storageError } = useDemo();
  const now = useCurrentTime();
  const future = data.appointments.filter(item => item.status === 'agendada' && new Date(item.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = data.appointments.filter(item => item.status === 'realizada').sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const render = item => <Card key={item.id} title={`${item.title} · ${patientName(data, item.patientId)}`} detail={`${formatDate(item.date)} · ${item.professional}\n${item.detail} · ${item.status === 'realizada' ? 'Realizada' : 'Agendada'}`} icon="calendar-outline" onPress={() => router.push({ pathname: '/(profissional)/visita/[id]', params: { id: item.id } })} />;
  return <Screen eyebrow="Enfermeira Camila" title="Agenda" subtitle="Consultas e visitas fictícias de acompanhamento."><SectionHeader>Próximos compromissos</SectionHeader>{future.length ? future.map(render) : <Note>Nenhum compromisso futuro agendado.</Note>}<SectionHeader>Visitas realizadas</SectionHeader>{completed.length ? completed.map(render) : <Note>Nenhuma visita marcada como realizada.</Note>}{storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}</Screen>;
}
export function ProfessionalVisitDetail() {
  const { id } = useLocalSearchParams();
  const { data, completeVisit, storageError } = useDemo();
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  const item = data.appointments.find(entry => entry.id === id);
  useEffect(() => { lock.current = false; }, [item?.status]);
  if (!item) return <Screen eyebrow="Enfermeira Camila" title="Compromisso não encontrado"><Note>Registro indisponível nesta demonstração.</Note></Screen>;
  function complete() { if (lock.current) return; if (!note.trim()) { setMessage('Informe uma observação fictícia.'); return; } lock.current = true; completeVisit(item.id, note); setNote(''); setMessage('Visita simulada marcada como realizada.'); }
  return <Screen eyebrow="Enfermeira Camila" title={item.title} subtitle="Compromisso fictício neste aparelho."><Panel><Text className="text-ink text-base leading-6">{patientName(data, item.patientId)}{'\n'}{formatDate(item.date)} · {item.professional}{'\n'}{item.detail}{'\n'}Situação: {item.status === 'realizada' ? 'Realizada' : 'Agendada'}</Text>{item.completedAt && <Text className="text-ink text-base leading-6 mt-3">Registrada em {formatDate(item.completedAt)} · {item.completedBy}{'\n'}Observação: {item.completionNote}</Text>}</Panel>
    {item.kind === 'visita' && item.status === 'agendada' && <><SectionHeader>Registrar visita simulada</SectionHeader><Panel><Text className="text-ink text-base mb-2">Observação fictícia</Text><TextInput accessibilityLabel="Observação da visita simulada" value={note} onChangeText={setNote} multiline maxLength={500} placeholder="Descreva a visita simulada" placeholderTextColor="#697A71" style={{ borderWidth: 1, borderColor: '#A7B8AE', borderRadius: 14, padding: 14, minHeight: 100, textAlignVertical: 'top', fontSize: 17, color: '#25312D' }} /><Text className="text-[#596A62] text-sm mt-2 mb-4">A marcação é manual, inclusive para visitas agendadas para uma data futura.</Text><PrimaryButton title="Marcar visita como realizada" onPress={complete} /></Panel></>}
    {message ? <Text accessibilityLiveRegion="polite" className="text-ink text-base">{message}</Text> : null}{storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}</Screen>;
}
