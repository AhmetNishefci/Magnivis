import {ids,type DieId} from './model';
export type Pose={x:number;y:number;size:number;rotation:[number,number,number]};
export const smooth=(t:number,a:number,b:number)=>{const k=Math.max(0,Math.min(1,(t-a)/(b-a)));return k*k*(3-2*k);};
const layouts:Record<DieId,[number,number,number]>[]=[
 {yellow:[300,675,250],blue:[710,450,190],green:[245,1150,190],orange:[655,1025,330]},
 {yellow:[290,620,220],blue:[680,570,220],green:[290,1120,220],orange:[675,1080,220]},
 {yellow:[300,630,295],blue:[750,345,85],green:[185,1290,80],orange:[650,1130,230]},
 {yellow:[315,1140,225],blue:[660,620,285],green:[770,1290,80],orange:[205,345,85]},
 {yellow:[145,1330,70],blue:[655,1060,125],green:[310,650,150],orange:[825,1330,70]},
 {yellow:[145,1330,70],blue:[825,1330,70],green:[325,1060,125],orange:[670,650,150]},
 {yellow:[315,650,285],blue:[770,1280,85],green:[185,1270,85],orange:[660,1100,245]},
 {yellow:[290,850,270],blue:[750,1260,85],green:[225,1260,85],orange:[680,845,270]},
 {yellow:[490,525,205],blue:[745,850,195],green:[490,1190,200],orange:[235,850,195]},
];
export const poseAt=(scene:number,id:DieId,t:number):Pose=>{const index=ids.indexOf(id),prev=layouts[Math.max(0,scene-1)]![id],dest=layouts[scene]![id],k=scene===0?1:smooth(t,0,.85),travel=scene===0?0:Math.sin(Math.PI*k);const small=dest[2]<100;
 let rotation:[number,number,number]=[.06,-.10,-.04];
 if(scene===0&&id==='orange')rotation=[.04,-1.05*smooth(t,.35,2.65),-.09];
 if(scene===1)rotation=[.07+Math.sin(t*.8+index)*.10,-.35+Math.sin(t*.9+index*1.7)*.4,-.04];
 if(scene===3&&id==='blue')rotation=[.07,.95*smooth(t,.15,1.1)-.1,-.1];
 if(scene===4&&id==='blue')rotation=[.1,.85*smooth(t,2.4,4.5),.08];
 if(scene===5&&id==='orange')rotation=[.03,-.4+smooth(t,2.3,4.2)*.4,-.06];
 if(scene===8)rotation=[.04,-.15,.04*Math.sin(index*1.2)];
 const arcX=(index%2===0?-1:1)*35*travel,arcY=-75*travel;
 return {x:prev[0]+(dest[0]-prev[0])*k+arcX,y:prev[1]+(dest[1]-prev[1])*k+arcY,size:prev[2]+(dest[2]-prev[2])*k,rotation:small?[.03,-.1,0]:rotation};};
