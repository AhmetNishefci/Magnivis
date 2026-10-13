/** Original bounded ray intersections for rounded dice; printed numbers use the exact fixed-plane atlas. */
export const diceShader=`precision highp float;
varying vec2 uv;uniform sampler2D map;uniform vec3 d0,d1,d2,d3,r0,r1,r2,r3;uniform float time,light,view;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
mat3 rot(vec3 a){float x=a.x,y=a.y,z=a.z;mat3 rx=mat3(1.,0.,0.,0.,cos(x),sin(x),0.,-sin(x),cos(x));mat3 ry=mat3(cos(y),0.,-sin(y),0.,1.,0.,sin(y),0.,cos(y));mat3 rz=mat3(cos(z),sin(z),0.,-sin(z),cos(z),0.,0.,0.,1.);return rz*ry*rx;}
float shape(vec3 p){vec3 q=abs(p)-vec3(.84);return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-.16;}
vec3 normal(vec3 p){float e=.001;return normalize(vec3(shape(p+vec3(e,0.,0.))-shape(p-vec3(e,0.,0.)),shape(p+vec3(0.,e,0.))-shape(p-vec3(0.,e,0.)),shape(p+vec3(0.,0.,e))-shape(p-vec3(0.,0.,e))));}
vec2 box(vec3 ro,vec3 rd){vec3 a=(-vec3(1.01)-ro)/rd,b=(vec3(1.01)-ro)/rd;vec3 lo=min(a,b),hi=max(a,b);return vec2(max(max(lo.x,lo.y),lo.z),min(min(hi.x,hi.y),hi.z));}
vec3 pigment(float id){if(id<.5)return vec3(.89,.63,.09);if(id<1.5)return vec3(.10,.39,.72);if(id<2.5)return vec3(.26,.52,.22);return vec3(.88,.34,.105);}
vec3 die(vec2 px,vec3 loc,vec3 angles,float id,vec3 bg){vec2 q=(px-loc.xy)/loc.z;if(abs(q.x)>1.3||abs(q.y)>1.5)return bg;
vec3 camera=vec3(mix(2.9,1.2,view),mix(3.3,5.6,view),5.8);vec3 fw=normalize(-camera),rt=normalize(cross(fw,vec3(0.,1.,0.))),up=cross(rt,fw);vec3 rd=normalize(fw+rt*q.x*.40-up*q.y*.40);mat3 R=rot(angles);mat3 inv=mat3(R[0].x,R[1].x,R[2].x,R[0].y,R[1].y,R[2].y,R[0].z,R[1].z,R[2].z);vec3 ro=inv*camera,lr=inv*rd;vec2 hit=box(ro,lr);
if(hit.x>hit.y||hit.y<0.)return bg;float t=max(0.,hit.x);bool found=false;for(int k=0;k<22;k++){float dist=shape(ro+lr*t);if(dist<.0015){found=true;break;}t+=dist;if(t>hit.y)break;}if(!found)return bg;
vec3 p=ro+lr*t,nl=normal(p),n=R*nl;vec3 an=abs(p);float face;vec2 st;if(an.x>an.y&&an.x>an.z){face=p.x>0.?0.:1.;st=vec2(p.x>0.?-p.z:p.z,p.y);}else if(an.y>an.z){face=p.y>0.?2.:3.;st=vec2(p.x,p.y>0.?-p.z:p.z);}else{face=p.z>0.?4.:5.;st=vec2(p.z>0.?p.x:-p.x,p.y);}
st=st*.5+.5;vec2 tex=vec2((face+st.x)/8.,(id+1.-st.y)/4.);float ink=texture2D(map,tex).r;
vec3 albedo=pigment(id)*(1.-ink*.92);float micro=noise(p.xy*120.+p.z*41.);albedo*=.98+micro*.04;vec3 L=normalize(vec3(-.6,.95,1.2)),H=normalize(L-rd);float diffuse=max(0.,dot(n,L));float broad=pow(max(0.,dot(n,H)),42.),coat=pow(max(0.,dot(n,H)),150.);float ambient=.35+.10*n.y;vec3 col=albedo*(ambient+diffuse*.72)+vec3(1.,.84,.60)*broad*.22+vec3(1.)*coat*.42;float edge=pow(1.-max(0.,dot(n,-rd)),4.);col+=vec3(.12,.20,.25)*edge*.26;
return mix(col,albedo*(.4+diffuse*.75),ink*.4);}
void main(){vec2 px=vec2(uv.x*1080.,(1.-uv.y)*1920.);vec2 grain=vec2(px.x*.023+px.y*.004,px.y*.004);float wood=noise(vec2(grain.x*1.8,grain.y*.22))*.6+noise(vec2(grain.x*6.,grain.y*.7))*.25;float streak=sin(grain.x*3.+noise(grain*.7)*8.)*.04;vec3 bg=mix(vec3(.09,.049,.028),vec3(.29,.16,.09),wood+streak);float beam=exp(-pow((px.x*.001+px.y*.00032-.80),2.)*2.5);bg*=.65+beam*.8+light*.15;
vec3 loc;for(int i=0;i<4;i++){if(i==0)loc=d0;else if(i==1)loc=d1;else if(i==2)loc=d2;else loc=d3;vec2 q=(px-loc.xy-vec2(0.,loc.z*.48))/loc.z;float sh=exp(-dot(q*vec2(1.15,2.8),q*vec2(1.15,2.8))*3.);bg*=1.-sh*.65;}
bg=die(px,d0,r0,0.,bg);bg=die(px,d1,r1,1.,bg);bg=die(px,d2,r2,2.,bg);bg=die(px,d3,r3,3.,bg);
float vignette=clamp(1.-length((px-vec2(500.,880.))/vec2(1300.,2200.))*.35,.55,1.);gl_FragColor=vec4(pow(max(bg*vignette,0.),vec3(.78)),1.);}`;
