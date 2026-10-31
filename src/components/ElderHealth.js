import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Card, Note, Screen } from './Screen';
import { Panel, PrimaryButton, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';

const types = [{ name: 'Pressão arterial', unit: 'mmHg', placeholder: 'Ex.: 120/80' }, { name: 'Glicemia', unit: 'mg/dL', placeholder: 'Ex.: 95' }, { name: 'Temperatura', unit: '°C', placeholder: 'Ex.: 36,5' }];
const people = ['Dona Maria', 'Ana, filha', 'Enfermeira Camila'];
function Choices({ label, choices, value, onChange }) {
  return <View className="mb-4"><Text className="text-ink text-base font-bold mb-2">{label}</Text>{choices.map(choice => <View key={choice} className="mb-2"><PrimaryButton title={choice} secondary={value !== choice} selected={value === choice} onPress={() => onChange(choice)} /></View>)}</View>;
}
const inputStyle = { borderWidth: 1, borderColor: '#A7B8AE', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, minHeight: 54, color: '#25312D', fontSize: 18, backgroundColor: '#FFFFFF' };
export default function ElderHealth() {
  const { data, addMeasurement, addSymptom, storageError } = useDemo();
  const [type, setType] = useState(types[0].name);
  const [performer, setPerformer] = useState(people[0]);
  const [value, setValue] = useState('');
  const [symptom, setSymptom] = useState('');
  const [symptomPerformer, setSymptomPerformer] = useState(people[0]);
  const [measurementMessage, setMeasurementMessage] = useState('');
  const [symptomMessage, setSymptomMessage] = useState('');
  const selectedType = types.find(item => item.name === type);
  const measurements = [...data.measurements].sort((a, b) => (b.recordedAt || '').localeCompare(a.recordedAt || ''));
  const symptoms = [...data.symptoms].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
  function saveMeasurement() {
    const normalized = value.trim();
    const valid = type === 'Pressão arterial' ? /^\d{1,3}\s*\/\s*\d{1,3}$/.test(normalized) : /^\d{1,3}([,.]\d{1,2})?$/.test(normalized);
    if (!valid) { setMeasurementMessage(type === 'Pressão arterial' ? 'Informe o valor no formato 120/80.' : 'Informe um valor numérico, por exemplo 36,5.'); return; }
    addMeasurement({ type, value: normalized, unit: selectedType.unit, performedBy: performer }); setValue(''); setMeasurementMessage('Medição simulada registrada.');
  }
  function saveSymptom() {
    const text = symptom.trim();
    if (!text) { setSymptomMessage('Descreva o sintoma ou mal-estar.'); return; }
    addSymptom({ text, performedBy: symptomPerformer }); setSymptom(''); setSymptomMessage('Relato fictício registrado.');
  }
  return <Screen eyebrow="Dona Maria" title="Sua saúde" subtitle="Registros fictícios informados por pessoas; não são coletados pelos sensores da residência.">
    <SectionHeader>Últimos registros</SectionHeader>
    {types.map(item => { const latest = measurements.find(entry => entry.type === item.name); const icon = item.name === 'Pressão arterial' ? 'pulse-outline' : item.name === 'Glicemia' ? 'water-outline' : 'thermometer-outline'; return <Card key={item.name} title={item.name} detail={latest ? `${latest.value} ${latest.unit} · ${latest.recordedAt ? formatDate(latest.recordedAt) : 'data não informada'}` : 'Nenhum registro informado'} icon={icon} tone={item.name === 'Temperatura' ? 'peach' : 'sage'} />; })}
    <SectionHeader>Adicionar medição simulada</SectionHeader>
    <Panel><Choices label="Tipo de medição" choices={types.map(item => item.name)} value={type} onChange={setType} /><Text className="text-ink text-base font-bold mb-2">Valor ({selectedType.unit})</Text><TextInput accessibilityLabel={`Valor de ${type} em ${selectedType.unit}`} value={value} onChangeText={setValue} placeholder={selectedType.placeholder} placeholderTextColor="#697A71" keyboardType={type === 'Pressão arterial' ? 'default' : 'decimal-pad'} maxLength={20} style={inputStyle} /><View className="mt-4"><Choices label="Quem realizou?" choices={people} value={performer} onChange={setPerformer} /></View><Text className="text-[#596A62] text-base mb-4">Data e hora atuais serão registradas ao salvar.</Text><PrimaryButton title="Registrar medição" onPress={saveMeasurement} />{measurementMessage ? <Text accessibilityLiveRegion="polite" className="text-ink text-base mt-3">{measurementMessage}</Text> : null}</Panel>
    <SectionHeader>Histórico de medições</SectionHeader>
    {measurements.length ? measurements.map(item => <Card key={item.id} title={`${item.type}: ${item.value} ${item.unit}`} detail={`${item.recordedAt ? formatDate(item.recordedAt) : 'Data e hora não informadas'} · ${item.performedBy}`} icon="clipboard-outline" />) : <Note>Nenhuma medição registrada.</Note>}
    <SectionHeader>Registrar sintoma ou mal-estar</SectionHeader>
    <Panel><Text className="text-ink text-base font-bold mb-2">Relato fictício</Text><TextInput accessibilityLabel="Descrição do sintoma ou mal-estar" multiline value={symptom} onChangeText={setSymptom} placeholder="Descreva o que foi informado" placeholderTextColor="#697A71" maxLength={500} style={{ ...inputStyle, minHeight: 100, textAlignVertical: 'top' }} /><View className="mt-4"><Choices label="Quem registrou?" choices={people} value={symptomPerformer} onChange={setSymptomPerformer} /></View><PrimaryButton title="Registrar relato" onPress={saveSymptom} />{symptomMessage ? <Text accessibilityLiveRegion="polite" className="text-ink text-base mt-3">{symptomMessage}</Text> : null}</Panel>
    <SectionHeader>Histórico de relatos</SectionHeader>{symptoms.length ? symptoms.map(item => <Card key={item.id} title={item.text} detail={`${formatDate(item.recordedAt)} · ${item.performedBy}`} icon="chatbubble-outline" />) : <Note>Nenhum relato registrado.</Note>}
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}<Note>As informações são fictícias e não constituem avaliação clínica.</Note>
  </Screen>;
}
