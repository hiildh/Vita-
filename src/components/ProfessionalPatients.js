import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { useCurrentTime } from '../utils/useCurrentTime';
import { dailyOccurrences } from '../utils/medications';
import { formatDate } from '../utils/date';
import { alertStatuses } from '../utils/alerts';

function nextVisit(data, patientId, now) { return data.appointments.filter(item => item.patientId === patientId && item.kind === 'visita' && item.status === 'agendada' && new Date(item.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date))[0]; }
function patientAlerts(data, patientId) { return data.alerts.filter(item => item.elderlyId === patientId && item.status !== 'resolvido'); }
export function ProfessionalPatients() {
  const { data } = useDemo();
  const now = useCurrentTime();
  const people = [data.people.elderly, ...data.people.otherPatients];
  return <Screen eyebrow="Enfermeira Camila" title="Pessoas acompanhadas" subtitle="Painel local com dados inteiramente fictícios.">
    {people.map(person => { const visit = nextVisit(data, person.id, now); const open = patientAlerts(data, person.id).length; const missing = person.id === data.people.elderly.id ? dailyOccurrences(data, now).filter(item => item.status !== 'confirmed').length : 0; return <Card key={person.id} title={person.name} detail={`${open} alerta(s) em aberto${person.id === data.people.elderly.id ? ` · ${missing} horário(s) de medicamento pendente(s) ou não tomado(s)` : ''}\nPróxima visita: ${visit ? formatDate(visit.date) : 'não agendada'}`} icon="person-outline" onPress={() => router.push({ pathname: '/(profissional)/paciente/[id]', params: { id: person.id } })} />; })}
    <Note>As pendências exibidas são administrativas e simuladas; não representam avaliação clínica.</Note>
  </Screen>;
}
export function ProfessionalPatientDetail() {
  const { id } = useLocalSearchParams();
  const { data } = useDemo();
  const now = useCurrentTime();
  const person = [data.people.elderly, ...data.people.otherPatients].find(item => item.id === id);
  if (!person) return <Screen eyebrow="Enfermeira Camila" title="Pessoa não encontrada"><Note>Não há cadastro fictício com este identificador.</Note></Screen>;
  const isMaria = person.id === data.people.elderly.id;
  const appointments = data.appointments.filter(item => item.patientId === person.id).sort((a, b) => new Date(a.date) - new Date(b.date));
  const alerts = data.alerts.filter(item => item.elderlyId === person.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  return <Screen eyebrow="Enfermeira Camila" title={person.name} subtitle="Dados fictícios locais · acompanhamento de demonstração">
    {!isMaria && <Note>{person.summary} Informações de medicamentos e saúde não foram cadastradas para este exemplo.</Note>}
    <SectionHeader>Agenda</SectionHeader>{appointments.length ? appointments.map(item => <Card key={item.id} title={item.title} detail={`${formatDate(item.date)} · ${item.professional}\n${item.detail} · ${item.status === 'realizada' ? 'Realizada' : 'Agendada'}`} icon="calendar-outline" onPress={() => router.push({ pathname: '/(profissional)/visita/[id]', params: { id: item.id } })} />) : <Note>Nenhum compromisso registrado.</Note>}
    {isMaria && <><SectionHeader>Medicamentos de hoje</SectionHeader>{dailyOccurrences(data, now).map(item => <Card key={item.key} title={`${item.medication.name} · ${item.time}`} detail={`${item.medication.dose} · ${{ pending: 'Pendente', confirmed: 'Confirmado', missed: 'Não tomado' }[item.status]}`} icon="medkit-outline" />)}
    <SectionHeader>Medições informadas</SectionHeader>{data.measurements.length ? data.measurements.map(item => <Card key={item.id} title={`${item.type}: ${item.value} ${item.unit}`} detail={`${item.recordedAt ? formatDate(item.recordedAt) : 'Data não informada'} · ${item.performedBy}`} icon="pulse-outline" />) : <Note>Nenhuma medição registrada.</Note>}
    <SectionHeader>Sintomas e relatos</SectionHeader>{data.symptoms.length ? data.symptoms.map(item => <Card key={item.id} title={item.text} detail={`${item.recordedAt ? formatDate(item.recordedAt) : 'Data não informada'} · ${item.performedBy}`} icon="chatbubble-outline" />) : <Note>Nenhum relato registrado.</Note>}</>}
    <SectionHeader>Alertas</SectionHeader>{alerts.length ? alerts.map(item => <Card key={item.id} title={item.title} detail={`${item.reason} · ${alertStatuses[item.status] || item.status}`} icon="notifications-outline" onPress={() => router.push({ pathname: '/(profissional)/alerta/[id]', params: { id: item.id } })} />) : <Note>Nenhum alerta registrado.</Note>}
    <Note>Informações simuladas; não constituem prontuário ou avaliação clínica.</Note>
  </Screen>;
}
