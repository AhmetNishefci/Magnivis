import React from 'react';
export type Vec=[number,number,number];
type Face={points:Vec[];color:string;opacity:number;gradient?:[string,string]};
export const add=(a:Vec,b:Vec):Vec=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a:Vec,b:Vec):Vec=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul=(a:Vec,s:number):Vec=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a:Vec,b:Vec)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const unit=(v:Vec)=>mul(v,1/(Math.hypot(...v)||1));
const cross=(a:Vec,b:Vec):Vec=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const light=unit([-.5,-.7,1]);
const color=(base:Vec,n:Vec)=>{const nn=unit(n),lambert=Math.max(0,dot(nn,light)),rim=Math.pow(1-Math.abs(nn[2]),3)*.15,spec=Math.pow(Math.max(0,dot(nn,unit([-.25,-.38,1]))),24)*.28,grain=1;return `rgb(${base.map((c,j)=>Math.round(Math.min(255,c*(.2+lambert*.85+rim)*grain+spec*[132,152,143][j]!))).join(',')})`;};
const face=(out:Face[],points:Vec[],base:Vec,normal?:Vec,opacity=1)=>{const n=normal??cross(sub(points[1]!,points[0]!),sub(points[2]!,points[0]!));out.push({points,color:color(base,n),opacity});};
const ellipsoid=(out:Face[],center:Vec,radii:Vec,base:Vec,n=28,m=18)=>{
 const point=(a:number,b:number):Vec=>add(center,[radii[0]*Math.sin(a)*Math.cos(b),radii[1]*Math.cos(a),radii[2]*Math.sin(a)*Math.sin(b)]);
 for(let i=0;i<m;i++)for(let j=0;j<n;j++){const a=i/m*Math.PI,b=j/n*Math.PI*2,c=(i+1)/m*Math.PI,d=(j+1)/n*Math.PI*2,ps=[point(a,b),point(c,b),point(c,d),point(a,d)],normal=unit([(ps[0]![0]+ps[2]![0]-2*center[0])/radii[0]**2,(ps[0]![1]+ps[2]![1]-2*center[1])/radii[1]**2,(ps[0]![2]+ps[2]![2]-2*center[2])/radii[2]**2]);face(out,ps,base,normal);}
};
const fin=(out:Face[],origin:Vec,tip:Vec,span:Vec,frame:number,phase:number)=>{const bend=Math.sin(frame*.035+phase)*8,tip2=add(tip,[0,0,bend]);for(let j=0;j<15;j++){const u=j/14-.5,v=(j+1)/14-.5,a=add(tip2,mul(span,u)),b=add(tip2,mul(span,v));face(out,[origin,a,b],[101,119,109],[0,-.2,1],.28);face(out,[origin,a,add(a,[.6,0,0])],[157,169,142],[0,0,1],.6);}};
export const contact:Vec=[70,200,95];
export const rotate=(p:Vec,yaw:number,pitch:number):Vec=>{const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw);return[x,p[1]*Math.cos(pitch)-z*Math.sin(pitch),p[1]*Math.sin(pitch)+z*Math.cos(pitch)];};
export const project=(p:Vec,yaw:number,pitch:number):Vec=>{const q=rotate(p,yaw,pitch),k=1400/(1400-q[2]);return[q[0]*k,q[1]*k,q[2]];};
/** Original illustrative geometry, not a specimen measurement. Female skin is opaque;
 * only thin fin membranes transmit light. One world-space jaw origin persists. */
export const FishWorld:React.FC<{frame:number;yaw:number;pitch?:number;maleAt?:Vec;maleScale?:number;female?:boolean;opacity?:number;mark?:boolean}>=({frame,yaw,pitch=.06,maleAt=contact,maleScale=.58,female=true,opacity=1,mark=true})=>{
 const fs:Face[]=[];
 if(female){
 const point=(t:number,a:number):Vec=>{const y=Math.sin(t)*Math.sin(a)*240;return[300*Math.cos(t)+y*.24,y,Math.sin(t)*Math.cos(a)*168];};
 for(let i=0;i<56;i++)for(let j=0;j<84;j++){const t=i/56*2.34,u=(i+1)/56*2.34,a=j/84*Math.PI*2,b=(j+1)/84*Math.PI*2,ps=[point(t,a),point(u,a),point(u,b),point(t,b)],p=point((t+u)/2,(a+b)/2),normal=unit([p[0]/300**2,p[1]/240**2,p[2]/168**2]);face(fs,ps,[85,88,73],normal);const normalAt=(v:Vec)=>unit([v[0]/300**2,v[1]/240**2,v[2]/168**2]);fs.at(-1)!.gradient=[color([85,88,73],normalAt(ps[0]!)),color([85,88,73],normalAt(ps[2]!))];}
 // Recessed oral bowl: no glass body or invented internal organ layout.
 const rim=(a:number,r=1):Vec=>{const y=Math.sin(2.34)*Math.sin(a)*240*r;return[300*Math.cos(2.34)+y*.24,y,Math.sin(2.34)*Math.cos(a)*168*r];};
 for(let j=0;j<84;j++){const a=j/84*Math.PI*2,b=(j+1)/84*Math.PI*2;face(fs,[rim(a),[-105,10,0],rim(b)],[15,22,23],[-1,0,0]);
 const p=rim(a);face(fs,[rim(a),rim(b),rim(b,.97),rim(a,.97)],[99,105,80],[-.5,0,1]);
 if(j%2===0){const inner=add(mul(p,.68),[-58,0,0]),tangent:Vec=[0,-Math.cos(a)*4,Math.sin(a)*4];face(fs,[add(p,tangent),inner,sub(p,tangent)],[179,170,132],[-.4,-.2,1]);face(fs,[sub(p,tangent),inner,add(p,[4,0,0])],[118,115,92],[0,.4,.7]);}}
 // Tail stalk, fins and ribs occupy different depths; paired pectorals retained.
 ellipsoid(fs,[300,0,0],[55,25,26],[54,66,60],16,10);
 fin(fs,[325,0,0],[447,0,0],[0,180,25],frame,0);fin(fs,[190,-115,-12],[245,-246,-20],[145,0,20],frame,1);fin(fs,[183,137,0],[252,240,5],[138,15,14],frame,2);fin(fs,[65,54,143],[149,148,200],[80,-36,18],frame,3);fin(fs,[60,52,-139],[156,118,-190],[80,-38,8],frame,4);
 ellipsoid(fs,[-139,-112,145],[8,9,7],[7,13,14],14,10);ellipsoid(fs,[-141,-115,152],[2.2,2,1.2],[183,211,192],8,6);
 // Spinules follow curved surface normals; deterministic, no drifting particle cloud.
 for(let j=0;j<125;j++){const t=.3+(j*.618%1)*1.93,a=(j*.381%1)*Math.PI*2,p=point(t,a),normal=unit([p[0]/300**2,p[1]/240**2,p[2]/168**2]),q=add(p,mul(normal,4+j%4));face(fs,[add(p,[2,-2,0]),q,add(p,[-2,2,0])],[112,116,90],normal);}
 // Short adult illicium/esca, three distinct dorsal caruncles.
 const lure:Vec=[-126,-268,25];ellipsoid(fs,[-120,-247,23],[3.4,17,3.5],[85,108,86],10,8);ellipsoid(fs,lure,[8,9,7],[176,204,149],12,10);
 for(const [j,x]of[20,66,110].entries()){const theta=Math.acos(x/Math.hypot(300,57.6))-Math.atan2(57.6,300),y=-240*Math.sin(theta);ellipsoid(fs,[x,y-9,-3],[7,18-j,7],[100,115,86],12,10);}
 // Contact skin is part of female body, shared with male nose/cutaway origin.
 ellipsoid(fs,contact,[9,7,8],[104,106,80],12,10);
 }
 const male:Face[]=[];ellipsoid(male,[0,86,0],[20,53,15],[115,107,80],22,16);ellipsoid(male,[0,28,0],[27,29,21],[128,119,90],22,16);ellipsoid(male,[-12,24,19],[11,13,7],[11,26,29],16,12);ellipsoid(male,[-14,20,25],[3,3,2],[178,206,181],10,8);fin(male,[0,114,0],[0,158,2],[48,0,7],frame,6);fin(male,[-15,73,0],[-46,97,8],[7,31,0],frame,7);fin(male,[14,73,0],[44,100,-5],[9,30,0],frame,8);
 const jaw=Math.min(1,Math.hypot(...sub(maleAt,contact))/30);
 for(const side of[-1,1]){face(male,[[side*(7+jaw*5),6,5],[side*(6+jaw*9),-5,5],[side*1,0,9]],[208,190,140],[0,-.5,1]);face(male,[[side*(7+jaw*5),6,-5],[side*(6+jaw*9),-5,-5],[side*1,0,-9]],[166,155,116],[0,-.5,1]);}
 const attached=Math.hypot(...sub(maleAt,contact))<.01,tilt=attached?-.1:Math.sin(frame*.045)*.1;
 for(const f of male)fs.push({...f,points:f.points.map(v=>add(maleAt,mul([v[0]*Math.cos(tilt)-v[1]*Math.sin(tilt),v[0]*Math.sin(tilt)+v[1]*Math.cos(tilt),v[2]],maleScale)))});
 const rendered=fs.map(f=>({...f,ps:f.points.map(p=>project(p,yaw,pitch))})).sort((a,b)=>a.ps.reduce((s,p)=>s+p[2],0)/a.ps.length-b.ps.reduce((s,p)=>s+p[2],0)/b.ps.length);
 const c=project(maleAt,yaw,pitch);
 return <g opacity={opacity}><defs>{rendered.map((f,j)=>f.gradient&&<linearGradient key={j} id={`mesh-shade-${j}`} gradientUnits="userSpaceOnUse" x1={f.ps[0]![0]} y1={f.ps[0]![1]} x2={f.ps[2]![0]} y2={f.ps[2]![1]}><stop stopColor={f.gradient[0]}/><stop offset="1" stopColor={f.gradient[1]}/></linearGradient>)}</defs>{rendered.map((f,j)=><path key={j} d={f.ps.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('')+'Z'} fill={f.gradient?`url(#mesh-shade-${j})`:f.color} opacity={f.opacity} stroke={f.gradient?`url(#mesh-shade-${j})`:f.color} strokeWidth=".3" strokeOpacity={f.opacity}/>)}{mark&&<rect data-qabounds="critical-visual" aria-label="Male jaw and recognizable attached body" x={c[0]-26} y={c[1]-9} width={54} height={maleScale*166+14} fill="transparent"/>}</g>;
};
