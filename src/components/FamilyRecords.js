import React from 'react';
import { Card, Note, Screen } from './Screen';
import { SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate, formatDay } from '../utils/date';
import { dailyOccurrences } from '../utils/medications';
import { useCurrentTime } from '../utils/useCurrentTime';

export function FamilyMedications() {
  const { data } = useDemo();
  const now = useCurrentTime();
  const occurrences = dailyOccurrences(data, now);
  const missed = data.medicationRecords.filter(item => item.status === 'missed').sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  return <Screen eyebrow="Ana · familiar" title="Medicamentos" subtitle="Consulta dos registros fictícios de Dona Maria, somente leitura.">
    <SectionHeader>Hoje</SectionHeader>
    {occurrences.length ? occurrences.map(item => <Card key={item.key} title={`${item.time} · ${item.medication.name}`} detail={`${item.medication.dose} · ${{ confirmed: 'Confirmado', pending: 'Pendente', missed: 'Não tomado' }[item.status]}`} icon="medkit-outline" />) : <Note>Nenhum medicamento cadastrado para hoje.</Note>}
    <SectionHeader>Registros de “Não tomei”</SectionHeader>
    {missed.length ? missed.map(item => { const medication = data.medications.find(med => med.id === item.medicationId); return <Card key={item.key} title={medication?.name || 'Medicamento'} detail={`${formatDay(item.date)} · ${item.time}\nDose: ${item.dose || medication?.dose || 'não informada'}${item.dose ? '' : ' (cadastro atual)'}\nRegistrado em ${formatDate(item.actedAt)}`} icon="alert-circle-outline" />; }) : <Note>Nenhum registro de medicamento não tomado.</Note>}
  </Screen>;
}
export function FamilyHealth() {
  const { data } = useDemo();
  const measurements = [...data.measurements].sort((a, b) => (b.recordedAt || '').localeCompare(a.recordedAt || ''));
  const symptoms = [...data.symptoms].sort((a, b) => (b.recordedAt || '').localeCompare(a.recordedAt || ''));
  return <Screen eyebrow="Ana · familiar" title="Saúde" subtitle="Histórico fictício informado por pessoas. Sem interpretação clínica automática.">
    <SectionHeader>Medições</SectionHeader>{measurements.length ? measurements.map(item => <Card key={item.id} title={`${item.type}: ${item.value} ${item.unit}`} detail={`${item.recordedAt ? formatDate(item.recordedAt) : 'Data não informada'} · Realizada por: ${item.performedBy}`} icon="pulse-outline" />) : <Note>Nenhuma medição registrada.</Note>}
    <SectionHeader>Sintomas e relatos</SectionHeader>{symptoms.length ? symptoms.map(item => <Card key={item.id} title={item.text} detail={`${item.recordedAt ? formatDate(item.recordedAt) : 'Data não informada'} · Registrado por: ${item.performedBy}`} icon="chatbubble-outline" />) : <Note>Nenhum relato registrado.</Note>}
  </Screen>;
}
export function FamilyResidence() {
  const { data } = useDemo();
  const events = [...data.sensorEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
  return <Screen eyebrow="Ana · familiar" title="Residência simulada" subtitle="Acompanhamento local dos mesmos sensores fictícios do perfil idoso.">
    <Note>A ausência de movimento ou a abertura de uma porta, isoladamente, não confirma uma emergência. Sensores e eventos desta demonstração são simulados.</Note>
    <SectionHeader>Sensores</SectionHeader>{data.sensors.map(item => <Card key={item.id} title={item.name} detail={`${item.status}\nÚltima atividade: ${item.lastActivity}\nAtualização: ${item.updatedAt ? formatDate(item.updatedAt) : 'não informada'}`} icon="radio-outline" />)}
    <SectionHeader>Eventos simulados</SectionHeader>{events.length ? events.map(item => <Card key={item.id} title={item.reason} detail={`${formatDate(item.date)}${item.alertId ? ' · Alerta de verificação criado' : ''}`} icon="time-outline" />) : <Note>Nenhum evento simulado registrado.</Note>}
  </Screen>;
}
export function FamilyAgenda() {
  const { data } = useDemo();
  const now = useCurrentTime();
  const appointments = data.appointments.filter(item => item.patientId === data.people.elderly.id && item.status !== 'realizada' && new Date(item.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  return <Screen eyebrow="Ana · familiar" title="Agenda" subtitle="Próximas consultas e visitas fictícias."><SectionHeader>Próximos compromissos</SectionHeader>{appointments.length ? appointments.map(item => <Card key={item.id} title={item.title} detail={`${formatDate(item.date)}\n${item.professional} · ${item.detail}`} icon="calendar-outline" />) : <Note>Nenhum compromisso futuro cadastrado.</Note>}</Screen>;
}
