// Original explanatory geometry, never an archival scan or measured cross-section.
export const clampProgress=(n:number)=>Math.max(0,Math.min(1,n));
export const reveal=(t:number,start=0,length=.7)=>1-(1-clampProgress((t-start)/length))**3;
const networks:[string[],string[]]=[['M10 40L110 110L135 70L245 110L315 60L430 120L510 65L650 105','M110 110L90 210L160 275L140 355','M245 110L270 230L345 260L330 370','M430 120L410 220L490 290L470 380','M0 240L90 210L270 230L410 220L650 260'],['M0 90L80 120L150 50L260 95L340 45L440 85L560 40L650 70','M80 120L120 235L80 350','M260 95L235 195L285 310L270 380','M440 85L475 225L410 300L445 380','M0 270L120 235L235 195L475 225L650 185']];
export const CrackNetwork=({which,progress,color}:{which:0|1;progress:number;color:string})=><g>{networks[which].map((d,i)=><path key={d} d={d} fill="none" stroke={color} strokeWidth={3} pathLength="1" strokeDasharray="1" strokeDashoffset={1-clampProgress(progress*1.5-i*.1)}/>)}</g>;
export const PaintLayerModel=({t,mode}:{t:number;mode:'manufacture'|'networks'|'resolve'})=>{
 const separated=mode==='manufacture'?reveal(t,1,.9):reveal(t,0,1),upperY=95-separated*25,lowerY=220+separated*80;
 const cracks=mode==='manufacture'?reveal(t,5.7,1.8):reveal(t,.7,1.8);
 return <svg width="730" height="660" viewBox="0 0 730 660">
 <defs><pattern id={`weave-${mode}`} width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#B8A68A"/><path d="M0 6H12M6 0V12" stroke="#86735D" strokeWidth="1"/></pattern><linearGradient id={`paint-${mode}`} x2="0" y2="1"><stop stopColor={mode==='manufacture'&&t>2&&t<5.7?'#D68B58':'#C6AA87'}/><stop offset="1" stopColor="#826B51"/></linearGradient></defs>
 <g transform={`translate(40 ${lowerY})`}><path d="M0 0H580L650 45V210L70 220L0 180Z" fill={`url(#weave-${mode})`} stroke="#CBBDA5" strokeWidth="2"/><path d="M0 0H580L650 45L70 55Z" fill="#8A8473"/>{mode!=='manufacture'&&<g transform="translate(4 12) scale(.92 .48)"><CrackNetwork which={1} progress={cracks} color="#B9E2E0"/></g>}<text data-critical="layer-label" x="0" y="265" fontSize="35" fill="#F1EBDF">{mode==='networks'?'OLD LAYERS UNDERNEATH':'OLD CANVAS'}</text></g>
 <g transform={`translate(40 ${upperY})`}><path d="M0 0H580L650 45L70 55Z" fill={`url(#paint-${mode})`} stroke="#F0D4A6" strokeWidth="2"/><path d="M70 55L650 45V65L70 75Z" fill="#826D58"/><g transform="translate(5 5) scale(.91 .13)"><CrackNetwork which={0} progress={cracks} color="#302C28"/></g><text data-critical="layer-label" x="0" y="-28" fontSize="35" fill="#F1EBDF">{mode==='resolve'?'NEWER PAINT':'SURFACE PAINT'}</text></g>
 {mode==='manufacture'&&<g opacity={reveal(t,2,1)}><path d="M580 180Q620 150 580 120M615 195Q655 160 615 125" fill="none" stroke="#D78D62" strokeWidth="5" strokeDasharray="140" strokeDashoffset={140*(1-reveal(t,2,1))}/><text x="40" y="580" fontSize="36" fill="#F1EBDF">{t<5.7?'Heat hardens the resin':'Mechanical cracking imitates age'}</text></g>}
 {mode==='networks'&&<><path d="M40 545H680" stroke="#7A7772" strokeWidth="2"/><text x="40" y="595" fontSize="36" fill="#F1EBDF">Two different crack networks</text></>}
 {mode==='resolve'&&<text x="40" y="595" fontSize="38" fill="#F1EBDF">The support’s age ≠ the paint’s age</text>}
 </svg>;
};
