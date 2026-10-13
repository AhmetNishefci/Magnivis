import type {CSSProperties} from 'react';
const rock='#B49A75',dark='#796953';
const strata=Array.from({length:26},(_,i)=>({y:i*28,x:(i*83)%180}));
export const Pupfish=({x,y,time,flip=false}:{x:number;y:number;time:number;flip?:boolean})=><g transform={`translate(${x+Math.sin(time*.9+x)*9} ${y+Math.sin(time*1.4+y)*4}) scale(${flip?-1:1} 1)`}><path d="M-18 0 Q-12 -11 8 -9 Q24 -5 28 0 Q22 9 7 9 Q-12 10 -18 0 L-29 9 Q-38 0 -29 -9Z" fill="#4D8CB0" stroke="#1D4662" strokeWidth="2"/><path d="M-7 -8Q-2 -19 7 -14L14 -7" fill="#3779A2"/><circle cx="19" cy="-2" r="2.5" fill="#143C44"/></g>;
export const SeicheBasin=({time,cutaway=false,shelf=false,disturbance=false,quiet=false,forcing=false,viewBox="0 0 770 650"}:{time:number;cutaway?:boolean;shelf?:boolean;disturbance?:boolean;quiet?:boolean;forcing?:boolean;viewBox?:string})=>{
 const sway=Math.sin(time*2.2)*(quiet?2:18),shift=cutaway&&!shelf&&forcing?Math.sin(time*2.2+.6)*12:0;
 const style:CSSProperties={overflow:'visible'};
 return <svg viewBox={viewBox} width="100%" height="100%" style={style}>
  <defs><linearGradient id="seiche-rock" x2=".8" y2="1"><stop stopColor="#D0B98F"/><stop offset="1" stopColor="#8C765D"/></linearGradient><linearGradient id="seiche-water" x2=".25" y2="1"><stop stopColor="#39838A"/><stop offset=".5" stopColor="#205661"/><stop offset="1" stopColor="#0A303D"/></linearGradient><radialGradient id="seiche-light"><stop stopColor="#64B7B2" stopOpacity=".5"/><stop offset="1" stopColor="#22616C" stopOpacity="0"/></radialGradient><pattern id="seiche-grain" width="61" height="47" patternUnits="userSpaceOnUse"><path d="M2 6L19 5M31 22L45 24M12 37L23 32" stroke="#594B3D" strokeOpacity=".14" strokeWidth="2"/></pattern><clipPath id="seiche-cave"><path d={cutaway?'M182 256 Q219 241 220 147 L525 147 Q574 200 566 297 L618 615 L375 650 L198 589 L203 437 L176 409Z':'M381 25 Q515 58 548 142 L567 300 Q534 346 563 405 Q540 551 410 614 Q325 602 290 526 L242 323 Q251 256 265 195 Q278 84 381 25Z'}/></clipPath></defs>
  <g transform={`translate(${shift} 0)`}>
   <path d="M18 54L193 3L436 16L744 69L770 525L681 638L146 650L0 516Z" fill="url(#seiche-rock)"/>
   {strata.map((s,i)=><path key={i} d={`M0 ${s.y+15}Q${180+s.x} ${s.y-35} 380 ${s.y+18}T770 ${s.y+32}`} fill="none" stroke={i%3?dark:'#E6CFAB'} strokeOpacity={i%3?.35:.5} strokeWidth={i%5===0?5:2}/>)}
   <path d="M30 60L225 110L193 311L58 380 M620 40L654 194L712 294L648 473L737 573 M58 523L178 563L159 630" fill="none" stroke="#685949" strokeWidth="5" opacity=".45"/>
   <path d="M18 54L193 3L436 16L744 69L770 525L681 638L146 650L0 516Z" fill="url(#seiche-grain)"/>
   <g clipPath="url(#seiche-cave)">
    <rect x="130" y="0" width="520" height="650" fill="#1D3839"/>
    <path d={cutaway?`M130 ${288+sway} Q350 287 650 ${288-sway}L650 650L130 650Z`:'M120 0H680V650H120Z'} fill="url(#seiche-water)"/>
    <ellipse cx="390" cy="330" rx="210" ry="315" fill="url(#seiche-light)"/>
    {Array.from({length:12},(_,i)=><path key={i} d={cutaway?`M148 ${315+i*22} Q340 ${315+i*22+Math.sin(time*2.2+i)*5} 628 ${315+i*22-sway*.6}`:`M270 ${125+i*35}Q393 ${102+i*35+Math.sin(time*2.2+i*.8)*8} 565 ${130+i*35}`} fill="none" stroke="#84CFCA" strokeOpacity={i%3===0?.23:.09} strokeWidth={i%3===0?3:1.5}/>)}
    {cutaway&&<><path d="M170 430L355 430L379 445L346 484L170 488Z" fill={rock}/><path d="M175 430L352 430L365 438L175 441Z" fill="#8A986C"/>
     {Array.from({length:24},(_,i)=><ellipse key={i} cx={184+(i*37)%165} cy={434+(i%3)*3} rx={3+i%4} ry="2.5" fill={i%2?'#8B9F69':'#BBB18A'}/>)}
     {shelf&&[0,1,2].map(i=><Pupfish key={i} x={230+i*125} y={371+(i%2)*24} time={time} flip={i===1}/>)}
     {disturbance&&[0,1,2,3,4].map(i=>{const progress=Math.min(1,Math.max(0,(time-i*.15)/3));return <circle key={i} cx={335+progress*(115+i*8)} cy={434+progress*(60+i*8)} r={3} fill="#B5BC86" opacity={1-progress*.75}/>;})}
    </>}
   </g>
   <path d={cutaway?'M182 256Q219 241 220 147M525 147Q574 200 566 297L618 615M198 589L203 437L176 409':'M381 25Q515 58 548 142L567 300Q534 346 563 405Q540 551 410 614Q325 602 290 526L242 323Q251 256 265 195Q278 84 381 25Z'} fill="none" stroke="#544A40" strokeWidth="13"/>
   {!cutaway&&<path d="M281 173Q321 94 400 54M470 575Q525 503 535 435" fill="none" stroke="#D8C5A4" strokeWidth="14" opacity=".6"/>}
  </g>
  {forcing&&<><path d="M177 262V385" stroke="#F1DBB6" strokeWidth="2" strokeDasharray="4 5"/><path d={`M${177+shift} 272V375`} stroke="#A45C34" strokeWidth="4"/><text x="45" y="345" fontSize="26" fill="#514B3F">Ground</text><path d="M126 337H163" stroke="#7A6248" strokeWidth="2"/><text x="420" y="380" fontSize="27" fill="#DAE9DA">Local water</text></>}
 </svg>;
};
