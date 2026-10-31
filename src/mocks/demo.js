import { localDateKey } from '../utils/date';
import { normalizeAlert } from '../utils/alerts';
import { additionalPatients, createAdditionalAppointments } from './professional';
function relativeDate(days, hour) { const date = new Date(); date.setDate(date.getDate() + days); date.setHours(hour, 0, 0, 0); return date; }
export function createDemoData() {
  const yesterday = relativeDate(-1, 8);
  return {
    people: { elderly: { id: 'person-maria', name: 'Dona Maria', age: 72 }, family: { id: 'person-ana', name: 'Ana', relationship: 'filha' }, professional: { id: 'person-camila', name: 'Enfermeira Camila' }, otherPatients: additionalPatients },
    medications: [
      { id: 'med-1', name: 'Medicamento A', dose: '1 comprimido', time: '08:00', times: ['08:00'], instruction: 'Conforme prescrição fictícia.' },
      { id: 'med-2', name: 'Medicamento B', dose: '1 comprimido', time: '12:00', times: ['12:00', '18:00'], instruction: 'Conforme prescrição fictícia.' },
      { id: 'med-3', name: 'Medicamento C', dose: '2 gotas', time: '20:00', times: ['20:00'], instruction: 'Conforme prescrição fictícia.' },
    ],
    medicationRecords: [{ key: `med-1|${localDateKey(yesterday)}|08:00`, medicationId: 'med-1', date: localDateKey(yesterday), time: '08:00', status: 'confirmed', actedAt: yesterday.toISOString() }],
    measurements: [
      { id: 'measure-pressure', type: 'Pressão arterial', value: '120/80', unit: 'mmHg', recordedAt: relativeDate(-2, 9).toISOString(), performedBy: 'Dona Maria' },
      { id: 'measure-glucose', type: 'Glicemia', value: '95', unit: 'mg/dL', recordedAt: relativeDate(-1, 10).toISOString(), performedBy: 'Ana, filha' },
      { id: 'measure-temperature', type: 'Temperatura', value: '36,5', unit: '°C', recordedAt: relativeDate(-1, 14).toISOString(), performedBy: 'Enfermeira Camila' },
    ],
    symptoms: [{ id: 'symptom-initial', text: 'Mal-estar relatado em exemplo fictício.', recordedAt: relativeDate(-2, 15).toISOString(), performedBy: 'Dona Maria' }],
    appointments: [ { id: 'appointment-1', patientId: 'person-maria', kind: 'consulta', status: 'agendada', title: 'Consulta de rotina', date: relativeDate(3, 9).toISOString(), detail: 'Unidade de saúde', professional: 'Profissional de saúde' }, { id: 'appointment-2', patientId: 'person-maria', kind: 'visita', status: 'agendada', title: 'Visita de enfermagem', date: relativeDate(7, 14).toISOString(), detail: 'Residência', professional: 'Enfermeira Camila' }, ...createAdditionalAppointments() ],
    sensors: [ { id: 'sensor-motion', name: 'Presença / movimento', status: 'Movimento detectado (simulado)', lastActivity: 'Movimento detectado', updatedAt: relativeDate(-1, 9).toISOString() }, { id: 'sensor-door', name: 'Abertura de porta', status: 'Fechada (simulação)', lastActivity: 'Porta fechada', updatedAt: relativeDate(-1, 10).toISOString() } ],
    sensorEvents: [],
    alerts: [ { id: 'alert-1', title: 'Lembrete de medicamento', detail: 'Registro de demonstração', date: relativeDate(-1, 8).toISOString(), status: 'resolved' }, { id: 'alert-2', title: 'Visita registrada', detail: 'Histórico fictício', date: relativeDate(-2, 14).toISOString(), status: 'resolved' } ].map(item => normalizeAlert(item, 'person-maria')),
  };
}
