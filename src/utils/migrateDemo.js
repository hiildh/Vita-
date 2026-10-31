import { normalizeAlert } from './alerts';
import { additionalPatients, createAdditionalAppointments } from '../mocks/professional';
// Preserve stored values when upgrading installations created in the foundation step.
export function migrateDemo(data) {
  return { ...data,
    people: { ...data.people, elderly: { age: 72, ...data.people.elderly }, otherPatients: data.people.otherPatients || additionalPatients },
    medications: data.medications.map(item => ({ ...item, times: item.times || [item.time].filter(Boolean), instruction: item.instruction || 'Conforme prescrição fictícia.' })),
    medicationRecords: Array.isArray(data.medicationRecords) ? data.medicationRecords : [],
    measurements: data.measurements.map(item => {
      if (Object.prototype.hasOwnProperty.call(item, 'recordedAt')) return item;
      const match = String(item.value).match(/^(.*?)\s*(mmHg|mg\/dL|°C)$/);
      return { ...item, value: match ? match[1].trim() : item.value, unit: match ? match[2] : '', recordedAt: null, performedBy: 'Não informado' };
    }),
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
    appointments: [...data.appointments.map(item => ({ professional: item.id === 'appointment-2' ? 'Enfermeira Camila' : 'Profissional de saúde', patientId: data.people.elderly.id, kind: item.id === 'appointment-2' ? 'visita' : 'consulta', status: 'agendada', ...item })), ...(data.people.otherPatients ? [] : createAdditionalAppointments().filter(item => !data.appointments.some(existing => existing.id === item.id)))],
    sensors: data.sensors.map(item => ({ lastActivity: 'Nenhuma atividade informada', updatedAt: null, ...item })),
    sensorEvents: Array.isArray(data.sensorEvents) ? data.sensorEvents : [],
    alerts: data.alerts.map(item => normalizeAlert(item, data.people.elderly.id)),
  };
}
