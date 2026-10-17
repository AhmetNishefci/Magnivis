/** Original qualitative exterior, not Tesla CAD, dimensions or internal architecture. */
export type V3=[number,number,number];
export type Face={points:V3[];fill:string;stroke?:string};
export const move=(p:V3,t:V3):V3=>[p[0]+t[0],p[1]+t[1],p[2]+t[2]];
export const rotate=(p:V3,pitch=0,roll=0):V3=>{const y=p[1]*Math.cos(roll)-p[2]*Math.sin(roll),z=p[1]*Math.sin(roll)+p[2]*Math.cos(roll);return [p[0]*Math.cos(pitch)-y*Math.sin(pitch),p[0]*Math.sin(pitch)+y*Math.cos(pitch),z];};
const face=(points:V3[],fill:string,stroke?:string):Face=>({points,fill,...(stroke?{stroke}:{})});
export const carMesh=():Face[]=>{
 const out:Face[]=[],sections=[[-2.12,.82,.65],[-1.35,.94,.76],[-.45,.92,.77],[.65,.88,.73],[1.45,.90,.59],[2.22,.69,.43]];
 for(let i=0;i<sections.length-1;i++){const a=sections[i]!,b=sections[i+1]!;
  out.push(face([[a[0]!,a[2]!-0.05,-a[1]!],[b[0]!,b[2]!-0.05,-b[1]!],[b[0]!,b[2]!,-b[1]!+.14],[a[0]!,a[2]!,-a[1]!+.14]],'#9eafb7','#bac9d0'));
  out.push(face([[a[0]!,a[2]!,a[1]!-.14],[b[0]!,b[2]!,b[1]!-.14],[b[0]!,b[2]!-.05,b[1]!],[a[0]!,a[2]!-.05,a[1]!]],'#edf3f5','#c6d5db'));
  out.push(face([[a[0]!,a[2]!,-a[1]!+.14],[b[0]!,b[2]!,-b[1]!+.14],[b[0]!,b[2]!,b[1]!-.14],[a[0]!,a[2]!,a[1]!-.14]],i>2?'#e1ebed':'#c7d5db','#bacbd2'));
  for(const sign of [-1,1])out.push(face([[a[0]!,a[2]!-.05,a[1]!*sign],[b[0]!,b[2]!-.05,b[1]!*sign],[b[0]!, .28,b[1]!*sign*.93],[a[0]!,.28,a[1]!*sign*.93]],sign>0?'#c9d8de':'#879ca7','#a3b8c2'));
 }
 out.push(face([[-2.12,.28,-.77],[-2.12,.65,-.82],[-2.12,.65,.82],[-2.12,.28,.77]],'#9daeb5'),face([[2.22,.28,-.64],[2.22,.43,-.69],[2.22,.43,.69],[2.22,.28,.64]],'#bbcbd3'));
 out.push(face([[-2.16,.25,-.85],[2.26,.25,-.69],[2.26,.25,.69],[-2.16,.25,.85]],'#18262e'));
 const cabin:V3[]=[[-1.22,.8,-.7],[1.02,.71,-.66],[.32,1.16,-.54],[-.65,1.21,-.54],[-1.22,.8,.7],[1.02,.71,.66],[.32,1.16,.54],[-.65,1.21,.54]];
 out.push(face([cabin[0]!,cabin[1]!,cabin[2]!,cabin[3]!],'#263742','#6b8492'),face([cabin[4]!,cabin[5]!,cabin[6]!,cabin[7]!],'#14242e','#91a6b0'),face([cabin[1]!,cabin[5]!,cabin[6]!,cabin[2]!],'#344d5b','#9ab3bf'),face([cabin[3]!,cabin[2]!,cabin[6]!,cabin[7]!],'#101d26','#536b79'),face([cabin[0]!,cabin[4]!,cabin[7]!,cabin[3]!],'#1b2c38'));
 out.push(face([[2.23,.365,-.64],[2.23,.41,-.64],[2.23,.41,.64],[2.23,.365,.64]],'#e5faff'));
 out.push(face([[-2.13,.53,-.77],[-2.13,.58,-.77],[-2.13,.58,.77],[-2.13,.53,.77]],'#c75c51'));
 out.push(face([[-1.98,.96,-1.01],[-1.65,.94,-1.01],[-1.65,.94,1.01],[-1.98,.96,1.01]],'#24333c','#8e9aa1'));
 for(const x of [-1.4,1.36])for(const z of [-.91,.91]){
  const sign=Math.sign(z),ring=(depth:number,r:number):V3[]=>Array.from({length:24},(_,i)=>[x+r*Math.cos(i/24*Math.PI*2),.36+r*Math.sin(i/24*Math.PI*2),z+depth*sign]);
  const a=ring(-.08,.37),b=ring(.13,.37),rim=ring(.145,.24);
  for(let i=0;i<24;i++)out.push(face([a[i]!,a[(i+1)%24]!,b[(i+1)%24]!,b[i]!],i<12?'#263038':'#10191e'));
  out.push(face(b,'#111b23','#3b474e'),face(rim,'#516773','#8ba0aa'));
  for(let i=0;i<6;i++){const t=i/6*Math.PI*2;out.push(face([[x,.36,z+.15*sign],[x+.22*Math.cos(t),.36+.22*Math.sin(t),z+.15*sign],[x+.1*Math.cos(t+.24),.36+.1*Math.sin(t+.24),z+.15*sign]],'#adbac0'));}
 }
 return out;
};
export const transformMesh=(mesh:Face[],position:V3,pitch=0,roll=0)=>mesh.map(f=>({...f,points:f.points.map(p=>move(rotate(p,pitch,roll),position))}));
export const rampMesh=(radius=5):Face[]=>{
 const out:Face[]=[];for(let i=0;i<48;i++){const a=i/48*Math.PI,b=(i+1)/48*Math.PI,p=(t:number,z:number,r=radius):V3=>[r*Math.sin(t),radius-r*Math.cos(t),z];out.push(face([p(a,-1.38),p(b,-1.38),p(b,1.38),p(a,1.38)],i%2?'#777b78':'#7b807c','#858b87'));
 for(const z of [-1.38,1.38])out.push(face([p(a,z),p(b,z),p(b,z,radius+.16),p(a,z,radius+.16)],'#bec6c1'));}
 return out;
};
export const roadMesh=(y=0):Face[]=>[face([[-20,y,-12],[20,y,-12],[20,y,12],[-20,y,12]],'#4d5753'),...Array.from({length:24},(_,i)=>face([[-18+i*1.6,y+.008,-.035],[-17.2+i*1.6,y+.008,-.035],[-17.2+i*1.6,y+.008,.035],[-18+i*1.6,y+.008,.035]],'#e3dac4'))];
