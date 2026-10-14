import {smooth} from '../flytrap/model';
export type Shot='whole'|'macro'|'first'|'bridge'|'recent'|'closure'|'single'|'context';
export const v3State=(scene:number,t:number)=>{
 const shiftX=0;
 let shot:Shot='whole',calcium=0,residue=0,scale=1,shiftY=0,trial='',stateLabel='',signal=0,transition=0;
 if(scene===0){shot=t<1.0?'context':'whole';scale=1.04;}
 if(scene===1)shot='first';
 if(scene===2){shot=t<1.15?'bridge':'macro';transition=smooth(t,.15,1.15);calcium=.76*smooth(t,1.15,2.5);scale=1.05+.16*smooth(t,1.2,3.3);shiftY=-25;}
 if(scene===3){shot=t<2.65?'macro':'whole';calcium=.76-.48*smooth(t,.1,3.3);residue=calcium;scale=shot==='macro'?1.21-.08*smooth(t,0,2.65):1.0;stateLabel='A response remains';}
 if(scene===4){trial='Illustrative trial · soon after';shot=t<1.4?'recent':t<3.8?'macro':t<5.65?'whole':'closure';residue=.28;calcium=t<1.4?.28:.28+.72*smooth(t,1.4,3.4);scale=shot==='macro'?1.13:1;signal=t>1.4&&t<1.9?1:0;stateLabel=shot==='closure'?'Observed closure · separate specimen':t<1.4?'Recent stimulation':'Builds on the retained response';}
 if(scene===5){trial='Separate illustrative trial · longer delay';shot=t<1.8?'macro':'whole';residue=.28*(1-smooth(t,.05,1.65));calcium=residue+.42*smooth(t,2.05,2.45)*(1-smooth(t,2.75,3.4));scale=shot==='macro'?1.13:1;signal=t>2.05&&t<2.55?1:0;stateLabel=t<1.8?'The retained response fades':t<3.4?'Later signal · smaller response':'Still open';}
 if(scene===6){shot='single';trial='Single-movement experiment';signal=t>1.3&&t<2.0?1:t>3.7&&t<4.4?2:0;stateLabel=signal?'Electrical signals · schematic timing':'';}
 if(scene===7){shot=t<3.2?'macro':'context';residue=.28*(1-smooth(t,.1,2.55));calcium=residue;trial=t<3.2?'Return to the retained state':'';scale=1.10;}
 return {shot,calcium,residue,scale,shiftX,shiftY,trial,stateLabel,signal,transition};
};
export const chemistryEligible=(shot:Shot)=>shot==='whole'||shot==='macro';
