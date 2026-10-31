const statusMap = { pending: 'pendente', resolved: 'resolvido', in_progress: 'em_atendimento' };
export const alertStatuses = { pendente: 'Pendente', em_atendimento: 'Em atendimento', resolvido: 'Resolvido' };
export const alertOrigins = { pedido_de_ajuda: 'Pedido de ajuda', sensor: 'Sensor simulado', historico: 'Histórico de demonstração' };
export function normalizeAlert(alert, elderlyId) {
  const status = statusMap[alert.status] || alert.status || 'resolvido';
  const origin = alert.origin || 'historico';
  const reason = alert.reason || alert.detail || alert.title;
  return { ...alert, elderlyId: alert.elderlyId || elderlyId, origin, reason, status, history: Array.isArray(alert.history) ? alert.history : [{ id: `${alert.id}-initial`, type: 'criacao', date: alert.date, text: `Registro inicial: ${alertStatuses[status] || status}.` }] };
}
let sequence = 0;
export function uniqueId(prefix) { sequence += 1; return `${prefix}-${Date.now()}-${sequence}-${Math.random().toString(36).slice(2, 10)}`; }
export function makeAlert({ elderlyId, origin, reason, date = new Date().toISOString() }) {
  const id = uniqueId('alert');
  const title = origin === 'pedido_de_ajuda' ? 'Pedido de ajuda' : origin === 'sensor' ? 'Verificação da residência' : 'Alerta de demonstração';
  return { id, elderlyId, origin, reason, title, detail: reason, date, status: 'pendente', history: [{ id: uniqueId('history'), type: 'criacao', date, text: 'Alerta registrado como pendente.' }] };
}
