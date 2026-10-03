const ember='#F19161',stone='#C3B7C1';
/** Qualitative flames: original illustration, no combustion/architecture simulation. */
export const Fire=({x,y,width=80,height=140,time=0,opacity=1}:{x:number;y:number;width?:number;height?:number;time?:number;opacity?:number})=><g transform={`translate(${x} ${y})`} opacity={opacity}>{[0,1,2,3,4].map(i=>{const sway=Math.sin(time*2+i)*9,h=height*(.65+.2*Math.sin(time+i));return <path key={i} d={`M${i*width/5} 0 Q${i*width/5-20} ${-h*.4} ${i*width/5+sway} ${-h} Q${i*width/5+25} ${-h*.4} ${i*width/5+width*.32} 0 Z`} fill={i%2?'#FFC483':ember} opacity={.72}/>;})}</g>;
export const OldPalace=({time=0,burning=false,ruined=false}:{time?:number;burning?:boolean;ruined?:boolean})=><g>
 <path d="M120 1080 L120 800 L180 742 L235 800 L235 720 L330 655 L425 720 L425 890 L505 890 L505 773 L595 705 L685 773 L685 850 L760 850 L760 735 L820 682 L875 735 L875 1080 Z" fill={ruined?'#3C303A':'#463541'} stroke={stone} strokeWidth={4}/>
 <path d="M235 720 L330 655 L425 720 M505 773 L595 705 L685 773 M760 735 L820 682 L875 735" fill="none" stroke="#E0D2DC" strokeWidth={5}/>
 {Array.from({length:13},(_,i)=><path key={i} d={`M${142+i*54} 945 L${142+i*54} 882 Q${153+i*54} 860 ${164+i*54} 882 L${164+i*54} 945 Z`} fill={burning?'#ED925B':'#231D2C'} stroke={stone} opacity={ruined?.3:.8} strokeWidth={2}/>)}
 <path d="M120 1090 L880 1090 M120 1040 L880 1040" stroke={stone} strokeWidth={3}/>
 {burning&&[250,390,530,640,755].map((x,i)=><Fire key={x} x={x} y={850+(i%2)*95} width={80} height={210} time={time+i}/>)}
 </g>;
export const FurnaceSection=({time,smoke=false,breakthrough=false,feed=0}:{time:number;smoke?:boolean;breakthrough?:boolean;feed?:number})=><g>
 <rect x={180} y={510} width={650} height={455} rx={4} fill="#322A3B" stroke={stone} strokeWidth={4}/>
 <path d="M180 965 H830 M180 995 H830 M300 1045 H735 V1180 H300 Z" fill="#5D4550" stroke={stone} strokeWidth={5}/>
 <path d="M600 1110 H752 V990 H665 V750" fill="none" stroke="#BFA9B0" strokeWidth={36}/>
 <path d="M600 1110 H752 V990 H665 V750" fill="none" stroke="#201C29" strokeWidth={26}/>
 <path d="M235 905 H600 M250 880 H600 M300 840 H600" stroke="#9C7C86" strokeWidth={16}/>
 <rect x={335} y={1070} width={220} height={100} rx={5} fill="#271923" stroke="#D08E70" strokeWidth={3}/>
 <Fire x={373} y={1153} width={132} height={90} time={time}/>
 {feed>0&&<g transform={`translate(${230+feed*120} ${1060+feed*42}) rotate(${-feed*15})`}><path d="M0 0 H165 M0 13 H150 M15 28 H172" stroke="#CB9865" strokeWidth={11}/></g>}
 {smoke&&Array.from({length:8},(_,i)=>{const u=(time*.14+i/8)%1;return <ellipse key={i} cx={665+Math.sin(i+time)*13} cy={1000-u*450} rx={19+u*28} ry={18+u*13} fill="#C6ACB3" opacity={.14*(1-u)}/>;})}
 {breakthrough&&<Fire x={604} y={969} width={120} height={270} time={time}/>}
 </g>;
