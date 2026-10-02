/** Qualitative analytic fields, not calibrated Kirchhoff–Love plate modes. */
export const clamp=(value:number)=>Math.max(0,Math.min(1,value));
export const smooth=(value:number)=>{const x=clamp(value);return x*x*(3-2*x);};
export const modeField=(x:number,y:number,m:number,n:number)=>Math.cos(m*Math.PI*x)*Math.cos(n*Math.PI*y)-Math.cos(n*Math.PI*x)*Math.cos(m*Math.PI*y);
export const illustrationModes=[[1,2],[2,3],[3,4]] as const;
export const seeded=(index:number,salt=0)=>{const n=Math.sin(index*127.1+salt*311.7)*43758.5453;return n-Math.floor(n);};
export type Grain={x:number;y:number;targetX:number;targetY:number;size:number;phase:number};
export const grainsForMode=(m:number,n:number,count=1500):Grain[]=>{
 const nodes:{x:number;y:number}[]=[];
 // Root interpolation along each grid edge; avoids arbitrary visual pattern assets.
 const cells=110;
 for(let row=0;row<=cells;row++)for(let col=0;col<cells;col++){
  const y=-1+2*row/cells,x=-1+2*col/cells,nextX=x+2/cells;
  const a=modeField(x,y,m,n),b=modeField(nextX,y,m,n);
  if(a*b<0||Math.abs(a)<1e-10){const t=Math.abs(a)<1e-10?0:a/(a-b);nodes.push({x:x+(nextX-x)*t,y});}
 }
 if(!nodes.length)throw new Error('No nodal roots');
 return Array.from({length:count},(_,i)=>{
  const x=seeded(i,1)*1.96-.98,y=seeded(i,2)*1.96-.98;
  // Choose a nearby node from a bounded sample; animation is disclosed choreography.
  let target=nodes[0]!,distance=Infinity;
  for(let k=0;k<100;k++){const candidate=nodes[Math.floor(seeded(i*100+k,m+n)*nodes.length)]!;const d=(candidate.x-x)**2+(candidate.y-y)**2;if(d<distance){distance=d;target=candidate;}}
  return {x,y,targetX:target.x,targetY:target.y,size:1.1+seeded(i,3)*1.3,phase:seeded(i,4)*Math.PI*2};
 });
};
export const grainModes=illustrationModes.map(([m,n])=>grainsForMode(m,n));
/** One schematic cross-section, not a measured section of the overhead field. */
export const sectionDisplacement=(x:number,phase:number)=>Math.cos(2*Math.PI*x)*Math.sin(phase);
