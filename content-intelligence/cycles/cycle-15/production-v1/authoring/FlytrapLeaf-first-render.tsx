import React from 'react';
import {Img,staticFile} from 'remotion';
type Props={closure:number;bend:number;signalAge:number|null;tissue:number;calcium:number;probe:number;time:number};
/** A generated surface plate is articulated around its midrib; six hairs are
 * authored independently so one physical bend cannot silently become two touches. */
export const FlytrapLeaf:React.FC<Props>=({closure,bend,signalAge,tissue,calcium,probe,time})=>{
 const angle=closure*86;
 return <div style={{position:'relative',width:820,height:820,perspective:1250,transform:'rotate(-8deg)'}}>
 {[0,1].map(side=><div key={side} style={{position:'absolute',left:side*410,top:0,width:410,height:820,overflow:'hidden',opacity:1-tissue,transformOrigin:side?'left center':'right center',transform:`rotateY(${side?-angle:angle}deg)`,filter:`brightness(${1-closure*.19})`,backfaceVisibility:'hidden'}}>
 <Img src={staticFile('images/flytrap/open-leaf.png')} style={{position:'absolute',width:820,height:820,maxWidth:'none',left:side?-410:0}}/>
 <svg width="820" height="820" viewBox="0 0 820 820" style={{position:'absolute',left:side?-410:0}}>
 {side===0&&probe>0&&<path d={`M-130 ${305+bend*37} L${283+bend*83} ${305+bend*37}`} fill="none" stroke="#b4a98d" strokeWidth="5" strokeLinecap="round" opacity={probe}/>}
 {[0,1,2].map(i=>{const x=side?515+(i===1?45:0):305-(i===1?45:0),y=285+i*125,selected=side===0&&i===1,b=selected?bend:0,dx=side?-23:23;return <g key={i}>
 <ellipse cx={x} cy={y+4} rx="15" ry="7" fill="#3e3320" opacity=".5"/>
 <path d={`M${x} ${y} Q${x+dx+b*36} ${y-42} ${x+dx+b*83} ${y-105+b*37}`} fill="none" stroke="#402e19" strokeWidth="7" strokeLinecap="round"/>
 <path d={`M${x-1} ${y-2} Q${x+dx+b*36-1} ${y-42} ${x+dx+b*83} ${y-105+b*37}`} fill="none" stroke="#d7b47f" strokeWidth="2" strokeLinecap="round"/>
 </g>;})}
 {signalAge!==null&&signalAge>=0&&signalAge<1.25&&<g opacity={Math.sin(Math.min(1,signalAge/1.25)*Math.PI)*.95}><ellipse cx="260" cy="410" rx={20+signalAge*390} ry={10+signalAge*260} fill="none" stroke="#daf5f0" strokeWidth="4" strokeDasharray="18 11"/></g>}
 </svg></div>)}
 {tissue>0&&<svg width="1080" height="1080" viewBox="0 0 820 820" style={{position:'absolute',left:-130,top:-130,opacity:tissue,transformOrigin:'35% 50%',transform:`scale(${.4+tissue*.6})`}}>
 <defs><radialGradient id="tissue-field"><stop stopColor="#69886a"/><stop offset="1" stopColor="#243c2c" stopOpacity="0"/></radialGradient><radialGradient id="calcium"><stop stopColor="#ffd39a"/><stop offset=".65" stopColor="#ecab65"/><stop offset="1" stopColor="#af8054" stopOpacity="0"/></radialGradient><mask id="tissue-window"><rect width="820" height="820" fill="url(#tissue-mask)"/></mask><radialGradient id="tissue-mask"><stop offset=".62" stopColor="white"/><stop offset="1" stopColor="black"/></radialGradient></defs>
 <g mask="url(#tissue-window)"><rect width="820" height="820" fill="url(#tissue-field)"/>
 {Array.from({length:42},(_,i)=>{const row=Math.floor(i/6),col=i%6,x=5+col*145+(row%2)*65+Math.sin(i*9)*10,y=-20+row*145+Math.cos(i*3)*10,variation=.82+.18*Math.sin(i*4.5),rotation=Math.sin(i*5)*12,breath=1+.012*Math.sin(time*.65+i);return <g key={i} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${breath})`}>
 <path d="M-64 -39 Q-69 -64 -28 -67 L31 -64 Q71 -49 63 8 L54 48 Q10 73 -45 57 Q-78 24 -64 -39" fill="#86a67c" fillOpacity=".3" stroke="#cfdaa9" strokeOpacity=".48" strokeWidth="2"/>
 <path d="M-61 -37 Q-65 -58 -25 -62 L30 -60 Q64 -47 58 8 L49 45 Q8 66 -42 53 Q-70 23 -61 -37" fill="none" stroke="#182e23" strokeOpacity=".65" strokeWidth="3"/>
 <ellipse cx="0" cy="-3" rx={54+calcium*9} ry={52+calcium*10} fill="url(#calcium)" opacity={calcium*variation}/>
 <ellipse cx="31" cy="31" rx="9" ry="13" fill="#a6b497" opacity=".24"/>
 {Array.from({length:14},(_,j)=><ellipse key={j} cx={Math.sin(i*2+j*3)*47} cy={Math.cos(i+j*2)*45} rx="3" ry="6" transform={`rotate(${j*40})`} fill="#a4b78b" opacity=".2"/>)}
 </g>;})}
 {signalAge!==null&&signalAge>=0&&signalAge<1.25&&<ellipse cx="260" cy="410" rx={20+signalAge*390} ry={10+signalAge*260} fill="none" stroke="#d5f4f0" strokeOpacity={Math.sin(signalAge/1.25*Math.PI)} strokeWidth="5" strokeDasharray="18 11"/>}
 </g></svg>}
 </div>;
};
