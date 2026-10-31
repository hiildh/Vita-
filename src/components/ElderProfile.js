import React from 'react';
import { Alert } from 'react-native';
import { useProfileNavigation } from '../utils/useProfileNavigation';
import { Card, Note, Screen } from './Screen';
import { useDemo } from '../context/DemoContext';
export default function ElderProfile() {
  const { data, resetDemo, storageError } = useDemo();
  const { showProfileSelection } = useProfileNavigation();
  return <Screen eyebrow="VITA+" title="Meu perfil" subtitle="Modo demonstração — sem dados reais"><Card title={data.people.elderly.name} detail={`${data.people.elderly.age} anos · perfil fictício`} icon="person-outline" /><Card title="Familiar" detail={`${data.people.family.name}, ${data.people.family.relationship}`} icon="people-outline" /><Card title="Trocar perfil" detail="Voltar à seleção sem apagar os dados" icon="swap-horizontal-outline" onPress={showProfileSelection} /><Card title="Restaurar demonstração" detail="Recriar os dados fictícios nesta instalação" icon="refresh-outline" onPress={() => Alert.alert('Restaurar demonstração?', 'Os dados locais serão substituídos pelos dados iniciais.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Restaurar', onPress: resetDemo }])} />{storageError && <Note>Não foi possível salvar os dados no dispositivo.</Note>}</Screen>;
}
