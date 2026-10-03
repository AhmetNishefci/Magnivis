import type {ReactNode} from 'react';
const cyan='#89E2DE',amber='#F4BE7F',ivory='#F4EEE1',muted='#B1C5BD';
export const unit=(v:number)=>Math.max(0,Math.min(1,v));
export const Qtext=({x,y,children,size=32,color=ivory,anchor='start',opacity=1}:{x:number;y:number;children:ReactNode;size?:number;color?:string;anchor?:'start'|'middle';opacity?:number})=><text x={x} y={y} fill={color} fontSize={size} fontWeight={600} textAnchor={anchor} opacity={opacity}>{children}</text>;
export const Photon=({x,y,opacity=1}:{x:number;y:number;opacity?:number})=><g opacity={opacity}><circle cx={x} cy={y} r={25} fill={cyan} opacity={.12}/><circle cx={x} cy={y} r={9} fill={ivory}/></g>;
export const Detector=({x,y,r=55,click=false,pulse=0,color=cyan}:{x:number;y:number;r?:number;click?:boolean;pulse?:number;color?:string})=><g><circle cx={x} cy={y} r={r+20+14*pulse} fill={click?color:'none'} opacity={click?.08+.08*pulse:0}/><circle cx={x} cy={y} r={r} fill={click?'#1E605C':'#07120F'} stroke={click?color:'#657D72'} strokeWidth={4}/><circle cx={x} cy={y} r={r*.58} fill={click?color:'#10221B'} opacity={click?1:.8}/></g>;
export const Absorber=({x,y,scale=1}:{x:number;y:number;scale?:number})=><g transform={`translate(${x} ${y}) scale(${scale})`}><rect x={-23} y={-52} width={46} height={104} rx={8} fill="#D79260" stroke={amber} strokeWidth={3}/><path d="M -12 -30 L 12 -8 M -12 -8 L 12 14 M -12 14 L 12 36" stroke="#51331F" strokeWidth={4}/></g>;
/** Ribbons denote available quantum alternatives. No particles travel on both arms. */
export const Possibilities=({progress,blocked=false,entry=false}:{progress:number;blocked?:boolean;entry?:boolean})=>{
 const reveal=unit(progress*2.5),opacity=blocked?.18:1;
 return <g>
 <Qtext x={145} y={450} size={33}>ONE PHOTON</Qtext>
 <path d="M 160 780 H 270" fill="none" stroke={ivory} strokeWidth={3} opacity={.5}/>
 {entry&&progress<.22?<Photon x={160+110*unit(progress/.22)} y={780}/>:null}
 <g opacity={reveal}>
 <path d="M 270 780 C 350 780 330 540 430 540 H 550 C 660 540 620 780 700 780" pathLength={1} stroke={cyan} strokeWidth={7} fill="none" strokeDasharray="1" strokeDashoffset={1-reveal} opacity={opacity}/>
 <path d="M 270 780 C 350 780 330 990 430 990 H 550 C 660 990 620 780 700 780" pathLength={1} stroke={amber} strokeWidth={7} fill="none" strokeDasharray="1" strokeDashoffset={1-reveal}/>
 <path d="M 270 780 C 350 780 330 990 430 990 H 550 C 660 990 620 780 700 780" stroke={ivory} strokeWidth={2} fill="none" strokeDasharray="9 30" strokeDashoffset={-progress*160} opacity={.25}/>
 {!blocked&&<path d="M 270 780 C 350 780 330 540 430 540 H 550 C 660 540 620 780 700 780" stroke={ivory} strokeWidth={2} fill="none" strokeDasharray="9 30" strokeDashoffset={-progress*160} opacity={.25}/>}
 <Qtext x={380} y={485} size={28} color={cyan}>Possibility A</Qtext>
 <Qtext x={380} y={1058} size={28} color={amber}>Possibility B</Qtext>
 <path d="M 270 765 L 285 780 L 270 795 L 255 780 Z M 700 765 L 715 780 L 700 795 L 685 780 Z" fill="#152822" stroke={ivory} strokeWidth={2}/>
 <path d="M 700 780 Q 745 780 782 690 M 700 780 Q 745 780 782 875" stroke={muted} fill="none" strokeWidth={3}/>
 <Qtext x={680} y={590} size={26} color={muted}>Dark output</Qtext><Detector x={800} y={650} r={35}/><Detector x={800} y={918} r={35}/>
 </g>
 {blocked&&<Absorber x={500} y={540}/>}
 <Qtext x={145} y={1150} size={30} color={muted}>{blocked?'One possibility is blocked.':'Two possible paths. They meet again.'}</Qtext>
 </g>;
};
const wave=(y:number,sign:number,amplitude=64)=>Array.from({length:121},(_,i)=>`${i?'L':'M'} ${180+i*4.3} ${y+sign*amplitude*Math.sin(i/120*Math.PI*6)}`).join(' ');
/** Opposed probability amplitudes; sum is zero only at this selected output. */
export const Cancellation=({progress,blocked=false}:{progress:number;blocked?:boolean})=>{
 const merge=unit(progress*3),fade=blocked?1-unit(progress*2.4):1;
 return <g>
 <Qtext x={145} y={450} size={34}>{blocked?'REMOVE ONE ALTERNATIVE':'AT THE DARK OUTPUT'}</Qtext>
 <Qtext x={145} y={510} color={muted} size={28}>Waves associated with the two paths</Qtext>
 <path d={wave(620+80*merge,1)} fill="none" stroke={cyan} strokeWidth={6} opacity={fade}/>
 <path d={wave(780-80*merge,-1)} fill="none" stroke={amber} strokeWidth={6}/>
 <Qtext x={145} y={875} size={30} color={muted}>{blocked?'Opposing contribution is gone':'Opposite contributions cancel here'}</Qtext>
 <path d={blocked?wave(955,-1,42*unit(progress*2.4)):'M 180 955 H 696'} stroke={blocked?amber:ivory} strokeWidth={5} fill="none"/>
 <Detector x={780} y={955} r={52} click={blocked&&progress>.35} pulse={unit(Math.sin(progress*8))}/>
 <Qtext x={145} y={1090} size={38}>{blocked?'A CLICK IS NOW POSSIBLE':'ZERO → NO CLICK'}</Qtext>
 {!blocked&&<Qtext x={145} y={1150} size={27} color={muted}>The photon can reach the other output.</Qtext>}
 </g>;
};
export const TrialEvent=({absorbed,progress,climax=false}:{absorbed:boolean;progress:number;climax?:boolean})=>{
 const event=unit(progress*3),click=!absorbed&&progress>=1/3;
 return <g>
 <Qtext x={145} y={440} size={31} color={absorbed?amber:cyan}>{absorbed?'AN ABSORBED TRIAL':'A DIFFERENT, SUCCESSFUL TRIAL'}</Qtext>
 {absorbed?<g><Absorber x={535} y={755} scale={2.3}/>{event<1&&<Photon x={310+185*event} y={755} opacity={1-unit((event-.85)/.15)}/>}
 <Qtext x={145} y={1030} size={44}>PHOTON ABSORBED</Qtext><Qtext x={145} y={1120} size={32} color={muted}>No output detector clicks.</Qtext></g>:<g>
 <Detector x={535} y={755} r={135} click={click} pulse={unit(Math.sin(progress*12))}/>
 {!climax&&event<1&&<Photon x={310+105*event} y={755}/>}
 <Qtext x={535} y={775} anchor="middle" size={click?45:35} color={click?'#092521':ivory}>{click?'CLICK':'DARK'}</Qtext>
 {climax?<g><Qtext x={145} y={1020} size={43} color={cyan}>OBSTACLE DETECTED</Qtext><Qtext x={145} y={1085} size={36}>PHOTON NOT ABSORBED</Qtext><Qtext x={145} y={1145} size={29} color={muted}>by the obstacle in this trial</Qtext></g>:<g><Absorber x={165} y={1100} scale={.6}/><Qtext x={205} y={1110} size={30} color={muted}>Obstacle still present</Qtext></g>}
 </g>}
 </g>;
};
