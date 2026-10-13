import type {Pose} from './choreography';
type V=[number,number,number];
const dot=(a:V,b:V)=>a.reduce((s,x,i)=>s+x*b[i]!,0);
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalized=(v:V):V=>{const length=Math.hypot(...v);return v.map(x=>x/length) as V;};
/** Conservative projected eight-corner envelope of the shader's fixed[-1,1] rounded cube.
 * Excludes decorative contact shadow; fully contains the inset face glyphs. */
export const projectedCubeBounds=(pose:Pose,view:number)=>{
 const camera:V=[2.9+(1.2-2.9)*view,3.3+(5.6-3.3)*view,5.8],forward=normalized(camera.map(x=>-x) as V),right=normalized(cross(forward,[0,1,0])),up=cross(right,forward),[a,b,c]=pose.rotation;
 const rotate=([x,y,z]:V):V=>{const y1=y*Math.cos(a)-z*Math.sin(a),z1=y*Math.sin(a)+z*Math.cos(a),x2=x*Math.cos(b)+z1*Math.sin(b),z2=-x*Math.sin(b)+z1*Math.cos(b);return [x2*Math.cos(c)-y1*Math.sin(c),x2*Math.sin(c)+y1*Math.cos(c),z2];};
 const corners=[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>{const w=rotate([x,y,z]),d=w.map((v,i)=>v-camera[i]!) as V,depth=dot(d,forward);return [pose.x+dot(d,right)/depth/.40*pose.size,pose.y-dot(d,up)/depth/.40*pose.size];})));
 const xs=corners.map(p=>p[0]!),ys=corners.map(p=>p[1]!);return {x:Math.min(...xs)-1,y:Math.min(...ys)-1,width:Math.max(...xs)-Math.min(...xs)+2,height:Math.max(...ys)-Math.min(...ys)+2};
};
