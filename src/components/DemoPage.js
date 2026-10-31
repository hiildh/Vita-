import React from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Card, Note, Screen } from './Screen';
import { useDemo } from '../context/DemoContext';
import { formatDate } from '../utils/date';
import { useProfileNavigation } from '../utils/useProfileNavigation';

const roles = { idoso: 'Dona Maria', familiar: 'Ana, filha', profissional: 'Enfermeira Camila' };
export default function DemoPage({ role, page }) {
  const { data, resetDemo, storageError } = useDemo();
  const { showProfileSelection } = useProfileNavigation();
  const home = page === 'inicio' || page === 'visao' || page === 'pacientes';
  const titles = { inicio: 'Olá, Dona Maria', visao: 'Visão geral', pacientes: 'Pacientes', saude: 'Sua saúde', medicamentos: 'Medicamentos', alertas: 'Alertas', agenda: 'Agenda', perfil: 'Perfil', residencia: 'Residência' };
  const subtitles = { inicio: 'Um espaço para acompanhar seu cuidado com tranquilidade.', visao: 'Acompanhe o cuidado de Dona Maria.', pacientes: 'Pessoas acompanhadas nesta demonstração.', saude: 'Informações fictícias para acompanhar seu bem-estar.', medicamentos: 'Seus medicamentos de demonstração.', alertas: 'Histórico de alertas simulados.', agenda: 'Próximos compromissos fictícios.', perfil: 'Dados do perfil de demonstração.', residencia: 'Sensores apresentados apenas como simulação.' };
  const showAppointments = page === 'agenda';
  return <Screen eyebrow={roles[role]} title={titles[page]} subtitle={subtitles[page]}>
    {home && <><Card title="Dona Maria" detail="Acompanhamento de demonstração" icon="person-outline" />{role === 'idoso' && <Card title="Minha residência" detail="Ver sensores simulados" icon="home-outline" onPress={() => router.push('/(idoso)/residencia')} />}<Card title="Próximo compromisso" detail={`${data.appointments[0].title} · ${formatDate(data.appointments[0].date)}`} icon="calendar-outline" /></>}
    {page === 'saude' && <>{data.measurements.map(item => <Card key={item.id} title={item.type} detail={item.value} icon="pulse-outline" />)}<Card title="Residência" detail="Ver sensores simulados" icon="home-outline" onPress={() => router.push('/(idoso)/residencia')} /></>}
    {page === 'medicamentos' && data.medications.map(item => <Card key={item.id} title={item.name} detail={`${item.dose} · ${item.time}`} icon="medkit-outline" />)}
    {page === 'alertas' && data.alerts.map(item => <Card key={item.id} title={item.title} detail={`${item.detail} · ${formatDate(item.date)}`} icon="notifications-outline" />)}
    {showAppointments && data.appointments.map(item => <Card key={item.id} title={item.title} detail={`${formatDate(item.date)} · ${item.detail}`} icon="calendar-outline" />)}
    {page === 'residencia' && data.sensors.map(item => <Card key={item.id} title={item.name} detail={item.status} icon="radio-outline" />)}
    {page === 'perfil' && <><Card title={roles[role]} detail="Perfil de demonstração" icon="person-outline" /><Card title="Trocar perfil" detail="Voltar à seleção de perfis" icon="swap-horizontal-outline" onPress={showProfileSelection} /><Card title="Restaurar demonstração" detail="Recriar os dados fictícios nesta instalação" icon="refresh-outline" onPress={() => Alert.alert('Restaurar demonstração?', 'Os dados locais serão substituídos pelos dados iniciais.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Restaurar', onPress: resetDemo }])} /></>}
    {storageError && <Note>Não foi possível acessar o armazenamento local. Os dados podem não ser preservados ao fechar o app.</Note>}
    <Note>Modo demonstração — dados fictícios. As informações não substituem acompanhamento profissional.</Note>
  </Screen>;
}
