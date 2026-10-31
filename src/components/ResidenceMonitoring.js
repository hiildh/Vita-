import React from 'react';
import { Text, View } from 'react-native';
import { Screen, Note } from './Screen';
import { Panel, PrimaryButton, SectionHeader } from './ElderUI';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { Ionicons } from '@expo/vector-icons';

export default function ResidenceMonitoring() {
  const { data, simulateSensor, storageError } = useDemo();
  return <Screen eyebrow="Demonstração local" title="Monitoramento da residência" subtitle="Sensores e atividades fictícios, controlados nesta tela.">
    <Panel tone="peach"><View className="flex-row items-start"><Ionicons name="information-circle-outline" size={23} color="#24584B" /><Text className="text-ink text-base leading-6 flex-1 ml-3">A ausência de movimento ou a abertura de uma porta, isoladamente, não confirma uma emergência. Sensores e eventos desta demonstração são simulados.</Text></View></Panel>
    <SectionHeader>Sensores simulados</SectionHeader>
    {data.sensors.map(sensor => <Panel key={sensor.id}><View className="flex-row items-center"><View className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${sensor.id === 'sensor-door' ? 'bg-peach' : 'bg-sage'}`}><Ionicons name={sensor.id === 'sensor-door' ? 'home-outline' : 'walk-outline'} size={24} color="#24584B" /></View><Text className="text-ink text-xl font-bold flex-1">{sensor.name}</Text></View><Text className="text-ink text-lg font-bold mt-3">{sensor.status}</Text><Text className="text-muted text-base leading-6 mt-2">Última atividade: {sensor.lastActivity}{'\n'}Última atualização: {sensor.updatedAt ? formatDate(sensor.updatedAt) : 'não informada'}</Text></Panel>)}
    <SectionHeader>Controles de demonstração</SectionHeader>
    <View className="mb-3"><PrimaryButton variant="soft" icon="walk-outline" title="Simular movimento detectado" onPress={() => simulateSensor('movement')} /></View>
    <View className="mb-3"><PrimaryButton secondary title="Simular porta aberta" onPress={() => simulateSensor('door')} /></View>
    <View className="mb-3"><PrimaryButton secondary title="Simular ausência prolongada de atividade" onPress={() => simulateSensor('absence')} /></View>
    <Note>A ausência simulada cria um alerta de verificação. Os eventos ficam no histórico de Alertas neste aparelho.</Note>
    {storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}
  </Screen>;
}
