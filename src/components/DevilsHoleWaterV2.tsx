import {ShaderSurface} from '../graphics/ShaderSurface';
import {basinShader} from '../production/visuals/devils-hole-shaders';
export const DevilsHoleWaterV2=({time,forcing=false,zoom=1,habitat=false,sideOn=false}:{time:number;forcing?:boolean;zoom?:number;habitat?:boolean;sideOn?:boolean})=><ShaderSurface fragment={basinShader} uniforms={{time,mode:habitat?2:sideOn?1:0,forcing:forcing?1:0,zoom}}/>;
export const PupfishV2=({x,y,time,flip=false}:{x:number;y:number;time:number;flip?:boolean})=><svg width="105" height="58" viewBox="-42 -25 84 46" style={{position:'absolute',left:x+Math.sin(time*.9)*13,top:y+Math.sin(time*1.4)*5,transform:`scaleX(${flip?-1:1})`,filter:'drop-shadow(0 4px 5px #001b2c)'}}>
 <defs><linearGradient id={`fish-${flip}`} x2="0" y2="1"><stop stopColor="#739DAD"/><stop offset=".3" stopColor="#276997"/><stop offset=".75" stopColor="#165276"/><stop offset="1" stopColor="#07394E"/></linearGradient></defs>
 <path d="M-19 -4L-31 -13Q-44 0 -31 13L-19 5Q-9 17 18 9Q31 5 30 -2Q22 -17 -1 -13Q-11 -12 -19 -4Z" fill={`url(#fish-${flip})`} stroke="#15546E" strokeWidth="1.5"/>
 <path d="M-12 -10Q-9 -21 3 -17L13 -12M-8 12Q-5 21 7 14" fill="#27668D"/><path d="M-30 -10L-24 -3M-33 -4L-24 0M-33 4L-24 3M-30 10L-24 5" stroke="#5490A3" strokeWidth="1"/><ellipse cx="22" cy="-2" rx="4" ry="3.5" fill="#051F29"/><circle cx="23" cy="-3" r="1" fill="#C2DBD5"/><path d="M-9 -3Q3 -8 16 -4" stroke="#8BB6BA" strokeWidth="1.5" opacity=".6"/>
</svg>;
