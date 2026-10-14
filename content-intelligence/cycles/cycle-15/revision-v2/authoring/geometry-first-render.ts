/** Qualitative botanical surface, not a measured morphology or mechanics model.
 * Three hairs per lobe; rigid tapered levers pivot near their bases (Burri S2).
 * Closed form changes curvature as well as hinge angle. */
export type V=[number,number,number];
export const add=(a:V,b:V):V=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const sub=(a:V,b:V):V=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const mul=(a:V,s:number):V=>[a[0]*s,a[1]*s,a[2]*s];
export const dot=(a:V,b:V)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=(a:V)=>mul(a,1/(Math.hypot(...a)||1));
export const hinge=(p:V,side:number,closure:number):V=>{const a=side*(.24+closure*1.26),c=Math.cos(a),s=Math.sin(a);return [p[0]*c-(p[1]-.09)*s,p[0]*s+(p[1]-.09)*c+.09,p[2]];};
const raw=(r:number,a:number,side:number,c:number):V=>[side*.98*r*Math.cos(a),.09+.22*(1-1.25*c)*r*r*(.6+.4*Math.cos(a)),1.55*r*Math.sin(a)];
export const surface=(r:number,a:number,side:number,c:number)=>hinge(raw(r,a,side,c),side,c);
type Vertex={p:V;n:V;uv:[number,number];kind:number};
const vertex=(r:number,a:number,s:number,c:number):Vertex=>{const p=surface(r,a,s,c),du=sub(surface(r+.002,a,s,c),p),dv=sub(surface(r,a+.002,s,c),p);let normal=norm(cross(du,dv));if(s>0)normal=mul(normal,-1);const flat=raw(r,a,s,c);return {p,n:normal,uv:[.5+flat[0]/2.5,.51-flat[2]/3.7],kind:0};};
export const hairRoots=[{r:.63,a:-.8},{r:.64,a:.02},{r:.58,a:.85}] as const;
export const hairPoints=(side:number,index:number,closure:number,bend:number)=>{const h=hairRoots[index]!,p=raw(h.r,h.a,side,closure),a=side===-1&&index===1?bend*.62:0;
 return {base:hinge(p,side,closure),tip:hinge(add(p,[Math.sin(a)*.4,Math.cos(a)*.4,0]),side,closure)};};
export const buildBotanicalMesh=(closure:number,bend:number,probe:boolean,signalAge:number|null)=>{
 const out:number[]=[];
 const push=(v:Vertex)=>out.push(...v.p,...v.n,...v.uv,v.kind);
 const tri=(a:Vertex,b:Vertex,c:Vertex)=>{push(a);push(b);push(c);};
 const tube=(a:V,b:V,ra:number,rb:number,kind:number)=>{const tangent=norm(sub(b,a)),u=norm(cross(tangent,Math.abs(tangent[1])>.8?[1,0,0]:[0,1,0])),v=cross(tangent,u),at=(end:number,i:number):Vertex=>{const n=add(mul(u,Math.cos(i*Math.PI/8)),mul(v,Math.sin(i*Math.PI/8)));return {p:add(end?b:a,mul(n,end?rb:ra)),n,uv:[end,i/16],kind};};for(let i=0;i<16;i++){tri(at(0,i),at(1,i),at(1,i+1));tri(at(0,i),at(1,i+1),at(0,i+1));}};
 for(const side of [-1,1]){
  for(let j=0;j<32;j++)for(let i=0;i<24;i++){const a=-Math.PI/2+j*Math.PI/32,b=-Math.PI/2+(j+1)*Math.PI/32,r=i/24,z=(i+1)/24;const q=[vertex(r,a,side,closure),vertex(z,a,side,closure),vertex(z,b,side,closure),vertex(r,b,side,closure)];if(side>0){tri(q[0]!,q[2]!,q[1]!);tri(q[0]!,q[3]!,q[2]!);}else{tri(q[0]!,q[1]!,q[2]!);tri(q[0]!,q[2]!,q[3]!);}}
  for(let i=0;i<22;i++){const a=-1.42+i*2.84/21,p=raw(1,a,side,closure),mid=add(p,[side*.11*Math.cos(a),.16,.13*Math.sin(a)]),tip=add(p,[side*.20*Math.cos(a),.24,.24*Math.sin(a)+side*.025]);tube(hinge(p,side,closure),hinge(mid,side,closure),.018,.011,1);tube(hinge(mid,side,closure),hinge(tip,side,closure),.011,.001,1);}
  if(closure<.55)for(let i=0;i<3;i++){const {base,tip}=hairPoints(side,i,closure,bend);tube(base,add(base,mul(sub(tip,base),.08)),.019,.013,2);tube(add(base,mul(sub(tip,base),.08)),tip,.013,.0015,2);}
 }
 // Petiole and midrib are supporting context, not a newly claimed signaling route.
 tube([0,.07,-1.5],[0,.07,1.53],.045,.035,1);tube([0,.07,-1.5],[0,-.12,-2.5],.07,.16,1);
 if(probe){const h=hairPoints(-1,1,closure,bend),contact=add(h.base,mul(sub(h.tip,h.base),.72));tube(add(contact,[-1.6,0,0]),contact,.018,.011,3);}
 if(signalAge!==null&&signalAge>=0&&signalAge<.9){const pos=Math.min(1,signalAge/.75);for(let i=0;i<24;i++){const x=i/24,a=surface(.58,(-1.2+2.4*x),-1,closure),b=surface(.58,(-1.2+2.4*(x+.035)),-1,closure);if(x<pos&&x>pos-.24)tube(add(a,[0,.027,0]),add(b,[0,.027,0]),.009,.009,4);}}
 return new Float32Array(out);
};
export const cameraMatrix=(eye:V,target:V,fov:number)=>{
 const z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);
 const view=[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
 const f=1/Math.tan(fov/2),near=.05,far=40,proj=[f/(1080/1920),0,0,0,0,f,0,0,0,-.08,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
 const m=Array(16).fill(0) as number[];for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)m[c*4+r]!+=proj[k*4+r]!*view[c*4+k]!;
 return new Float32Array(m);
};
export const projectPoint=(p:V,m:Float32Array)=>{const q=[0,1,2,3].map(r=>m[r]!*p[0]+m[4+r]!*p[1]+m[8+r]!*p[2]+m[12+r]!);return {x:(q[0]!/q[3]!*.5+.5)*1080,y:(.5-q[1]!/q[3]!*.5)*1920};};
