/** Original illustrative geological relief. Positions/counts are not site data or measured tracks. */
import {interpolate} from 'remotion';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const rand=(i:number)=>{const x=Math.sin(i*73.193+14.713)*43758.5453;return x-Math.floor(x);};
const edge=(j:number)=>Array.from({length:25},(_,i)=>`${i===0?'M':'L'} ${i*65-220} ${j*78+Math.sin(i*.67+j*.4)*35+rand(i+j*41)*25}`).join(' ');
const txt=(x:number,y:number,t:string,size=34,color='#F2E6D0')=><text x={x} y={y} fontFamily="Manrope" fontSize={size} fill={color}>{t}</text>;
const Nucleus=({x,y,r=42}:{x:number;y:number;r?:number})=><g><circle cx={x} cy={y} r={r+6} fill="#D18B38" opacity={.13}/>{Array.from({length:19},(_,i)=>{const a=i*2.399,s=Math.sqrt(i/19)*r;return <circle key={i} cx={x+Math.cos(a)*s} cy={y+Math.sin(a)*s} r={r/4.5} fill={i%2?'#D4A65A':'#866041'} stroke="#F1D6A7" strokeOpacity={.22}/>;})}</g>;
const Fission=({x,y,phase}:{x:number;y:number;phase:number})=>{const q=clamp((phase-.25)*2);return <g>{q<.15?<Nucleus x={x} y={y}/>:<><Nucleus x={x-q*40} y={y-q*22} r={25}/><Nucleus x={x+q*40} y={y+q*22} r={25}/><circle cx={x} cy={y} r={20+q*70} fill="none" stroke="#E7BE7D" opacity={(1-q)*.4}/></>}</g>;};
export const OkloWorld=({index,p,frame}:{index:number;p:number;frame:number})=>{
 const atomic=index===3||index===7;
 const zoom=index===5?1+p*.22:index===2?1.15:index===8||index===10?1.35:1;
 const feedback=index===9;
 const coolingFrame=2305;
 const cooling=frame>=coolingFrame;
 const cut=(coolingFrame-2155)/(2430-2155);
 const wet=feedback?(cooling?clamp((p-cut)/(1-cut)):clamp(1-p/cut)):0;
 const water=index===6?clamp(p*1.6):feedback?wet:index===7||index===11?.85:0;
 const heat=index===0?.6:index===1?.35:feedback?1-wet:index===11?.5:.08;
 const camera=frame/2922;
 return <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
 <defs><linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#B29269"/><stop offset=".45" stopColor="#635443"/><stop offset="1" stopColor="#241E1A"/></linearGradient><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0D1010"/><stop offset=".18" stopColor="#0D1010" stopOpacity=".15"/><stop offset=".65" stopColor="#0D1010" stopOpacity=".25"/><stop offset=".82" stopColor="#0D1010"/><stop offset="1" stopColor="#0D1010"/></linearGradient><radialGradient id="heat"><stop stopColor="#EEB14E" stopOpacity=".65"/><stop offset=".4" stopColor="#C46726" stopOpacity=".2"/><stop offset="1" stopColor="#C46726" stopOpacity="0"/></radialGradient><linearGradient id="ore" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#181815"/><stop offset=".55" stopColor="#29281F"/><stop offset="1" stopColor="#101310"/></linearGradient></defs>
 <g opacity={atomic?.23:1} transform={`translate(${540-540*zoom},${680-680*zoom}) scale(${zoom})`}>
 <g transform={`translate(${-camera*65},${275-camera*45}) rotate(-11 540 600)`}>
 {Array.from({length:17},(_,j)=><path key={j} d={`${edge(j)} L 1440 ${j*78+148} L -220 ${j*78+148} Z`} fill={j===6||j===7?'url(#ore)':'url(#stone)'} opacity={j===6||j===7?1:.6+rand(j)*.35} stroke="#C5A574" strokeWidth={1.5} strokeOpacity={.25}/>)}
 {Array.from({length:450},(_,i)=><ellipse key={i} cx={rand(i*3+1)*1440-180} cy={rand(i*3+2)*1320} rx={1+rand(i*3+3)*8} ry={.7+rand(i)*2} fill={i%3?'#DBC298':'#171E18'} opacity={.06+rand(i+4)*.18}/>)}
 {Array.from({length:32},(_,i)=>{const x=rand(i+180)*1360-120,y=rand(i+20)*1050;return <path key={i} d={`M${x} ${y} l${20+rand(i)*50} 30 l-15 35 l30 60`} fill="none" stroke="#10130F" strokeWidth={1+rand(i)*3} opacity={.5}/>;})}
 <ellipse cx={550} cy={560} rx={530} ry={185} fill="url(#heat)" opacity={heat}/>
 {water>0&&Array.from({length:8},(_,i)=>{const x=175+i*112;return <path key={i} d={`M${x} 70 C${x+130} 280 ${x-100} 380 ${x+40} 520 S${x+80} 760 ${x+25} 1010`} fill="none" stroke="#8AB8B9" strokeWidth={4} opacity={water*.55} strokeDasharray="40 26" strokeDashoffset={-frame*.6}/>;})}
 </g></g>
 <rect width={1080} height={1920} fill="url(#shade)"/>
 {atomic&&<g data-critical="atomic-mechanism">
 {index===3?<g>
 <Fission x={235} y={670} phase={p}/><Fission x={540} y={845} phase={p-.15}/><Fission x={745} y={660} phase={p-.35}/>
 <path d="M235 670 Q390 670 540 845 Q640 840 745 660" fill="none" stroke="#F0E0AE" strokeWidth={3} strokeDasharray="3 14" opacity={.65}/>
 <path d="M235 670 L120 510 M540 845 L680 1080" stroke="#B8BEB3" strokeWidth={2} strokeDasharray="3 14" opacity={.28}/>
 {[0,1].map(i=>{const q=(p*2+i*.5)%1;return <circle key={i} cx={interpolate(q,[0,.5,1],[235,540,745])} cy={interpolate(q,[0,.5,1],[670,845,660])} r={7} fill="#F4E9C8"/>;})}
 {txt(140,1100,'Enough neutrons continue the chain.',32)}
 </g>:<g>
 <Fission x={755} y={900} phase={p> .88?1:0}/>
 {[{x:335,y:660},{x:500,y:820},{x:640,y:660}].map((v,i)=><g key={i}><circle cx={v.x} cy={v.y} r={28} fill="#69A6AA" fillOpacity={.35} stroke="#BCD5CD" strokeWidth={2}/>{txt(v.x-11,v.y+11,'H',27,'#CAE1DB')}</g>)}
 <path d="M140 580 L335 660 L500 820 L640 660 L755 900" fill="none" stroke="#D3DCD0" strokeWidth={2} strokeDasharray="3 15" opacity={.4}/>
 {(()=>{const q=p;const stop=[0,.12,.35,.68,1],xs=[140,335,500,640,755],ys=[580,660,820,660,900];return <circle cx={interpolate(q,stop,xs)} cy={interpolate(q,stop,ys)} r={8} fill="#F5E5B9"/>;})()}
 {txt(140,1055,'Collisions slow the neutron.',32)}{txt(140,1110,'Further fission becomes more likely.',30,'#ABC3BA')}
 </g>}
 </g>}
 <g data-critical="scene">
 {index===0?<>{txt(125,410,'2 BILLION',91)}{txt(128,475,'YEARS AGO',36,'#D5C3A6')}{txt(125,1150,'Natural nuclear reactors.',38)}</>:null}
 {index===1?<>{txt(125,405,'OKLO',86)}{txt(130,465,'Present-day Gabon',35,'#D5C3A6')}</>:null}
 {index===2?<>{txt(125,405,'THE CLUES · 1972',35)}{txt(125,1040,'U-235 depleted',40)}{txt(125,1100,'Fission products in the rock',33,'#D5C3A6')}</>:null}
 {index===3?txt(125,420,'A CHAIN, NOT JUST RADIOACTIVITY',29):null}
 {index===4?<>{txt(125,420,'ANCIENT FUEL',36)}{txt(125,1050,'A larger share of U-235',40)}{txt(125,1110,'U-235 decays faster than U-238',30,'#D5C3A6')}</>:null}
 {index===5?<>{txt(125,420,'CONCENTRATED ORE',36)}{txt(125,1050,'Retain enough neutrons.',38)}{txt(125,1110,'Limit non-fission absorption.',31,'#D5C3A6')}</>:null}
 {index===6?<>{txt(125,420,'GROUNDWATER',44)}{txt(125,1110,'The neutron moderator.',36,'#B3D1CF')}</>:null}
 {index===7?txt(125,420,'WATER SLOWS NEUTRONS',35):null}
 {index===8?<>{txt(125,420,'ONE STUDIED ZONE',36)}{txt(125,1070,'Xenon isotope evidence',38)}{txt(125,1125,'A reconstruction of starts and stops',30,'#D5C3A6')}</>:null}
 {index===9?<>{txt(125,420,'INFERRED FEEDBACK',36)}{txt(125,1100,!cooling?'Heating · moderating water lost':'Cooling · water returns',34,!cooling?'#E7B57C':'#B3D1CF')}</>:null}
 {index===10?<>{txt(125,420,'TRACES IN THE ROCK',36)}{txt(125,1100,'Reconstructed, not directly observed.',30,'#D5C3A6')}</>:null}
 {index===11?<>{txt(125,420,'FUEL. WATER. GEOLOGY.',39)}{txt(125,1100,'Nuclear heat, without machinery.',34,'#D5C3A6')}</>:null}
 </g></svg>;
};
