export type Point3=[number,number,number];
const subtract=(a:Point3,b:Point3):Point3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dot=(a:Point3,b:Point3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const unit=(a:Point3):Point3=>{const d=Math.hypot(...a);return [a[0]/d,a[1]/d,a[2]/d];};
const cross=(a:Point3,b:Point3):Point3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// Same camera as the original shader; overlays refer to world locations, not arbitrary screen slots.
export const projectDevilsHole=(p:Point3,time:number,zoom:number)=>{
 const ro:Point3=[.85+.12*Math.sin(time*.2),.95,5.5],forward=unit(subtract([-.04,-.22,0],ro)),right=unit(cross(forward,[0,1,0])),up=cross(right,forward),v=subtract(p,ro),depth=dot(v,forward);
 return {x:500+dot(v,right)/depth*540/.62*zoom,y:810-dot(v,up)/depth*510/.62*zoom};
};
