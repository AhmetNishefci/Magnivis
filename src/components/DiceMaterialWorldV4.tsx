import {useMemo,useState} from 'react';
import {continueRender,delayRender} from 'remotion';
import {ShaderSurface} from '../graphics/ShaderSurface';
import {diceShader} from '../production/dice-v4/shader';
import {ids,topology} from '../production/dice-v4/model';
import type {Pose} from '../production/dice-v4/choreography';
export const DiceMaterialWorldV4=({poses,time,view}:{poses:Pose[];time:number;view:number})=>{
 const [handle]=useState(()=>delayRender('V4 rounded dice material draw'));
 const atlas=useMemo(()=>{const c=document.createElement('canvas');c.width=2048;c.height=1024;const ctx=c.getContext('2d')!;ctx.fillStyle='#000';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.font='700 158px Manrope';ctx.textAlign='center';ctx.textBaseline='middle';ids.forEach((id,row)=>topology[id].forEach((v,face)=>ctx.fillText(String(v),face*256+128,row*256+133)));return c;},[]);
 const uniforms:Record<string,number|[number,number,number]>={time,light:.3,view};poses.forEach((p,i)=>{uniforms[`d${i}`]=[p.x,p.y,p.size];uniforms[`r${i}`]=p.rotation;});
 return <ShaderSurface fragment={diceShader} uniforms={uniforms} texture={atlas} onReady={()=>continueRender(handle)}/>;
};
