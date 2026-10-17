import React from 'react';
import {carMesh,rampMesh,roadMesh,transformMesh,type V3,type Face} from './geometry';
const body=carMesh(),ramp=rampMesh();
export type Camera={yaw:number;tilt:number;scale:number;target:V3;cx?:number;cy?:number};
export const project=(p:V3,c:Camera)=>{const x=p[0]-c.target[0],y=p[1]-c.target[1],z=p[2]-c.target[2],h=x*Math.cos(c.yaw)+z*Math.sin(c.yaw),d=-x*Math.sin(c.yaw)+z*Math.cos(c.yaw);return {x:(c.cx??500)+h*c.scale,y:(c.cy??865)-(y*Math.cos(c.tilt)-d*Math.sin(c.tilt))*c.scale,depth:y*Math.sin(c.tilt)+d*Math.cos(c.tilt)};};
const Mesh:React.FC<{faces:Face[];camera:Camera;critical?:boolean}>=({faces,camera,critical=false})=>{
 const polygons=faces.map(f=>({...f,projected:f.points.map(p=>project(p,camera))})).sort((a,b)=>a.projected.reduce((s,p)=>s+p.depth,0)/a.projected.length-b.projected.reduce((s,p)=>s+p.depth,0)/b.projected.length);
 return <g data-qabounds={critical?'critical-visual':undefined} aria-label={critical?'Original approximate Roadster exterior':undefined}>{polygons.map((f,i)=><polygon key={i} points={f.projected.map(p=>`${p.x},${p.y}`).join(' ')} fill={f.fill} stroke={f.stroke??f.fill} strokeWidth={f.stroke?1.2:.6} strokeLinejoin="round"/>)}</g>;
};
export const RoadsterWorld:React.FC<{camera:Camera;position?:V3;pitch?:number;roll?:number;curved?:boolean;ground?:boolean;surfaceY?:number}>=({camera,position=[0,0,0],pitch=0,roll=0,curved=false,ground=false,surfaceY})=><>
 {ground&&<Mesh faces={roadMesh()} camera={camera}/>}
 {ground&&<Mesh faces={[{points:Array.from({length:40},(_,i):V3=>[position[0]+2.35*Math.cos(i/40*Math.PI*2),.015,1.1*Math.sin(i/40*Math.PI*2)]),fill:'rgba(8,17,22,.26)'}]} camera={camera}/>}
 {curved&&<Mesh faces={ramp} camera={camera}/>}
 {surfaceY!==undefined&&<Mesh faces={[{points:[[-6,surfaceY,-1.4],[6,surfaceY,-1.4],[6,surfaceY,1.4],[-6,surfaceY,1.4]],fill:'#777f7a',stroke:'#a4b1aa'},{points:[[-6,surfaceY,-1.4],[6,surfaceY,-1.4],[6,surfaceY+.13,-1.4],[-6,surfaceY+.13,-1.4]],fill:'#c4ccc7'}]} camera={camera}/>}
 <Mesh faces={transformMesh(body,position,pitch,roll)} camera={camera} critical/>
 </>;
