import {useCallback,useEffect,useRef,useState} from 'react';
import {continueRender,delayRender,staticFile} from 'remotion';
import {ShaderSurface} from '../graphics/ShaderSurface';
const optics=`precision highp float;varying vec2 uv;uniform float time,zoom;uniform sampler2D map;
void main(){vec2 st=(vec2(uv.x,1.-uv.y)-.5)/zoom+.5;vec3 sampleColor=texture2D(map,st).rgb;float water=smoothstep(1.06,1.3,sampleColor.b/max(.01,sampleColor.r))*smoothstep(1.06,1.3,sampleColor.g/max(.01,sampleColor.r));water*=smoothstep(.14,.2,st.y)*(1.-smoothstep(.59,.64,st.y))*smoothstep(.34,.46,st.x)*(1.-smoothstep(.81,.89,st.x));vec2 ripple=vec2(sin(time*2.1+st.y*32.)*.0016,cos(time*1.3+st.x*21.)*.0007)*water;vec3 color=texture2D(map,st+ripple).rgb;gl_FragColor=vec4(color,1.);}`;
// Original key art with restrained illustrative optical motion; not event video or a wave-height measurement.
export const DevilsHoleLocalityV2=({time,zoom=1}:{time:number;zoom?:number})=>{
 const [texture,setTexture]=useState<HTMLCanvasElement>(),[handle]=useState(()=>delayRender('Load original canyon key art')),released=useRef(false);
 useEffect(()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=2048;c.getContext('2d')!.drawImage(img,0,0,1024,2048);setTexture(c);};img.onerror=()=>{throw new Error('Missing canyon key art');};img.src=staticFile('images/devils-hole-v2/desert-pool-reconstruction.png');},[]);
 const onReady=useCallback(()=>{if(!released.current){released.current=true;continueRender(handle);}},[handle]);
 return texture?<ShaderSurface fragment={optics} texture={texture} uniforms={{time,zoom}} onReady={onReady}/>:null;
};
