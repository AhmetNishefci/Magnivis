/** Original narrative illustrations, not site footage, measured plots or exact particle paths. */
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const rand=(i:number)=>{const n=Math.sin(i*19.131+7.53)*43758.5453;return n-Math.floor(n);};
const Ink=({x,y,text,size=32,color='#D5DBC9'}:{x:number;y:number;text:string;size?:number;color?:string})=><text x={x} y={y} fontFamily="Manrope" fontSize={size} fill={color}>{text}</text>;
const Nucleus=({x,y,r=38,split=0}:{x:number;y:number;r?:number;split?:number})=><g>{Array.from({length:22},(_,i)=>{const a=i*2.399,s=Math.sqrt(i/22)*r,offset=split*(i<11?-47:47);return <circle key={i} cx={x+Math.cos(a)*s+offset} cy={y+Math.sin(a)*s+(i<11?-1:1)*split*20} r={r/5.1} fill={i%3?'#D6AB62':'#AD865A'} stroke="#F5DCB1" strokeWidth={1} strokeOpacity={.3}/>;})}</g>;
const Rock=({x=165,y=650,width=660,height=360,wet=0,heat=0,grain=1}:{x?:number;y?:number;width?:number;height?:number;wet?:number;heat?:number;grain?:number})=><g>
 <path d={`M${x} ${y+40} L${x+width*.8} ${y} L${x+width} ${y+50} L${x+width} ${y+height-25} L${x+width*.7} ${y+height} L${x} ${y+height-50}Z`} fill="url(#v4-rock)" stroke="#8D7964" strokeWidth={2}/>
 {Array.from({length:7},(_,j)=><path key={j} d={`M${x} ${y+60+j*38} Q${x+width*.35} ${y+5+j*40} ${x+width} ${y+65+j*37}`} stroke={j===3?'#221D16':'#8C775A'} strokeWidth={j===3?45:3} fill="none" opacity={j===3?.9:.4}/>)}
 {Array.from({length:52},(_,i)=>{const gx=x+35+rand(i)* (width-70),gy=y+85+rand(i+300)*(height-140);return <circle key={i} cx={gx} cy={gy} r={3+rand(i+100)*7} fill={i%4?'#66513B':'#D6AC63'} opacity={grain*(i%4?.35:.8)}/>;})}
 {Array.from({length:6},(_,i)=><path key={i} d={`M${x+70+i*92} ${y+15} l-15 65 l22 45 l-20 68 l18 65`} fill="none" stroke="#84C2CA" strokeWidth={6} opacity={wet*.65}/>)}
 <ellipse cx={x+width*.5} cy={y+height*.5} rx={width*.36} ry={height*.22} fill="url(#v4-heat)" opacity={heat}/>
 </g>;
const Planet=({p,final=false}:{p:number;final?:boolean})=><g transform={`translate(495 800) scale(${.87+p*.02})`}>
 <circle r={330} fill="url(#v4-earth)" stroke="#7A9291" strokeOpacity={.5} strokeWidth={2}/>
 <g clipPath="url(#v4-sphere)">{Array.from({length:16},(_,i)=><ellipse key={i} cx={-260+rand(i)*520} cy={-290+rand(i+30)*580} rx={35+rand(i+100)*90} ry={25+rand(i+200)*60} fill={i%2?'#66745A':'#9C8A5C'} opacity={.15+rand(i+20)*.12} transform={`rotate(${i*17})`}/>)}<path d="M-340 40 Q-170 90 0 15 T350 35" stroke="#DDD6AE" strokeOpacity={.35} strokeWidth={12} fill="none"/><path d="M-325 60 Q-170 110 0 40 T330 65" stroke="#B77D3F" strokeWidth={15} strokeOpacity={.5} fill="none"/>
 <ellipse cx={100} cy={40} rx={65} ry={32} fill="url(#v4-heat)" opacity={final?.5:.7}/><ellipse cx={155} cy={105} rx={260} ry={320} fill="url(#v4-night)"/>
 </g><circle r={334} fill="none" stroke="#A7CED2" strokeOpacity={.15} strokeWidth={6}/>
 </g>;
const Laboratory=({p}:{p:number})=><g transform={`translate(0 ${-p*9})`}>
 <rect x={140} y={485} width={700} height={665} rx={25} fill="#E7E1D2"/>
 <path d="M140 980 H840 V1150 H140Z" fill="#CBC7BB"/>
 <ellipse cx={500} cy={1040} rx={275} ry={48} fill="#343B39" opacity={.17}/>
 <path d="M220 750 L650 700 L790 900 L335 980Z" fill="url(#v4-metal)" stroke="#909C99" strokeWidth={2}/>
 <path d="M243 756 L644 716 L751 890 L347 955Z" fill="#3E4743"/>
 <g transform={`translate(160 210) scale(.58)`}><Rock width={630} height={330}/></g>
 <rect x={165} y={560} width={240} height={110} rx={3} fill="#F4F0E7" transform="rotate(-5 165 560)"/>
 <Ink x={183} y={606} text="OKLO · GABON" size={26} color="#45534D"/>
 <Ink x={185} y={645} text="URANIUM SAMPLE" size={21} color="#63726A"/>
 <path d="M600 570 H780 V725 H600Z" fill="#F9F6EE" stroke="#C5C6B8"/>
 <Ink x={622} y={616} text="U-235" size={32} color="#44564A"/>
 <Ink x={622} y={658} text="Lower than" size={23} color="#765B3B"/><Ink x={622} y={688} text="expected" size={23} color="#765B3B"/>
 </g>;
const Evidence=({p}:{p:number})=><g>
 <rect x={145} y={480} width={690} height={670} rx={5} fill="#E7E1D2"/>
 <Ink x={183} y={548} text="Evidence in the rock" size={37} color="#39493F"/>
 <path d="M180 575 H800" stroke="#AEB6A4"/>
 <g transform={`translate(65 25) scale(.85)`}><Rock width={660} height={340}/></g>
 <rect x={185} y={975} width={605} height={116} fill="#D5D9CA"/>
 <Ink x={211} y={1025} text="Fission fingerprints" size={32} color="#445446"/>
 <g opacity={clamp(p*2)}>{[0,1,2].map(i=><g key={i} transform={`translate(${570+i*65} 1050)`}><circle r={6} fill="#9B763E"/><path d="M-15 20 L0 7 L15 20" stroke="#7C8869" fill="none" strokeWidth={2}/></g>)}</g>
 </g>;
const Ancient=({p}:{p:number})=><g>
 <path d="M135 625 Q380 530 840 620 L840 740 Q350 700 135 765Z" fill="#668F94" opacity={.6}/>
 <path d="M135 715 Q400 670 840 735 L840 1090 H135Z" fill="#5E5140"/>
 <path d="M135 760 Q400 710 840 770 M135 860 Q400 810 840 870 M135 990 Q400 945 840 1000" stroke="#B6A47B" strokeOpacity={.5} strokeWidth={4} fill="none"/>
 {Array.from({length:48},(_,i)=>{const startX=155+rand(i)*650,startY=660+rand(i+100)*360,endX=295+rand(i+50)*385,endY=830+rand(i+200)*55,q=clamp(p*1.5);return <circle key={i} cx={startX*(1-q)+endX*q} cy={startY*(1-q)+endY*q} r={4+rand(i+10)*5} fill={i%3?'#AD935C':'#EDD296'} opacity={.8}/>;})}
 <path d="M270 845 Q500 825 700 845" fill="none" stroke="#D1AC61" strokeWidth={35} opacity={.16+clamp(p*2)*.24}/>
 <Ink x={170} y={1128} text="Ancient fuel. Concentrated naturally." size={29}/>
 </g>;
const Micro=({p,waterPhase}:{p:number;waterPhase:number})=>{
 const firstSplit=clamp(p/.25),wet=clamp((p-waterPhase)*5),t=clamp((p-waterPhase)/(.9-waterPhase)),travel=t<.18?t/.18*.36:.36+(t-.18)/.82*.64,x=260+travel*480,y=720+travel*260;
 return <g>
 <path d="M130 960 Q440 1120 850 955" stroke="#716048" strokeWidth={130} opacity={.18} fill="none"/>
 <Nucleus x={250} y={715} r={54} split={firstSplit}/><Nucleus x={740} y={980} r={55} split={clamp((travel-.87)*7)}/>
 <path d="M260 720 L430 812 L510 855 L575 891 L740 980" fill="none" stroke="#E0CA86" strokeDasharray="5 14" strokeWidth={3} opacity={.35}/>
 <g opacity={wet}>{[0,1,2].map(i=><g key={i} transform={`translate(${430+i*72.5} ${812+i*39.5})`}><circle r={43} fill="#82BFC7" opacity={.1} stroke="#93D9DD" strokeWidth={2}/><circle r={10} fill="#C7E8DF"/><Ink x={-9} y={-20} text="H" size={19} color="#B9D7D8"/></g>)}</g>
 <circle cx={x} cy={y} r={8} fill="#F2D697"/>
 <path d={`M${x-45*(1-wet*.75)} ${y-2} L${x-13} ${y}`} stroke="#E2C477" strokeWidth={3} opacity={.65}/>
 <Ink x={180} y={1140} text={wet>.5?'Slower neutrons. More likely splits.':'One split can cause another.'} size={30}/>
 </g>;
};
const Chain=({p,frame}:{p:number;frame:number})=><g>
 <Rock wet={.7} heat={.3}/>
 {[0,1,2].map(i=><g key={i}><circle cx={320+i*170} cy={800+i%2*70} r={18+((frame+i*20)%60)/4} fill="none" stroke="#EAC778" opacity={.4*(1-((frame+i*20)%60)/60)}/><path d={`M${320+i*170} ${800+i%2*70} Q${390+i*120} 780 ${490+i*80} ${870-i*20}`} stroke="#EBC974" strokeWidth={3} strokeDasharray="3 9" opacity={.65}/></g>)}
 <path d="M380 835 Q220 665 145 655 M555 840 Q700 725 835 680" stroke="#A5B1A8" strokeWidth={2} strokeDasharray="2 8" fill="none" opacity={.35}/>
 <circle cx={725} cy={760} r={13} fill="#8B978B" opacity={clamp(p*3)}/><circle cx={710} cy={782} r={5} fill="#C6D1BC" opacity={Math.max(0,1-p*3)}/>
 <Ink x={175} y={1130} text="Enough useful neutrons kept the chain going." size={27}/>
 </g>;
export const OkloRevisedWorld=({index,p,frame,waterPhase,feedback,feedbackProgress}:{index:number;p:number;frame:number;waterPhase:number;feedback:'evidence'|'heating'|'cooling';feedbackProgress:number})=>{
 const lab=index===1||index===2;
 const titles=['2 BILLION YEARS AGO','1972','THE CLUE WAS IN THE ROCK','REWIND INTO DEEP TIME','','','ONE STUDIED ZONE','EARTH HAD THE CONDITIONS'];
 const wet=index===6?(feedback==='cooling'?feedbackProgress:feedback==='heating'?1-feedbackProgress:.8):0;
 return <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
 <defs>
 <radialGradient id="v4-earth" cx=".25" cy=".2"><stop stopColor="#9BAB91"/><stop offset=".4" stopColor="#42676C"/><stop offset="1" stopColor="#162829"/></radialGradient>
 <radialGradient id="v4-night"><stop stopColor="#0D161A" stopOpacity=".15"/><stop offset="1" stopColor="#090F13" stopOpacity=".85"/></radialGradient>
 <clipPath id="v4-sphere"><circle r={330}/></clipPath>
 <linearGradient id="v4-rock" x2=".8" y2="1"><stop stopColor="#9E8869"/><stop offset=".55" stopColor="#695B44"/><stop offset="1" stopColor="#302820"/></linearGradient>
 <linearGradient id="v4-metal"><stop stopColor="#8D9997"/><stop offset=".4" stopColor="#D1D9D1"/><stop offset="1" stopColor="#5B6862"/></linearGradient>
 <radialGradient id="v4-heat"><stop stopColor="#EABD66" stopOpacity=".8"/><stop offset="1" stopColor="#B96C2C" stopOpacity="0"/></radialGradient>
 <linearGradient id="v4-field" x2="0" y2="1"><stop stopColor={lab?'#293B38':'#132225'}/><stop offset="1" stopColor="#0B1318"/></linearGradient>
 </defs>
 <rect width={1080} height={1920} fill="url(#v4-field)"/>
 <g data-critical="scene"><rect x={125} y={450} width={725} height={725} fill="transparent"/>
 {index===0||index===7?<Planet p={p} final={index===7}/>:index===1?<Laboratory p={p}/>:index===2?<Evidence p={p}/>:index===3?<Ancient p={p}/>:index===4?<Micro p={p} waterPhase={waterPhase}/>:index===5?<Chain p={p} frame={frame}/>:<g><Rock wet={wet} heat={feedback==='cooling'?.65*(1-feedbackProgress):feedback==='heating'?.35+.35*feedbackProgress:.3}/><Ink x={180} y={1125} text="Isotope-based reconstruction" size={31}/><g opacity={feedback==='evidence'?1:.45}><path d="M205 505 H785" stroke="#98B5AC" strokeWidth={2}/><Ink x={180} y={557} text="Water leaves. The chain stops." size={32}/><Ink x={180} y={602} text="Water returns. It can restart." size={32}/></g></g>}
 </g>
 {titles[index]&&<text data-critical="anchor" x={125} y={365} fontFamily="Manrope" fontSize={index===3?34:38} fontWeight={600} fill="#E4E9D9">{titles[index]}</text>}
 </svg>;
};
