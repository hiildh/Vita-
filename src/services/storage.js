import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrateDemo } from '../utils/migrateDemo';
const KEY = '@vita-plus/demo-v1';
export async function loadDemo() { const raw = await AsyncStorage.getItem(KEY); if (!raw) return null; const data = JSON.parse(raw); if (!(data && data.people && data.people.elderly && Array.isArray(data.medications) && Array.isArray(data.measurements) && Array.isArray(data.appointments) && Array.isArray(data.sensors) && Array.isArray(data.alerts))) throw new Error('Dados locais inválidos'); return migrateDemo(data); }
export function saveDemo(data) { return AsyncStorage.setItem(KEY, JSON.stringify(data)); }
