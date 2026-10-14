/** Authored qualitative demonstrations, not a fitted experimental calcium model.
 * Values control illustrative color only. Actual biology has variable thresholds,
 * timing, regional responses and stimulus-to-action-potential mapping. */
export const smooth=(t:number,a:number,b:number)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
export const pulse=(t:number,a:number,b:number)=>smooth(t,a,a+.18)*(1-smooth(t,b,b+.24));
export function flytrapState(scene:number,t:number){
 let tissue=0,calcium=0,closure=0,bend=0,events:number[]=[],trial='';
 if(scene===0){bend=.15*Math.sin(t*1.1);}
 if(scene===1){bend=.8*pulse(t,.55,1.25);events=[1];}
 if(scene===2){tissue=smooth(t,0,1.1);calcium=.76*smooth(t,.3,1.65);}
 if(scene===3){tissue=1;calcium=.76-.45*smooth(t,.25,3.2);}
 if(scene===4){tissue=1-smooth(t,5.35,6.15);calcium=.31+.69*smooth(t,.75,2.25);events=[.85];bend=.8*pulse(t,.5,1.2);closure=smooth(t,6.05,6.35);trial='Soon after';}
 if(scene===5){trial='Separate trial · longer delay';tissue=1-smooth(t,3.1,3.65);calcium=.31*(1-smooth(t,.1,1.75))+.55*pulse(t,2.15,3.4);events=[2.2];bend=.8*pulse(t,2,2.65);}
 if(scene===6){trial='Separate trial · one movement';bend=.85*smooth(t,.85,2.75)*(1-smooth(t,2.75,4.65));events=[1.5,3.55];closure=smooth(t,4.8,5.1);}
 if(scene===7){trial=t<3?'First trial · after one signal':'';tissue=.36*(1-smooth(t,.15,2.3));calcium=.31*(1-smooth(t,.15,2.3));bend=.1*Math.sin(t*.8);}
 return {tissue,calcium,closure,bend,events,trial};
}
