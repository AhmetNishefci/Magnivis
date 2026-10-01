/** Longitude proof uses a north-pole view: positive east is counterclockwise. */
export const eastLongitudePoint = (degrees: number, radius: number, center = {x:360,y:340}) => ({
  x:center.x - radius * Math.sin(degrees*Math.PI/180),
  y:center.y - radius * Math.cos(degrees*Math.PI/180),
});
export const eastLongitudeDegrees = (localHours: number, referenceHours: number) => (localHours-referenceHours)*15;
export const longitudeArc = (degrees: number, radius: number) => {
  const start=eastLongitudePoint(0,radius),end=eastLongitudePoint(degrees,radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${Math.abs(degrees)>180?1:0} ${degrees>=0?0:1} ${end.x} ${end.y}`;
};
