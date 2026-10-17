import React from 'react';
import {interpolate} from 'remotion';
const ivory='#f1efe7', brass='#d9b577', muted='#b4c3bd';
const smooth=(f:number,a:number,b:number)=>{const t=interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return t*t*(3-2*t);};
type Point=[number,number,number];
type Camera={scale:number;heading:number;originX:number;originY:number};
// Parallel oblique projection: the camera exposes both the deck and hull depth.
// These are illustrative volumes, not measured ship plans or naval engineering.
const project=([x,z,h]:Point,c:Camera):[number,number]=>{const a=c.heading*Math.PI/180,xx=x*Math.cos(a)+z*Math.sin(a),zz=z*Math.cos(a)-x*Math.sin(a);return [c.originX+c.scale*(xx*.93+zz*.54),c.originY+c.scale*(xx*.32-zz*.76-h*.95)];};
const coords=(points:Point[],c:Camera)=>points.map(p=>project(p,c).join(',')).join(' ');
const Line:React.FC<{points:Point[];camera:Camera;color?:string;width?:number;opacity?:number}>=({points,camera,color=ivory,width=2,opacity=1})=><polyline points={coords(points,camera)} stroke={color} strokeWidth={width} fill="none" opacity={opacity} strokeLinejoin="round"/>;
const Hull:React.FC<{camera:Camera;x?:number;z?:number;escort?:boolean;damage?:boolean;fuel?:number;sink?:number}>=({camera,x=0,z=0,escort=false,damage=false,fuel=0,sink=0})=>{
 const length=escort?370:620,beam=escort?47:126,deck=escort?35:49-sink,bow=length/2,stern=-length/2;
 const p=(a:number,b:number,h=deck):Point=>[x+a,z+b,h];
 const outline:Point[]=[p(-beam/2,stern+20),p(-beam/2,bow-95),p(-beam*.35,bow-30),p(0,bow),p(beam*.35,bow-30),p(beam/2,bow-95),p(beam/2,stern+20),p(beam*.3,stern),p(-beam*.3,stern)];
 const bottom=outline.map(([a,b])=>[a,b,0] as Point);
 const box=(a:number,b:number,w:number,l:number,h:number,key:string)=>{const q=[p(a-w/2,b-l/2),p(a-w/2,b+l/2),p(a+w/2,b+l/2),p(a+w/2,b-l/2)],top=q.map(([xx,zz])=>[xx,zz,deck+h] as Point);return <g key={key}><polygon points={coords([q[2]!,q[3]!,top[3]!,top[2]!],camera)} fill="#536566" stroke="#81928a"/><polygon points={coords([q[3]!,q[0]!,top[0]!,top[3]!],camera)} fill="#344b4e" stroke="#81928a"/><polygon points={coords(top,camera)} fill="#aeb7a5" stroke="#d2d5bf" strokeWidth={1.5}/></g>;};
 return <g data-qabounds="critical-visual" aria-label={escort?'Illustrative assisting warship':'Ohio: continuous damaged hull'}>
 <polygon points={coords(bottom.map(([a,b])=>[a+8,b-5,-4]),camera)} fill="#000d12" opacity={.6}/>
 <polygon points={coords([...outline,...bottom.slice().reverse()],camera)} fill="#19353d"/>
 {outline.map((p0,i)=>{const j=(i+1)%outline.length;return <polygon key={i} points={coords([p0,outline[j]!,bottom[j]!,bottom[i]!],camera)} fill={i>3?'#33494c':'#4b6262'} stroke="#6e8580" strokeWidth={1}/>;})}
 <polygon points={coords(outline,camera)} fill={escort?'#7a8e88':'#697b72'} stroke="#c2cbbc" strokeWidth={2}/>
 {!escort&&<>
 {[-190,-110,-30,50,130,210].map((b,i)=><g key={b}><polygon points={coords([p(-47,b-22),p(-47,b+22),p(47,b+22),p(47,b-22)],camera)} fill={fuel>.01?brass:'#536963'} opacity={fuel>.01?.65+.3*fuel:1}/><Line points={[p(-53,b),p(53,b)]} camera={camera} color="#b0baaa" width={2}/>{box(0,b,19,18,6,'hatch'+i)}</g>)}
 <Line points={[p(-20,-230,deck+9),p(-20,245,deck+9)]} camera={camera} color="#d1c6a7" width={4}/><Line points={[p(20,-230,deck+9),p(20,245,deck+9)]} camera={camera} color="#aeb7a5" width={3}/>
 </>}
 {box(0,escort?-45:-90,escort?39:106,escort?52:68,escort?34:44,'bridge')}
 <Line points={[p(-beam*.33,escort?-69:-116,deck+32),p(beam*.33,escort?-69:-116,deck+32)]} camera={camera} color="#203d44" width={7}/>
 {box(0,escort?-116:-234,escort?22:40,escort?28:50,escort?52:68,'funnel')}
 <Line points={[p(0,escort?0:100),p(0,escort?0:100,deck+112)]} camera={camera} color="#c6c9b5" width={3}/>
 <Line points={[p(-26,escort?0:100,deck+78),p(26,escort?0:100,deck+78)]} camera={camera} color="#a8b6a7"/>
 <Line points={[p(0,bow-55),p(0,escort?0:100,deck+100),p(0,stern+40)]} camera={camera} color="#8d9f93" width={1}/>
 {escort&&[100,-145].map(b=>box(0,b,24,28,17,'turret'+b))}
 <Line points={[p(-beam/2,stern+25,deck+9),p(-beam/2,bow-100,deck+9),p(0,bow,deck+9),p(beam/2,bow-100,deck+9),p(beam/2,stern+25,deck+9)]} camera={camera} color="#c4c7b1" width={1.5}/>
 {damage&&<><polygon points={coords([p(-55,22),p(-21,5),p(-9,33),p(25,11),p(55,28),p(54,56),p(12,40),p(-24,59),p(-55,43)],camera)} fill="#203c3e"/><Line points={[p(-55,32),p(-20,16),p(-9,43),p(23,21),p(55,39)]} camera={camera} color="#a57c65" width={4}/><Line points={[p(63,30,deck),p(63,16,deck*.6),p(63,42,5)]} camera={camera} color="#967362" width={4}/></>}
 {fuel>0&&<polygon points={coords([p(63,-175,6),p(63,225,6),p(63,225,deck*.68),p(63,-175,deck*.68)],camera)} fill={brass} opacity={fuel*.75} stroke="#e7ce92" strokeWidth={2}/>}
 </g>;
};
const Title:React.FC<{children:React.ReactNode;sub?:string|undefined}>=({children,sub})=><><div data-qabounds="critical" style={{position:'absolute',left:112,top:320,fontSize:52,fontWeight:600,lineHeight:1.25,whiteSpace:'pre-line'}}>{children}</div>{sub&&<div data-qabounds="critical" style={{position:'absolute',left:112,top:468,fontSize:34,color:brass}}>{sub}</div>}</>;
const Note:React.FC<{children:React.ReactNode}>=({children})=><div data-qabounds="disclosure" style={{position:'absolute',left:112,top:1335,fontSize:32,lineHeight:1.25,color:muted,whiteSpace:'pre-line'}}>{children}</div>;
export const RescueSequence:React.FC<{phase:'disabled'|'tow'|'joined';f:number}>=({phase,f})=>{
 const joined=phase==='joined',tow=phase!=='disabled',join=joined?smooth(f,8,100):0;
 const yaw=phase==='tow'?Math.sin(f/33)*10:joined?Math.sin(f/33)*3*(1-join):0;
 const pull=joined?smooth(f,78,165):0;
 const camera:Camera={scale:1.10-pull*.08,heading:-9,originX:485,originY:945+pull*12};
 const shipCamera={...camera,heading:camera.heading+yaw};
 const afloat=phase==='disabled'?smooth(f,10,72):1;
 const towsOpacity=tow?(joined?1:smooth(f,0,25)):0;
 const sideOffset=245-join*151;
 return <><Title sub={phase==='disabled'?'Flooding threatens the damaged ship':undefined}>{phase==='disabled'?'Engines fail.\nWater comes in.':phase==='tow'?'A powerless tanker.\nA difficult tow.':'Bring the warships\nalongside.'}</Title>
 <svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}>
 <defs><radialGradient id="waterlight"><stop stopColor="#83aaa5" stopOpacity=".17"/><stop offset="1" stopColor="#83aaa5" stopOpacity="0"/></radialGradient></defs>
 <ellipse cx={510} cy={1000} rx={410} ry={310} fill="url(#waterlight)"/>
 {/* Traces show control difficulty, not a measured route. */}
 {phase==='tow'&&<g opacity={.22}><Line points={[[0,-385,0],[0,610,0]]} camera={camera} color="#bfd6c4" width={2}/>{[-1,1].map(n=><Line key={n} points={[[n*85,-340,0],[n*110,-290,0],[n*80,-230,0]]} camera={shipCamera} color="#a0c3ba" width={3}/>)}</g>}
 <g opacity={towsOpacity}>
 {[-1,1].map(n=><g key={n}>
 <polyline points={[project([n*40,280,24],shipCamera),project([n*115,315,5],camera),project([n*120,337,22],camera)].map(p=>p.join(',')).join(' ')} stroke={brass} strokeWidth={3} fill="none"/>
 <Hull camera={{...camera,scale:camera.scale*.45,originX:project([n*120,420,0],camera)[0],originY:project([n*120,420,0],camera)[1]}} escort/>
 <Line points={[[n*140,337,0],[n*145,310,0],[n*157,290,0]]} camera={camera} color="#afcac0" width={2} opacity={.35}/>
 </g>)}
 </g>
 {/* Far escort first, tanker next, near escort last: visible depth and hull contact. */}
 {joined&&<Hull camera={camera} x={-sideOffset} z={-20} escort/>}
 <Hull camera={shipCamera} damage sink={afloat*11}/>
 {joined&&<g opacity={smooth(f,88,114)}>{[-100,90].flatMap(z=>[-1,1].map(n=><Line key={z+':'+n} points={[[n*61,z,38],[n*73,z+12,35]]} camera={camera} color={brass} width={4}/>))}</g>}
 {joined&&<Hull camera={camera} x={sideOffset} z={-20} escort/>}
 {phase==='disabled'&&<><g opacity={1-afloat}><Line points={[[0,-320,0],[10,-405,0],[-3,-460,0]]} camera={camera} color="#b4d1c3" width={5}/></g><g opacity={afloat}><Line points={[[66,-90,9],[74,-18,9],[70,60,9],[63,130,9]]} camera={camera} color="#77a9b1" width={8}/></g></>}
 {tow&&<text data-qabounds="critical" x={112} y={574} fill={brass} fontFamily="Manrope" fontSize={32}>Tow vessels</text>}
 </svg>
 <div data-qabounds="critical" style={{position:'absolute',left:112,top:1240,fontSize:36,color:joined?ivory:brass}}>{phase==='disabled'?'No propulsion. The cargo still aboard.':phase==='tow'?'The damaged hull cannot steer reliably.':'Ohio · destroyers secured on both sides'}</div>
 <Note>{'Original reconstruction · time compressed\nShip forms, damage and lines illustrative'}</Note></>;
};
export const FuelPayoff:React.FC<{f:number}>=({f})=>{
 const reveal=smooth(f,10,56),connect=smooth(f,30,70);
 const camera:Camera={scale:1.34,heading:-9,originX:476,originY:909};
 return <><Title>{'Battered hull.\nPrecious cargo.'}</Title>
 <svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}>
 <Hull camera={camera} damage sink={11} fuel={reveal}/>
 <g opacity={reveal}><path d="M390 638H622V764" stroke={brass} strokeWidth={3} fill="none"/><circle cx={622} cy={764} r={6} fill={brass}/><text data-qabounds="critical" x={112} y={650} fill={brass} fontFamily="Manrope" fontSize={40}>Surviving fuel</text></g>
 <g opacity={connect}><path d="M534 950H670V1104H706" stroke={brass} strokeWidth={3} fill="none"/><circle cx={534} cy={950} r={5} fill={brass}/></g>
 <g opacity={connect} data-qabounds="critical-visual" aria-label="Conceptual aircraft: fuel helped Malta continue air operations" transform="translate(770 1104)"><path d="M0-60L8-20 64 8 62 20 9 4 8 40 26 52 25 60 0 53-25 60-26 52-8 40-9 4-62 20-64 8-8-20Z" fill={ivory}/></g>
 </svg>
 <div data-qabounds="critical" style={{position:'absolute',left:112,top:1280,fontSize:34,color:ivory,opacity:connect}}>Fuel for Malta’s continued air operations.</div>
 <Note>{'Original reconstruction · fuel highlighted\nCargo space and aircraft symbolic'}</Note></>;
};
