export const globeShader=`precision highp float;varying vec2 uv;uniform float time,lon,lat,energy;uniform sampler2D map;
const float PI=3.14159265;
void main(){vec2 px=vec2(uv.x*1080.,(1.-uv.y)*1920.);vec2 q=(px-vec2(510.,810.))/510.;vec3 bg=vec3(.007,.021,.035);float d=dot(q,q);vec3 col=bg;
if(d<1.){vec3 n=vec3(q.x,-q.y,sqrt(1.-d));float a=lat*PI/180.;n=vec3(n.x,n.y*cos(a)+n.z*sin(a),n.z*cos(a)-n.y*sin(a));a=lon*PI/180.;vec3 world=vec3(n.x*cos(a)+n.z*sin(a),n.y,n.z*cos(a)-n.x*sin(a));float lng=atan(world.x,world.z),lt=asin(world.y);vec2 st=vec2(fract(lng/(2.*PI)+.5),.5-lt/PI);vec3 albedo=texture2D(map,st).rgb;float shade=.28+.72*max(0.,dot(normalize(vec3(-.6,.7,.9)),vec3(q.x,-q.y,sqrt(1.-d))));col=albedo*shade;
float line=pow(abs(sin(lng*12.))*abs(sin(lt*12.)),28.);col+=vec3(.07,.14,.13)*line*.12;
vec3 origin=vec3(sin(160.2395*PI/180.)*cos(52.4948*PI/180.),sin(52.4948*PI/180.),cos(160.2395*PI/180.)*cos(52.4948*PI/180.));float distance=acos(clamp(dot(origin,world),-1.,1.));float pulse=mod(time*.27,1.7);float band=exp(-pow((distance-pulse)/.025,2.))*energy;col+=vec3(.7,.3,.065)*band*.65;
float edge=pow(1.-sqrt(1.-d),3.);col+=vec3(.03,.19,.22)*edge*.5;
}else{float halo=exp(-max(0.,sqrt(d)-1.)*32.);col+=vec3(.015,.09,.13)*halo;}
gl_FragColor=vec4(pow(col,vec3(.85)),1.);}`;
// Qualitative oblique near-surface section. Scale/path/period are illustrative.
export const basinShader=`precision highp float;varying vec2 uv;uniform float time,mode,forcing,zoom;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float textureRock(vec2 p){return noise(p)*.5+noise(p*3.1)*.3+noise(p*9.2)*.2;}
void main(){vec2 px=vec2(uv.x*1080.,(1.-uv.y)*1920.);vec2 q=(px-vec2(500.,810.))/vec2(540.,510.);q/=zoom;float ground=sin(time*2.15)*.016*forcing;float x=q.x-ground;
float walls=.68+.035*sin(q.y*5.)+.025*sin(q.y*17.);float waterLevel=-.29+sin(time*2.15+.45)*x*.055;float water=q.y-waterLevel;
vec3 col=vec3(.026,.06,.065);float tex=textureRock(vec2(x*10.,q.y*7.));float strata=pow(abs(sin(q.y*42.+noise(vec2(x*3.,q.y))*3.)),12.);
if(abs(x)>walls){float left=step(x,0.);vec3 rock=mix(vec3(.28,.29,.24),vec3(.58,.49,.34),left);col=rock*(.55+tex*.75)-strata*.045;col*=.78+.22*clamp(abs(x)-walls,0.,.4);}
else{if(water>0.){float depth=clamp(water/1.35,0.,1.);col=mix(vec3(.065,.44,.46),vec3(.012,.075,.13),depth);float caustic=pow(.5+.5*sin((x*16.+q.y*11.)+sin(time*1.1+x*5.)),8.)*pow(.5+.5*sin(q.y*24.-x*7.+time*.55),4.);col+=vec3(.08,.2,.17)*caustic*.26;
float glint=exp(-water*water/.0009);col+=vec3(.26,.54,.52)*glint;
float shelf=step(-.64,x)*step(x,-.1)*step(.26,q.y)*step(q.y,.38);if(shelf>.5){float food=noise(vec2(x*58.,q.y*73.));col=mix(vec3(.24,.31,.15),vec3(.4,.43,.26),food);col*=.82+.18*tex;}
}else{col=mix(vec3(.014,.045,.052),vec3(.047,.10,.11),tex);}}
float edge=exp(-pow((abs(x)-walls)/.025,2.));col+=vec3(.055,.10,.08)*edge;
if(mode>1.5){float beam=pow(max(0.,1.-abs(q.x+.6-q.y*.35)),8.)*.1;col+=vec3(.15,.21,.15)*beam;}
float vignette=1.-.2*clamp(dot(q*.45,q*.45),0.,1.);col*=vignette;gl_FragColor=vec4(pow(max(col,0.),vec3(.8)),1.);}`;
