precision highp float;
uniform vec2 R;uniform float T;uniform float D;uniform float S;uniform float P;
float h(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h(vec2(i,.5)),h(vec2(i+1.,.5)),f);}
float rn(float x){return 1.-abs(n1(x)*2.-1.);}
float farR(float x){return .50+.17*rn(x*1.7+2.)+.06*n1(x*6.3+7.)+.015*n1(x*19.);}
float midR(float x){return .40+.12*rn(x*2.3+11.)+.04*n1(x*8.1)+.01*n1(x*25.);}
float nearR(float x){return .30+.08*n1(x*1.6+23.)+.03*n1(x*5.)+.008*n1(x*21.);}
float road(float x,int k){
 if(k==0)return nearR(x)-.03-.025*(.5+.5*sin(x*5.2+.7));
 if(k==1)return nearR(x)-.12+.04*sin(x*3.4+1.)+.012*sin(x*9.);
 return .11+.05*sin(x*1.5+.4)+.015*sin(x*3.7);
}
vec3 WARM=vec3(1.,.9,.72);vec3 TAIL=vec3(1.,.12,.06);vec3 SODIUM=vec3(1.,.55,.18);vec3 MOON=vec3(.62,.68,.85);
void main(){
 vec2 uv=gl_FragCoord.xy/R;
 float asp=R.x/R.y;
 vec2 q=vec2(uv.x*asp,uv.y);
 float y=q.y;
 vec3 col=mix(vec3(.10,.065,.06),vec3(.018,.024,.045),smoothstep(.35,1.,y));
 vec2 mp=vec2(asp*.82,.84);
 float md=length(q-mp);
 col+=MOON*(smoothstep(.032,.028,md)*.9+exp(-md*9.)*.10+exp(-md*30.)*.12);
 float st=h(floor(q*230.));
 col+=vec3(.8,.85,1.)*step(.996,st)*smoothstep(.6,.9,y)*(.3+.2*sin(T*1.3+st*60.))*smoothstep(.08,.2,md);
 float fr=farR(q.x+S*.01);
 if(y<fr){col=mix(vec3(.075,.07,.09),vec3(.05,.045,.06),smoothstep(fr,fr-.25,y));col+=MOON*exp(-(fr-y)*90.)*.10;}
 float mr=midR(q.x+S*.02);
 float nr=nearR(q.x);
 if(y<mr){
  col=mix(vec3(.04,.036,.046),vec3(.028,.025,.032),smoothstep(mr,mr-.2,y));
  col+=MOON*exp(-(mr-y)*110.)*.07;
  vec2 c=floor(q*vec2(200.));
  float lt=h(c+3.1);
  float band=smoothstep(.1,.0,y-nr);
  float tw=.75+.25*sin(T*2.+lt*80.);
  vec2 f=fract(q*200.)-.5;
  col+=mix(SODIUM,WARM,step(.6,h(c+9.)))*step(1.-.14*band,lt)*smoothstep(.35,.1,length(f))*tw;
  col+=SODIUM*band*.05;
 }
 col+=SODIUM*exp(-abs(y-nr-.02)*16.)*.06;
 if(y<nr){
  col=mix(vec3(.014,.012,.016),vec3(.026,.023,.028),smoothstep(nr-.3,nr,y));
  col+=MOON*exp(-(nr-y)*120.)*.06;
 }
 for(int r=0;r<3;r++){
  float sc=r==2?3.:1.;
  float ry=road(q.x,r);
  float dy=y-ry;
  if(r<2&&y>nr+.003)continue;
  // asphalt band + guardrail with reflector posts
  col=mix(col,vec3(.03,.028,.03),smoothstep(.0008*sc,0.,abs(dy+.006*sc)-.004*sc));
  float rail=smoothstep(.0012*sc,.0,abs(dy-.002*sc));
  col+=vec3(.2,.19,.19)*rail*.3;
  float rx=fract(q.x*38./sc+float(r)*.3);
  float refl=smoothstep(.1,.0,abs(rx-.5))*smoothstep(.002*sc,.0,abs(dy-.002*sc));
  // sodium lamps along the road
  float lf=2.6/sc;
  float lx=floor(q.x*lf);
  for(int j=-1;j<=1;j++){
   float L=lx+float(j);
   if(h(vec2(L,float(r)+40.))<.4)continue;
   float px=(L+.5)/lf;
   vec2 lp=vec2(px,road(px,r)+.02*sc);
   col+=vec3(.1,.09,.09)*smoothstep(.0007*sc,0.,abs(q.x-px))*step(road(px,r),y)*step(y,lp.y);
   float d=length(q-lp);
   col+=SODIUM*(exp(-d*55./sc)*.16+smoothstep(.003*sc,.0,d)*.9);
   col+=SODIUM*exp(-length(vec2((q.x-px)*1.2,(dy+.006*sc)*2.))*40./sc)*.12;
  }
  float lit=0.;
  int N=r==2?2:3;
  for(int i=0;i<3;i++){
   if(i>=N)break;
   float fi=float(i)+float(r)*7.;
   float dir=r==1?-1.:1.;
   float sp=(.03+h(vec2(fi,21.))*.03)*(r==2?2.6:1.);
   float span=asp+(r==2?3.5:1.6);
   float x0=fract(h(vec2(fi,22.))+T*sp/span*1.6)*span-(span-asp)*.5;
   x0=dir>0.?x0:asp-x0;
   float dx=(q.x-x0)*dir;
   float cdy=y-(ry-.002*sc);
   float spread=.003*sc+max(dx,0.)*.1;
   float beam=step(0.,dx)*smoothstep(.3*sc*.7,.0,dx)*exp(-cdy*cdy/(spread*spread));
   col+=WARM*beam*.2;
   lit+=step(0.,dx)*smoothstep(.25*sc*.7,.0,dx);
   float hd=length(vec2(dx-.004*sc,cdy));
   col+=WARM*(smoothstep(.0035*sc,.0,hd)*1.3+exp(-hd*180./sc)*.55);
   float tl=length(vec2(dx+.004*sc,cdy));
   col+=TAIL*(smoothstep(.003*sc,.0,tl)*1.1+exp(-tl*220./sc)*.45);
   float tr=step(dx,-.004*sc)*exp((dx+.004*sc)*9./sc)*exp(-cdy*cdy/(.0000035*sc*sc));
   col+=TAIL*tr*.8;
  }
  col+=vec3(1.,.75,.4)*refl*(.1+min(lit,1.)*1.2);
 }
 col*=mix(1.,.5,D);
 col*=1.-.32*pow(length(uv-.5)*1.2,2.);
 col+=(h(gl_FragCoord.xy+fract(T)*100.)-.5)*.018;
 gl_FragColor=vec4(col,1.);
}
