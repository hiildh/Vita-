export const additionalPatients = [
  { id: 'person-joao', name: 'Seu João', summary: 'Acompanhamento fictício simplificado.' },
  { id: 'person-lucia', name: 'Dona Lúcia', summary: 'Acompanhamento fictício simplificado.' },
];
export function createAdditionalAppointments() {
  function upcoming(days, hour) { const date = new Date(); date.setDate(date.getDate() + days); date.setHours(hour, 0, 0, 0); return date.toISOString(); }
  return [
    { id: 'appointment-joao', patientId: 'person-joao', title: 'Visita domiciliar', date: upcoming(4, 10), detail: 'Residência fictícia', professional: 'Enfermeira Camila', kind: 'visita', status: 'agendada' },
    { id: 'appointment-lucia', patientId: 'person-lucia', title: 'Visita domiciliar', date: upcoming(6, 15), detail: 'Residência fictícia', professional: 'Enfermeira Camila', kind: 'visita', status: 'agendada' },
  ];
}
