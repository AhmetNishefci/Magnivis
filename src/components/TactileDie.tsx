import React from 'react';
/** Original orthographic cube. Values attach permanently to six physical planes. */
export const DIE_FACES={yellow:[3,3,3,3,3,3],blue:[4,4,4,4,0,0],green:[1,1,1,5,5,5],orange:[2,2,2,2,6,6]} as const;
export type DieId=keyof typeof DIE_FACES;
export const DIE_COLORS={yellow:'#EDC643',blue:'#408ACD',green:'#6FA76A',orange:'#E38748'} as const;
export const DIE_TOPOLOGY={yellow:[3,3,3,3,3,3],blue:[4,0,4,0,4,4],green:[1,1,5,1,5,5],orange:[2,6,2,2,6,2]} as const;
type V=[number,number,number];
const planes:{n:V;u:V;v:V}[]=[{n:[1,0,0],u:[0,0,-1],v:[0,-1,0]},{n:[-1,0,0],u:[0,0,1],v:[0,-1,0]},{n:[0,1,0],u:[1,0,0],v:[0,0,1]},{n:[0,-1,0],u:[1,0,0],v:[0,0,-1]},{n:[0,0,1],u:[1,0,0],v:[0,-1,0]},{n:[0,0,-1],u:[-1,0,0],v:[0,-1,0]}];
export const TactileDie:React.FC<{id:DieId;x:number;y:number;size:number;turn?:number;label?:boolean;shownFace?:number|undefined}>=({id,x,y,size,turn=0,label=true,shownFace})=>{
 const a=.55,b=-.62+turn,c=-.07;
 const rotate=([x0,y0,z0]:V):V=>{const y1=y0*Math.cos(a)-z0*Math.sin(a),z1=y0*Math.sin(a)+z0*Math.cos(a),x2=x0*Math.cos(b)+z1*Math.sin(b),z2=-x0*Math.sin(b)+z1*Math.cos(b);return [x2*Math.cos(c)-y1*Math.sin(c),x2*Math.sin(c)+y1*Math.cos(c),z2];};
 const project=(p:V)=>{const q=rotate(p);return [q[0]*size*.5,-q[1]*size*.5,q[2]] as V;};
 const faces=planes.map((p,i)=>({...p,i,r:rotate(p.n)})).filter(p=>p.r[2]>0).sort((p,q)=>p.r[2]-q.r[2]);
 const uid=`die-${id}-${Math.round(x)}-${Math.round(y)}`;
 return <g transform={`translate(${x} ${y})`} data-critical="die" data-die={id}>
 <defs><linearGradient id={uid} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".29"/><stop offset=".52" stopColor="#fff" stopOpacity=".02"/><stop offset="1" stopColor="#17222B" stopOpacity=".2"/></linearGradient><filter id={`${uid}-shadow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14"/></filter></defs>
 <ellipse cy={size*.62} rx={size*.66} ry={size*.17} fill="#182129" opacity=".25" filter={`url(#${uid}-shadow)`}/>
 {faces.map(p=>{const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>project(p.n.map((n,j)=>n+p.u[j]!*u!+p.v[j]!*v!) as V));const origin=project(p.n),u=project(p.u),v=project(p.v);return <g key={p.i}>
 <polygon points={corners.map(q=>`${q[0]},${q[1]}`).join(' ')} fill={DIE_COLORS[id]} stroke="#26303B" strokeOpacity=".25" strokeWidth="4" strokeLinejoin="round"/>
 <polygon points={corners.map(q=>`${q[0]},${q[1]}`).join(' ')} fill={`url(#${uid})`} stroke="#fff" strokeOpacity=".3" strokeWidth="1.7" strokeLinejoin="round"/>
 <polygon points={corners.map(q=>`${q[0]},${q[1]}`).join(' ')} fill="#102B36" opacity={.04+.19*(1-p.r[2])} strokeLinejoin="round"/>
 <text transform={`matrix(${u[0]/100} ${u[1]/100} ${v[0]/100} ${v[1]/100} ${origin[0]} ${origin[1]})`} textAnchor="middle" dominantBaseline="central" fontFamily="Manrope" fontSize="114" fontWeight="700" fill="#17242D">{DIE_TOPOLOGY[id][p.i]}</text>
 </g>})}
 {label&&<text y={size*.92} textAnchor="middle" fill="#25343B" fontSize={Math.min(36,size*.22)} fontWeight="650">{id[0]!.toUpperCase()+id.slice(1)}</text>}
 {shownFace!==undefined&&<text y={size*1.15} textAnchor="middle" fontSize="29" fill="#25343B">Illustrated roll: {shownFace}</text>}
 </g>
};
