import React from 'react';
import { Text } from 'react-native';
import { Screen, Note } from './Screen';
import { Panel, SectionHeader, StatusBadge } from './ElderUI';
import MedicationCard from './MedicationCard';
import { useDemo } from '../context/DemoContext';
import { formatDate, formatDay } from '../utils/date';
import { dailyOccurrences } from '../utils/medications';
import { useCurrentTime } from '../utils/useCurrentTime';

export default function ElderMedications() {
  const { data, setMedicationStatus, storageError } = useDemo();
  const now = useCurrentTime();
  const occurrences = dailyOccurrences(data, now);
  const records = [...data.medicationRecords].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  return <Screen eyebrow="Dona Maria" title="Medicamentos" subtitle="Registros fictícios organizados por horário.">
    <SectionHeader>Hoje</SectionHeader>
    {occurrences.length ? occurrences.map(item => <MedicationCard key={item.key} occurrence={item} onMark={setMedicationStatus} />) : <Note>Nenhum medicamento cadastrado para hoje.</Note>}
    <SectionHeader>Histórico</SectionHeader>
    {records.length ? records.map(record => { const medication = data.medications.find(item => item.id === record.medicationId); return <Panel key={record.key}><StatusBadge status={record.status} /><Text className="text-ink text-lg font-bold mt-2">{medication?.name || 'Medicamento'}</Text><Text className="text-[#596A62] text-base leading-6 mt-1">{formatDay(record.date)} · horário prescrito: {record.time}{'\n'}Registro: {formatDate(record.actedAt)}</Text></Panel>; }) : <Note>Ainda não há registros de medicamentos.</Note>}
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}<Note>Para corrigir uma marcação, selecione a outra opção na ocorrência. O histórico mostra o registro atual de cada horário.</Note>
  </Screen>;
}
