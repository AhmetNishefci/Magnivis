import {Composition,registerRoot,getInputProps,Img,delayRender,continueRender,cancelRender} from 'remotion';
import {useState,useEffect} from 'react';
import '../styles.css';
type PreviewProps={label:string;surface:string;geometryNote:string;insets:{top:number;right:number;bottom:number;left:number}|null;frames:{image:string;label:string}[];cover:string|null};
export const PhantomTrafficPresentationModel=({label,surface,geometryNote,insets,frames,cover}:PreviewProps)=>{
 const [handle]=useState(()=>delayRender('Wait for local model fonts'));
 useEffect(()=>{
  Promise.all([document.fonts.load('700 32px Manrope'),document.fonts.load('400 21px Manrope')]).then(()=>document.fonts.ready).then(()=>continueRender(handle)).catch(error=>cancelRender(error));
 },[handle]);
 const cards=[...frames,...(cover?[{image:cover,label:'Instagram cover candidate — crop unmeasured'}]:[])];
 return <div style={{width:1480,height:cards.length>8?2520:1770,background:'#071019',color:'#e3e8e7',fontFamily:'Manrope',padding:30,boxSizing:'border-box'}}>
  <div style={{fontSize:32,fontWeight:800,color:'#edce8d'}}>LOCAL MODEL · PROVISIONAL · REAL-DEVICE REQUIRED</div>
  <div style={{fontSize:28,marginTop:10}}>{label} · {surface}</div>
  <div style={{fontSize:21,marginTop:8,color:'#b1c2c4'}}>{geometryNote}</div>
  <div style={{fontSize:20,marginTop:7,color:'#b1c2c4'}}>Amber = existing modeled insets only. Cyan = authored critical action. Caption/native exclusion geometry remains unknown.</div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(4, 340px)',gap:15,marginTop:30}}>
   {cards.map((card,i)=><div key={i}>
    <div style={{fontSize:18,height:49,lineHeight:1.3}}>{card.label}</div>
    <div style={{width:340,height:604.444,position:'relative',overflow:'hidden',background:'#03080d'}}>
     <Img src={card.image} style={{position:'absolute',width:'100%',height:'100%',objectFit:'contain'}}/>
     {i<frames.length&&insets&&<svg width="340" height="604.444" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      <path d={`M0 0H1080V1920H0Z M${insets.left} ${insets.top}V${1920-insets.bottom}H${1080-insets.right}V${insets.top}Z`} fill="#edb569" fillRule="evenodd" opacity=".2"/>
      <rect x={insets.left} y={insets.top} width={1080-insets.left-insets.right} height={1920-insets.top-insets.bottom} fill="none" stroke="#f1c075" strokeWidth="5" strokeDasharray="15 12"/>
      <rect x="130" y="345" width="730" height="1000" fill="none" stroke="#82c9d4" strokeWidth="3" opacity=".7"/>
      <rect x="110" y="1418" width="754" height="166" fill="none" stroke="#cfbdf1" strokeWidth="3" opacity=".8"/>
     </svg>}
    </div>
   </div>)}
  </div>
  <div style={{fontSize:23,color:'#e7c681',marginTop:30}}>No simulated native buttons or device screenshots. Unknown crops are not modeled. Nothing here grants platform approval.</div>
 </div>;
};
const Root=()=>{const props=getInputProps() as PreviewProps;return <Composition id="PhantomTraffic-Presentation-Model" component={PhantomTrafficPresentationModel} defaultProps={props} durationInFrames={1} fps={30} width={1480} height={props.cover?2520:1770}/>;};
registerRoot(Root);
