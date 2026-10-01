/** Original explanatory kinematics, not measured data or a calibrated traffic solver.
 * Cars move in the positive road coordinate. The slow phase migrates upstream.
 * Vehicle ordering is preserved analytically; changing phase changes cluster membership.
 */
export type TrafficParameters = {count: number; spacing: number; speed: number; period: number};
export const roadTraffic: TrafficParameters = {count: 18, spacing: 260, speed: 100, period: 31.2};
export const ringTraffic: TrafficParameters = {count: 22, spacing: 100, speed: 100, period: 11};
const tau = Math.PI * 2;
export const trafficLength = (p: TrafficParameters) => p.count * p.spacing;
export const amplitude = (p: TrafficParameters) => p.speed * p.period / tau;
export const growthEnvelope = (time: number, duration = 5) => {
  const s = Math.max(0, Math.min(1, time / duration));
  return {amount: s * s * (3 - 2 * s), derivative: s > 0 && s < 1 ? 6 * s * (1 - s) / duration : 0};
};
export const vehicleState = (id: number, time: number, p = roadTraffic, growth = {amount: 1, derivative: 0}) => {
  const phase = tau * (id / p.count + time / p.period);
  const position = id * p.spacing + p.speed * time + amplitude(p) * growth.amount * Math.sin(phase) - trafficLength(p) / 2;
  const speed = p.speed + amplitude(p) * (growth.derivative * Math.sin(phase) + growth.amount * tau / p.period * Math.cos(phase));
  return {id, position, speed, slow: speed < p.speed * 0.35};
};
export const congestionPosition = (time: number, p = roadTraffic) => (p.speed - trafficLength(p) / p.period) * time;
export const minimumSeparation = (p = roadTraffic) => p.spacing - 2 * amplitude(p) * Math.sin(Math.PI / p.count);
export const trafficPalette = ['#d5dedb', '#697f8d', '#c8bdae', '#303f4b', '#8eaca5', '#b7c8d4'];

// One imposed illustrative response sequence: amplification overall, with several
// weaker follower responses. It does not identify a real initiating driver.
const responseDepths = [8,14,12,28,24,46,41,50,43,48,44,50,45];
const erf = (x: number) => {
  const sign = x < 0 ? -1 : 1, a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
  return sign * (1 - (((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t)*Math.exp(-a*a));
};
export const mechanismVehicleState = (id: number, time: number) => {
  const depth = responseDepths[id] ?? 45, center = 0.55 + id * 0.48, sigma = 0.55;
  const slowdown = depth * Math.exp(-0.5 * ((time-center)/sigma)**2);
  const integral = depth * sigma * Math.sqrt(Math.PI/2) * (erf((time-center)/(Math.SQRT2*sigma))-erf(-center/(Math.SQRT2*sigma)));
  return {id,position:-id*100 + 60*time-integral,speed:60-slowdown,slow:slowdown>5};
};
