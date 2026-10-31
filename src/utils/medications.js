import { localDateKey } from './date';
export function dailyOccurrences(data, date = new Date()) {
  const day = localDateKey(date);
  return data.medications.flatMap(medication => (medication.times || [medication.time]).filter(Boolean).map(time => {
    const key = `${medication.id}|${day}|${time}`;
    return { key, medicationId: medication.id, date: day, time, medication, ...(data.medicationRecords.find(record => record.key === key) || { status: 'pending' }) };
  })).sort((a, b) => a.time.localeCompare(b.time) || a.medication.name.localeCompare(b.medication.name));
}
