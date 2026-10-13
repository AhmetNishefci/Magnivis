export const globeShader=`precision highp float;varying vec2 uv;uniform float time,lon,lat,energy;uniform sampler2D map;
const float PI=3.14159265;
void main(){vec2 px=vec2(uv.x*1080.,(1.-uv.y)*1920.);vec2 q=(px-vec2(510.,810.))/510.;vec3 bg=vec3(.007,.021,.035);float d=dot(q,q);vec3 col=bg;
if(d<1.){vec3 n=vec3(q.x,-q.y,sqrt(1.-d));float a=lat*PI/180.;n=vec3(n.x,n.y*cos(a)+n.z*sin(a),n.z*cos(a)-n.y*sin(a));a=lon*PI/180.;vec3 world=vec3(n.x*cos(a)+n.z*sin(a),n.y,n.z*cos(a)-n.x*sin(a));float lng=atan(world.x,world.z),lt=asin(world.y);vec2 st=vec2(fract(lng/(2.*PI)+.5),.5-lt/PI);vec3 albedo=texture2D(map,st).rgb;float shade=.28+.72*max(0.,dot(normalize(vec3(-.6,.7,.9)),vec3(q.x,-q.y,sqrt(1.-d))));col=albedo*shade;
float line=pow(abs(sin(lng*12.))*abs(sin(lt*12.)),28.);col+=vec3(.07,.14,.13)*line*.12;
vec3 origin=vec3(sin(160.2395*PI/180.)*cos(52.4948*PI/180.),sin(52.4948*PI/180.),cos(160.2395*PI/180.)*cos(52.4948*PI/180.));float distance=acos(clamp(dot(origin,world),-1.,1.));float pulse=mod(time*.58,1.7);float band=exp(-pow((distance-pulse)/.025,2.))*energy;col+=vec3(.7,.3,.065)*band*.65;
float edge=pow(1.-sqrt(1.-d),3.);col+=vec3(.03,.19,.22)*edge*.5;
}else{float halo=exp(-max(0.,sqrt(d)-1.)*32.);col+=vec3(.015,.09,.13)*halo;}
gl_FragColor=vec4(pow(col,vec3(.85)),1.);}`;
// Qualitative oblique near-surface section. Scale/path/period are illustrative.
export const basinShader=`precision highp float;varying vec2 uv;uniform float time,mode,forcing,zoom;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float textureRock(vec2 p){return noise(p)*.5+noise(p*3.1)*.3+noise(p*9.2)*.2;}
vec2 boxHit(vec3 ro,vec3 rd,vec3 lo,vec3 hi){vec3 a=(lo-ro)/rd,b=(hi-ro)/rd;vec3 mn=min(a,b),mx=max(a,b);return vec2(max(max(mn.x,mn.y),mn.z),min(min(mx.x,mx.y),mx.z));}
vec3 boxNormal(vec3 p,vec3 lo,vec3 hi){vec3 c=(lo+hi)*.5,h=(hi-lo)*.5,q=(p-c)/h;vec3 aq=abs(q);if(aq.x>aq.y&&aq.x>aq.z)return vec3(sign(q.x),0.,0.);if(aq.y>aq.z)return vec3(0.,sign(q.y),0.);return vec3(0.,0.,sign(q.z));}
vec3 rockColor(vec3 p,vec3 n){float tex=textureRock(vec2(p.x*13.+p.z*7.,p.y*15.));float layers=pow(abs(sin(p.y*51.+noise(p.xz*9.)*4.)),12.);float light=.33+.67*max(0.,dot(n,normalize(vec3(-.6,.8,1.))));return mix(vec3(.23,.25,.22),vec3(.54,.48,.36),tex)*light-layers*.03;}
void main(){vec2 px=vec2(uv.x*1080.,(1.-uv.y)*1920.);vec2 q=(px-vec2(500.,810.))/vec2(540.,510.)/zoom;
float side=step(.5,mode)*(1.-step(1.5,mode));vec3 ro=vec3(mix(.85+.12*sin(time*.2),.05,side),mix(.95,.52,side),5.5),ta=vec3(-.04,-.22,0.);vec3 forward=normalize(ta-ro),right=normalize(cross(forward,vec3(0.,1.,0.))),up=cross(right,forward);vec3 rd=normalize(forward+right*q.x*.62-up*q.y*.62);
float g=sin(time*2.15)*.06*forcing;vec3 local=ro-vec3(g,0.,0.);float nearest=100.;vec3 col=vec3(.011,.029,.037);vec3 sun=normalize(vec3(-.6,.9,1.));
vec3 llo=vec3(-2.35,-12.,-.85),lhi=vec3(-1.28,1.35,.65),rlo=vec3(1.28,-12.,-.85),rhi=vec3(2.35,1.35,.65);
vec2 l=boxHit(local,rd,llo,lhi),r=boxHit(local,rd,rlo,rhi);
if(l.x>0.&&l.x<l.y){nearest=l.x;vec3 p=local+rd*l.x;col=rockColor(p,boxNormal(p,llo,lhi));}
if(r.x>0.&&r.x<r.y&&r.x<nearest){nearest=r.x;vec3 p=local+rd*r.x;col=rockColor(p,boxNormal(p,rlo,rhi));}
float tilt=sin(time*2.15+.45)*.055;vec3 wlo=vec3(-1.28,-12.,-.74),whi=vec3(1.28,.16,.64);vec2 w=boxHit(local,rd,wlo,whi);float plane=(tilt*local.x-local.y)/(rd.y-tilt*rd.x);float enter=max(w.x,plane),leave=w.y;
if(enter>0.&&enter<leave&&enter<nearest){vec3 p=local+rd*enter;vec3 normal=enter> w.x+.001?normalize(vec3(-tilt,1.,0.)):boxNormal(p,wlo,whi);float depth=max(0.,tilt*p.x-p.y);vec3 water=mix(vec3(.024,.25,.28),vec3(.008,.052,.095),1.-exp(-depth*.9));
vec3 slo=vec3(-1.28,-.5,-.7),shi=vec3(-.25,-.34,.56);vec2 shelf=boxHit(local,rd,slo,shi);if(shelf.x>enter&&shelf.x<shelf.y){vec3 sp=local+rd*shelf.x;float material=noise(sp.xz*61.);vec3 sc=mix(vec3(.25,.31,.14),vec3(.46,.47,.29),material)*(.4+.6*max(0.,dot(boxNormal(sp,slo,shi),sun)));float loss=exp(-(shelf.x-enter)*.55);water=mix(water,sc*.65+vec3(.015,.1,.11),loss*.82);}
float caustic=pow(.5+.5*sin((p.x*19.+p.y*10.)+sin(time*.7+p.z*5.)),8.)*pow(.5+.5*sin(p.y*24.-p.x*7.+time*.45),4.);water+=vec3(.03,.12,.10)*caustic*.35;
float highlight=pow(max(0.,dot(reflect(-sun,normal),-rd)),48.);float fresnel=pow(1.-max(0.,dot(normal,-rd)),5.);col=water+vec3(.19,.34,.31)*highlight+vec3(.06,.16,.17)*fresnel;
if(normal.y>.5)col+=vec3(.07,.15,.13)*(.5+.5*sin(p.z*12.+p.x*5.+time*1.1))*.18;
}
float ambience=exp(-dot(q*.45,q*.45))*.01;col+=vec3(.03,.075,.08)*ambience;if(mode>1.5)col+=vec3(.015,.033,.022)*pow(max(0.,1.-abs(q.x+.6-q.y*.25)),8.);gl_FragColor=vec4(pow(max(col,0.),vec3(.78)),1.);}`;
