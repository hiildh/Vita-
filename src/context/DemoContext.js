import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { createDemoData } from '../mocks/demo';
import { loadDemo, saveDemo } from '../services/storage';
import { alertStatuses, makeAlert, uniqueId } from '../utils/alerts';
const Context = createContext(null);
function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': return action.data;
    case 'RESET_DEMO': return createDemoData();
    case 'SET_MEDICATION_STATUS': return { ...state, medicationRecords: [...state.medicationRecords.filter(item => item.key !== action.record.key), action.record] };
    case 'ADD_MEASUREMENT': return { ...state, measurements: [action.measurement, ...state.measurements] };
    case 'ADD_SYMPTOM': return { ...state, symptoms: [action.symptom, ...state.symptoms] };
    case 'CREATE_ALERT': return { ...state, alerts: [action.alert, ...state.alerts] };
    case 'CHANGE_ALERT_STATUS': return { ...state, alerts: state.alerts.map(item => item.id === action.id && item.status !== action.status ? { ...item, status: action.status, history: [...item.history, action.entry] } : item) };
    case 'ADD_ALERT_NOTE': return { ...state, alerts: state.alerts.map(item => item.id === action.id ? { ...item, history: [...item.history, action.entry] } : item) };
    case 'REVIEW_ALERT': return { ...state, alerts: state.alerts.map(item => item.id === action.id && !item.reviewedAt ? { ...item, reviewedAt: action.entry.date, reviewedBy: action.entry.actor, history: [...item.history, action.entry] } : item) };
    case 'COMPLETE_VISIT': return { ...state, appointments: state.appointments.map(item => item.id === action.id && item.kind === 'visita' && item.status !== 'realizada' ? { ...item, status: 'realizada', completedAt: action.date, completedBy: action.actor, completionNote: action.note } : item) };
    case 'SIMULATE_SENSOR': return { ...state, sensors: state.sensors.map(item => item.id === action.event.sensorId ? { ...item, status: action.event.status, lastActivity: action.event.reason, updatedAt: action.event.date } : item), sensorEvents: [action.event, ...state.sensorEvents], alerts: action.alert ? [action.alert, ...state.alerts] : state.alerts };
    default: return state;
  }
}
export function DemoProvider({ children }) {
  const [data, dispatch] = useReducer(reducer, undefined, createDemoData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [storageReadError, setStorageReadError] = useState(false);
  const queue = useRef(Promise.resolve());
  const readFailed = useRef(false);
  useEffect(() => { let active = true; loadDemo().then(saved => { if (active && saved) dispatch({ type: 'HYDRATE', data: saved }); }).catch(() => { if (active) { readFailed.current = true; setStorageReadError(true); setStorageError(true); } }).finally(() => { if (active) setReady(true); }); return () => { active = false; }; }, []);
  useEffect(() => { if (!ready || readFailed.current) return; queue.current = queue.current.catch(() => {}).then(() => saveDemo(data)).then(() => setStorageError(false)).catch(() => setStorageError(true)); }, [data, ready]);
  const setMedicationStatus = (occurrence, status) => dispatch({ type: 'SET_MEDICATION_STATUS', record: { key: occurrence.key, medicationId: occurrence.medicationId, date: occurrence.date, time: occurrence.time, dose: occurrence.dose || occurrence.medication.dose, status, actedAt: new Date().toISOString() } });
  const addMeasurement = measurement => { const recordedAt = new Date().toISOString(); dispatch({ type: 'ADD_MEASUREMENT', measurement: { ...measurement, id: `measurement-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, recordedAt } }); };
  const addSymptom = symptom => { const recordedAt = new Date().toISOString(); dispatch({ type: 'ADD_SYMPTOM', symptom: { ...symptom, id: `symptom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, recordedAt } }); };
  const createAlert = ({ elderlyId, origin, reason }) => { const alert = makeAlert({ elderlyId, origin, reason }); dispatch({ type: 'CREATE_ALERT', alert }); return alert.id; };
  const changeAlertStatus = (id, status, actor = 'Demonstração') => { if (!alertStatuses[status]) return; const date = new Date().toISOString(); dispatch({ type: 'CHANGE_ALERT_STATUS', id, status, entry: { id: uniqueId('history'), type: 'status', date, text: `Status alterado para ${alertStatuses[status].toLowerCase()}.`, actor } }); };
  const addAlertNote = (id, text, actor = 'Demonstração', type = 'observacao') => { const note = text.trim(); if (!note) return; dispatch({ type: 'ADD_ALERT_NOTE', id, entry: { id: uniqueId('history'), type, date: new Date().toISOString(), text: note, actor } }); };
  const reviewAlert = (id, note, actor = 'Enfermeira Camila (profissional)') => { const text = note.trim(); if (!text) return; dispatch({ type: 'REVIEW_ALERT', id, entry: { id: uniqueId('history'), type: 'avaliacao', date: new Date().toISOString(), text: `Avaliado (revisão administrativa): ${text}`, actor } }); };
  const completeVisit = (id, note, actor = 'Enfermeira Camila (profissional)') => { const text = note.trim(); if (!text) return; dispatch({ type: 'COMPLETE_VISIT', id, date: new Date().toISOString(), note: text, actor }); };
  const simulateSensor = kind => {
    const options = { movement: { sensorId: 'sensor-motion', reason: 'Movimento detectado', status: 'Movimento detectado (simulado)' }, door: { sensorId: 'sensor-door', reason: 'Porta aberta', status: 'Aberta (simulação)' }, absence: { sensorId: 'sensor-motion', reason: 'Ausência prolongada de atividade simulada', status: 'Ausência prolongada de atividade (simulação)' } };
    const selected = options[kind]; if (!selected) return;
    const date = new Date().toISOString();
    const event = { ...selected, id: uniqueId('sensor-event'), elderlyId: data.people.elderly.id, origin: 'sensor', date };
    const alert = kind === 'absence' ? makeAlert({ elderlyId: event.elderlyId, origin: 'sensor', reason: 'Verificar ausência prolongada de atividade simulada.', date }) : null;
    dispatch({ type: 'SIMULATE_SENSOR', event: { ...event, alertId: alert?.id || null }, alert });
  };
  return <Context.Provider value={{ data, ready, storageError, storageReadError, setMedicationStatus, addMeasurement, addSymptom, createAlert, changeAlertStatus, addAlertNote, reviewAlert, completeVisit, simulateSensor, resetDemo: () => { readFailed.current = false; setStorageReadError(false); dispatch({ type: 'RESET_DEMO' }); } }}>{children}</Context.Provider>;
}
export function useDemo() { const context = useContext(Context); if (!context) throw new Error('useDemo requer DemoProvider'); return context; }
