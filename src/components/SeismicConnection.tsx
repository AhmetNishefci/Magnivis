const coastWest='M455 35L480 53L508 80L530 89L535 119L560 132L585 182L610 206L624 241L645 260';
const coastEast='M100 50L129 47L143 70L134 91L146 116L158 130L168 133L171 124L163 112L158 97L171 106L178 130L177 142L166 151L151 143L125 120L114 99L95 89';
export const SeismicConnection=({time,event=false,energy=false,ending=false}:{time:number;event?:boolean;energy?:boolean;ending?:boolean})=>{
 const progress=(time*.3)%1;
 return <svg viewBox="0 0 770 320">
  <defs><clipPath id="seismic-map"><rect x="40" y="20" width="675" height="265" rx="120"/></clipPath></defs>
  <g clipPath="url(#seismic-map)"><rect x="40" y="20" width="675" height="265" fill="#C9C2A7"/>
   {[80,130,180,230].map(y=><path key={y} d={`M40 ${y}Q385 ${y-25}715 ${y}`} stroke="#A9AA93" fill="none" strokeWidth="1"/>)}
   {[100,210,320,430,540,650].map(x=><path key={x} d={`M${x} 15Q${x-20} 140 ${x}285`} stroke="#A9AA93" fill="none" strokeWidth="1"/>)}
   <path d={`${coastEast}L67 190L40 170V20H170L100 50Z`} fill="#A18C6E"/>
   <path d={`${coastWest}L715 310V20H455Z`} fill="#A18C6E"/>
   <path d={coastEast} fill="none" stroke="#7C6D57" strokeWidth="2"/><path d={coastWest} fill="none" stroke="#7C6D57" strokeWidth="2"/>
   {!energy&&<path d="M184 134Q375 56 589 185" fill="none" stroke="#9A5A30" strokeWidth="3" strokeDasharray="5 8"/>}
   <circle cx="184" cy="134" r="8" fill="#A74F2E"/>
   {[0,1,2].map(i=><circle key={i} cx="184" cy="134" r={12+((time*13+i*10)%33)} stroke="#A74F2E" fill="none" strokeWidth="2" opacity={.4*(1-((time*13+i*10)%33)/33)}/>)}
   <circle cx="589" cy="185" r="8" fill="#205F66"/>
   {!energy&&<circle cx={184+405*progress} cy={134-120*progress+171*progress*progress} r="4" fill="#9A5A30"/>}
  </g>
  <text x="68" y="310" fill="#514B3F" fontSize="28">{event?'Kamchatka · M 8.8':'Kamchatka earthquake'}</text>
  <text x="505" y="310" fill="#205F66" fontSize="28">Nevada pool</text>
  {ending&&<text x="360" y="46" fill="#574D3E" fontSize="25" textAnchor="middle">One connected Earth</text>}
 </svg>;
};
export const EarthEnergy=({time}:{time:number})=>{
 const p=Math.min(1,time/1.8),r=255;
 return <svg viewBox="0 0 770 680"><defs><clipPath id="earth-cut"><path d="M640 340A255 255 0 1 1 130 340A255 255 0 1 1 640 340Z M585 340A200 200 0 1 1 185 340A200 200 0 1 1 585 340Z" clipRule="evenodd"/></clipPath><radialGradient id="earth-body"><stop stopColor="#BD9265"/><stop offset=".65" stopColor="#C0A681"/><stop offset="1" stopColor="#846E55"/></radialGradient></defs>
  <circle cx="385" cy="340" r={r} fill="url(#earth-body)"/><g clipPath="url(#earth-cut)">{[0,1,2,3].map(i=><circle key={i} cx="182" cy="186" r={((time*105+i*72)%540)} fill="none" stroke="#F6CE8B" strokeWidth="4" opacity=".45"/>)}<circle cx="385" cy="340" r="205" fill="none" stroke="#9C825F" strokeWidth="1"/></g>
  <path d="M182 186 A255 255 0 0 1 588 186" pathLength="1" fill="none" stroke="#E8B45C" strokeWidth="9" strokeDasharray={`${p} 1`}/>
  <circle cx="182" cy="186" r="10" fill="#A74F2E"/><circle cx="588" cy="186" r="10" fill="#205F66"/>
  <text x="80" y="141" fontSize="28" fill="#514B3F">Earthquake</text><text x="530" y="141" fontSize="28" fill="#205F66">Local ground</text>
  <text x="385" y="344" textAnchor="middle" fontSize="40" fill="#443E33">Seismic energy</text><text x="385" y="395" textAnchor="middle" fontSize="31" fill="#443E33">through solid Earth</text>
  <text x="385" y="649" textAnchor="middle" fontSize="27" fill="#62594A">Near-surface paths · schematic</text>
 </svg>;
};
