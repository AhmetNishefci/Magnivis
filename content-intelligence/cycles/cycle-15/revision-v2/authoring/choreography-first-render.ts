import {smooth,pulse} from '../flytrap/model';
import type {V} from './geometry';
export const v2State=(scene:number,t:number)=>{
 let calcium=0,overlay=0,closure=0,bend=0,events:number[]=[],trial='',eye:V=[3.2,2.8,4.9],target:V=[0,.25,0],fov=.78;
 if(scene===0){eye=[3.1-.32*smooth(t,0,4),2.35,4.7];}
 if(scene===1){eye=[-1.6,1.3,2.9];target=[-.50,.30,.1];fov=.53;bend=.68*pulse(t,.65,1.45);events=[1.0];}
 if(scene===2){eye=[-1.6+3.4*smooth(t,0,3),1.3+3.3*smooth(t,0,3),2.9];target=[-.50+.50*smooth(t,0,3),.30,0];fov=.53+.25*smooth(t,0,3);overlay=smooth(t,.25,1.25);calcium=.76*smooth(t,.4,1.75);}
 if(scene===3){eye=[1.8-.25*smooth(t,0,5),4.6,2.9];overlay=1;calcium=.76-.48*smooth(t,.15,3.4);}
 if(scene===4){eye=[1.55,4.6-1.8*smooth(t,3.2,6.2),2.9+1.4*smooth(t,3.2,6.2)];overlay=1-smooth(t,5.1,6.2);calcium=.28+.72*smooth(t,.85,2.3);events=[.95];bend=.68*pulse(t,.6,1.4);closure=smooth(t,6.55,6.85);trial='Soon after';}
 if(scene===5){eye=[-2.7,3.8,4.2];overlay=1-smooth(t,3.2,3.7);calcium=.28*(1-smooth(t,.1,1.7))+.48*pulse(t,2.2,3.2);events=[2.25];bend=.68*pulse(t,2.05,2.75);trial='Separate trial · longer delay';}
 if(scene===6){eye=[-1.6+1.2*smooth(t,3.6,5.3),1.3+1.6*smooth(t,3.6,5.3),2.9+1.6*smooth(t,3.6,5.3)];target=[-.5+.5*smooth(t,3.6,5.3),.3,0];fov=.53+.25*smooth(t,3.6,5.3);bend=.72*smooth(t,.8,2.7)*(1-smooth(t,2.7,4.5));events=[1.4,3.5];closure=smooth(t,4.8,5.15);trial='Separate trial · one movement';}
 if(scene===7){eye=[2.6,3.2,4.9];overlay=.75*(1-smooth(t,.1,2.5));calcium=.28*(1-smooth(t,.1,2.5));trial=t<2.9?'First trial · retained state':'';}
 return {calcium,overlay,closure,bend,events,trial,eye,target,fov};
};
