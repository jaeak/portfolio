precision highp float;
uniform vec2 R;uniform float T;uniform float D;uniform float S;uniform float P;
float h(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
const float HY=.2;
vec3 neon(float k){return k<.38?vec3(1.,.18,.55):(k<.7?vec3(.15,.95,1.):vec3(.66,.33,.97));}
// one row of buildings; returns colour added, a=1 where a building covers the pixel
vec4 layer(vec2 q,float cw,float hb,float hv,float off,float L,vec3 body,float win,float sign){
 float x=q.x/cw+off;
 float id=floor(x);float fx=fract(x);
 float y=q.y-HY;
 vec3 add=vec3(0.);float cover=0.;
 float bh=hb+h(vec2(id,L))*hv;
 float gap=.06+h(vec2(id,L+1.))*.1;
 if(y>0.&&y<bh&&fx>gap&&fx<1.-gap){
  cover=1.;
  add=body;
  vec2 g=vec2((fx-gap)/(1.-2.*gap)*6.,y/cw*9.);
  vec2 gi=floor(g),gf=fract(g);
  float lit=step(.72,h(gi+id*13.+L*7.));
  float on=smoothstep(.15,.25,gf.x)*smoothstep(.85,.75,gf.x)*smoothstep(.2,.3,gf.y)*smoothstep(.8,.7,gf.y);
  vec3 wc=mix(vec3(1.,.75,.5),vec3(.6,.75,1.),h(gi+id));
  add+=wc*lit*on*win;
 }
 // neon signs on this and neighbouring buildings (so glows spill over gaps)
 if(sign>0.){
  for(int k=-1;k<=1;k++){
   float j=id+float(k);
   float s=h(vec2(j,L+5.));
   if(s<.45)continue;
   float bj=hb+h(vec2(j,L))*hv;
   float sx=j+.5+(h(vec2(j,L+6.))-.5)*.5;
   float sy=HY+bj*(.35+h(vec2(j,L+7.))*.45);
   float sh=(.05+h(vec2(j,L+8.))*.09);
   float swd=.035;
   vec2 d=vec2((x-sx)*cw,q.y-sy);
   vec2 bb=vec2(swd*cw*2.2,sh*.5);vec2 ad=abs(d)-bb;
   float sd=length(max(ad,0.))+min(max(ad.x,ad.y),0.);
   float dist=max(sd,0.);
   vec3 nc=neon(fract(j*.618+L*.37));
   float fl=step(.06,fract(sin(T*(1.+h(vec2(j,3.)))*1.3+j)*43758.5))*.3+.7;
   float tube=smoothstep(.0032,.0012,abs(sd+.002));
   float fill=step(sd,0.)*.12;
   add+=nc*(tube*1.25+fill+exp(-dist*30.)*.3)*fl*sign;
  }
 }
 return vec4(add,cover);
}
vec3 scene(vec2 q){
 float y=q.y-HY;
 vec3 col=mix(vec3(.17,.05,.26),vec3(.03,.02,.08),smoothstep(0.,.75,y));
 col+=vec3(.9,.15,.5)*exp(-max(y,0.)*9.)*.18;
 vec4 a=layer(q,.07,.16,.32,T*.004,1.,vec3(.10,.06,.18),.35,0.);
 col=mix(col,a.rgb,a.a);
 vec4 b=layer(q,.11,.08,.24,T*.009+3.,2.,vec3(.05,.035,.10),.7,.55);
 col=mix(col,b.rgb,b.a);col+=b.rgb*(1.-b.a)*step(.0,1.);
 vec4 c=layer(q,.16,.03,.16,T*.016+7.,3.,vec3(.018,.014,.035),1.,1.);
 col=mix(col,c.rgb,c.a);col+=c.rgb*(1.-c.a);
 // elevated expressway with cars racing along it
 float hw=HY+.035;
 if(q.y>hw-.004&&q.y<hw+.012){col=mix(col,vec3(.012,.01,.025),1.);}
 col+=vec3(.66,.33,.97)*smoothstep(.0015,0.,abs(q.y-(hw+.012)))*.45;
 float lamp=fract(q.x*14.);
 col+=vec3(1.,.55,.25)*smoothstep(.04,0.,abs(lamp-.5))*smoothstep(.003,0.,abs(q.y-(hw+.016)))*.6;
 for(int i=0;i<10;i++){
  float fi=float(i);
  float dir=i<5?1.:-1.;
  float sp=.12+h(vec2(fi,21.))*.14;
  float x0=fract(h(vec2(fi,22.))+T*sp*.25)*3.2-1.;
  x0=dir>0.?x0:R.x/R.y-x0+.0;
  float ly=hw+(dir>0.?.003:.007);
  float dx=(x0-q.x)*dir;
  float trail=smoothstep(0.,.006,dx)*exp(-dx*7.);
  float dy=abs(q.y-ly);
  vec3 lc=dir>0.?vec3(1.,.15,.2):vec3(.75,.95,1.);
  col+=lc*(trail*exp(-dy*dy/.0000045)*1.4+exp(-length(vec2(dx*.6,dy))*260.)*.8);
 }
 return col;
}
void main(){
 vec2 uv=gl_FragCoord.xy/R;
 float asp=R.x/R.y;
 vec2 q=vec2(uv.x*asp,uv.y);
 vec3 col;
 if(q.y>=HY){col=scene(q);}
 else{
  float dd=HY-q.y;
  vec2 r=vec2(q.x+sin(q.y*120.+T*1.5)*.0015*(1.+dd*8.),HY+dd*1.4);
  col=scene(r)*.32;
  col+=vec3(.9,.15,.5)*exp(-dd*14.)*.05;
  col*=1.-smoothstep(0.,HY,dd)*.5;
 }
 float rx=q.x*60.+q.y*12.;
 float ri=floor(rx);
 float ry=fract(q.y*1.5+T*(1.1+h(vec2(ri,1.))*.6)+h(vec2(ri,2.)));
 col+=vec3(.6,.7,1.)*smoothstep(.06,0.,abs(fract(rx)-.5)-.0)*0.+vec3(.55,.65,.9)*step(.94,ry)*smoothstep(.1,.0,abs(fract(rx)-.5))*step(.6,h(vec2(ri,3.)))*.06;
 col*=mix(1.,.45,D);
 col*=1.-.4*pow(length(uv-.5)*1.2,2.);
 col+=(h(gl_FragCoord.xy+fract(T)*100.)-.5)*.02;
 gl_FragColor=vec4(col,1.);
}
