export const codeGeometry={width:240,sectionHeight:64,joinedHeight:192,destinationWidth:270,destinationHeight:104,destinationX:570,destinationYs:[620,855,1090],codeX:585,codeYs:[640,875,1110],routeX:500} as const;
export const smooth=(f:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(f-a)/(b-a)));return t*t*(3-2*t);};
/** All positions are in the same conceptual memory coordinate system; no section scaling. */
export const codePosition=(scene:number,f:number,index:number)=>{
 if(scene===2){const t=smooth(f,15,80);return {x:175+125*t,y:670-60*t+index*64};}
 if(scene===3){const t=smooth(f,0,30);return {x:300+285*t,y:610+30*t+index*64};}
 const t=smooth(f,20,70);return {x:585,y:(640+index*64)*(1-t)+codeGeometry.codeYs[index]!*t};
};
export const referenceBranch=(index:number)=>({start:{x:500,y:codeGeometry.codeYs[index]!+32},end:{x:585,y:codeGeometry.codeYs[index]!+32}});
export const SCIENCE_START_FRAME=1143; // Source cue7 inter-sentence silence ends at5.193–5.197s +32.9s.
