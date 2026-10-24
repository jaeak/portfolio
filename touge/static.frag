precision highp float;
uniform vec2 R;
#include common
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n2(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float rfbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){float r=1.-abs(n2(p)*2.-1.);v+=a*r*r;p=p*2.05+vec2(3.1,1.7);a*=.5;}return v;}
float terr(vec2 p){return rfbm(p)+.35*fbm(p*3.);}
// jagged ridgeline: ridged multi-octave noise (sharp peaks, eroded shoulders)
float ridge(float x,float seed,float fq){
 float v=0.,a=.5,f=fq;
 for(int i=0;i<8;i++){float r=1.-abs(n1(x*f+seed+float(i)*3.7)*2.-1.);v+=a*r*r;f*=2.07;a*=.47;}
 return v;
}
float L0(float x){return .50+.27*ridge(x,1.,.9);}
float L1(float x){return .37+.22*ridge(x,7.,1.3);}
float L2(float x){return .30+.13*ridge(x,13.,1.7);}
// conifer silhouettes along a ridgeline
float trees(float x,float sz,float seed){
 float t=0.;
 for(int r=0;r<2;r++){
  float w=sz*(r==0?1.:.7);
  float xx=x/w+float(r)*.5+seed;
  float id=floor(xx),f=fract(xx);
  float th=(.5+.7*h(vec2(id,seed+float(r))))*w*2.6;
  t=max(t,th*max(0.,1.-abs(f-.5)*2.2)*step(.15,h(vec2(id,seed+9.))));
 }
 return t;
}
float nearH(float x){return nearBase(x)+.012*ridge(x,29.,3.)+trees(x,.0042,3.);}
vec3 SODIUM=vec3(1.,.56,.2);vec3 WARM=vec3(1.,.88,.7);vec3 MOONC=vec3(.6,.68,.86);
const vec2 MOONP=vec2(1.08,.86);
// town lights (with soft halos) clustered along the valley floor
vec3 town(vec2 q,float floorY){
 vec3 c=vec3(0.);
 float dens=smoothstep(.45,.75,fbm(q*vec2(5.,9.)+3.))*smoothstep(.05,.0,q.y-floorY)*smoothstep(-.004,.006,q.y-floorY);
 vec2 g=q*vec2(420.);
 vec2 gi=floor(g);
 for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
  vec2 cell=gi+vec2(float(i),float(j));
  float r=h(cell+1.3);
  vec2 cq=cell/420.;
  float dd=smoothstep(.45,.75,fbm(cq*vec2(5.,9.)+3.))*smoothstep(.05,.0,cq.y-floorY)*smoothstep(-.004,.006,cq.y-floorY);
  if(r<1.-dd*.32)continue;
  vec2 o=vec2(h(cell+5.),h(cell+7.))*.8+.1;
  float d=length(g-cell-o);
  float b=.4+.6*h(cell+11.);
  vec3 lc=h(cell+13.)<.62?SODIUM:(h(cell+17.)<.85?WARM:vec3(.75,.95,.85));
  c+=lc*b*(smoothstep(.55,.15,d)*1.1+exp(-d*1.6)*.12);
 }
 return c+SODIUM*dens*.06;
}
void main(){
 vec2 uv=gl_FragCoord.xy/R;
 vec2 q=vec2(uv.x*R.x/R.y,uv.y);
 float y=q.y;
 // sky
 vec3 col=mix(vec3(.085,.07,.075),vec3(.012,.017,.035),smoothstep(.3,1.,y));
 col+=SODIUM*exp(-max(y-.33,0.)*7.)*.06;
 float md=length(q-MOONP);
 float cl=fbm(q*vec2(2.2,7.)+vec2(4.,1.));
 float cloud=smoothstep(.5,.78,cl)*smoothstep(.4,.95,y);
 col=mix(col,vec3(.07,.075,.095)+MOONC*exp(-md*4.)*.12,cloud*.55);
 float star=h(floor(q*700.));
 col+=vec3(.85,.9,1.)*smoothstep(.9965,1.,star)*(.4+.6*h(floor(q*700.)+2.))*smoothstep(.55,.9,y)*(1.-cloud)*smoothstep(.06,.25,md);
 float mt=fbm((q-MOONP)*120.);
 col=mix(col,MOONC*(1.05-.25*smoothstep(.45,.7,mt)),smoothstep(.0215,.0195,md));
 col+=MOONC*(exp(-md*7.)*.08+exp(-md*28.)*.12)*(1.-step(md,.02));
 // mountain layers with aerial haze, moonlit slopes and valley mist
 vec3 fogC=vec3(.075,.08,.1);
 float hs[3];vec3 base[3];float haze[3];
 for(int k=0;k<3;k++){
  float H=k==0?L0(q.x):(k==1?L1(q.x):L2(q.x));
  if(k==2)H+=trees(q.x,.0025,11.);
  if(y<H){
   float depth=H-y;
   float ts=k==0?11.:(k==1?7.:5.);
   vec2 p=vec2(q.x*ts,y*ts*1.4)+float(k)*17.;
   float e=.01;
   float t0=terr(p),tx=terr(p+vec2(e,0.)),ty=terr(p+vec2(0.,e));
   vec3 nrm=normalize(vec3(-(tx-t0)/e,-(ty-t0)/e,1.6));
   vec3 ldir=normalize(vec3(.55,.45,.7));
   float dif=max(dot(nrm,ldir),0.);
   float ao=smoothstep(.2,.9,t0);
   vec3 c=k==0?vec3(.085,.09,.115):(k==1?vec3(.05,.053,.068):vec3(.026,.028,.034));
   c*=k==0?(.6+.7*dif*(.5+.5*ao)):(.3+1.35*dif*(.5+.5*ao));
   c*=mix(1.,.55,smoothstep(0.,.3,depth));
   // forest covers the lower slopes of the nearer ranges, bare rock up top
   if(k>0){
    float tl=(k==1?.07:.035)+.03*fbm(vec2(q.x*9.,float(k)));
    float fm=smoothstep(tl,tl+.02,depth);
    float can=fbm(q*vec2(170.,110.)+float(k)*3.);
    vec3 fc=vec3(.014,.017,.016)*(.6+.9*can)*(.6+.8*dif);
    c=mix(c,fc,fm*(k==1?.85:.95));
   }
   c+=MOONC*exp(-depth*(k==0?260.:320.))*(k==0?.07:.11);
   c=mix(c,vec3(.1,.1,.125),(k==0?.5:(k==1?.2:.04)));
   col=c;
  }
  // mist pooling in the valley in front of this layer
  float baseY=k==0?.52:(k==1?.41:.32);
  float mist=fbm(q*vec2(3.,16.)+vec2(float(k)*7.,0.));
  col=mix(col,vec3(.11,.11,.13)+SODIUM*.02,smoothstep(.35,.8,mist)*exp(-abs(y-baseY)*22.)*.5);
 }
 // town in the valley at the foot of the near slope
 float nb=nearBase(q.x);
 col+=town(q,nb+.003);
 col+=SODIUM*exp(-abs(y-nb-.03)*14.)*.045;
 // near slope: dense forest, moonlit tree tops
 float nh=nearH(q.x);
 if(y<nh){
  float depth=nh-y;
  float canopy=fbm(q*vec2(150.,90.));
  float c2=fbm(q*vec2(40.,30.)+5.);
  vec3 c=vec3(.012,.013,.014)+vec3(.02,.022,.022)*smoothstep(.35,.75,canopy)*c2;
  c+=MOONC*exp(-depth*260.)*.06;
  col=c;
 }
 // roads: asphalt, guardrail with posts, lamp poles + sodium lamps (cars are drawn live on top)
 for(int r=0;r<3;r++){
  float sc=roadScale(r);
  float ry=road(q.x,r);
  if(r<2&&y>nh)continue;
  float dy=y-ry;
  float band=smoothstep(.0007*sc,0.,abs(dy+.006*sc)-.0045*sc);
  float tex=fbm(q*vec2(300.,500.)/sc);
  col=mix(col,vec3(.028,.027,.03)*(.8+.4*tex),band);
  col+=vec3(.06,.055,.055)*smoothstep(.0006*sc,0.,abs(dy+.0105*sc))*.6;
  float rail=smoothstep(.0011*sc,.0,abs(dy-.0015*sc));
  float post=smoothstep(.0007*sc,0.,abs(fract(q.x*90./sc)-.5)/90.*sc)*step(ry-.001*sc,y)*step(y,ry+.0015*sc);
  col+=vec3(.16,.15,.15)*(rail*.45+post*.3);
  float lf=2.6/sc;
  float lx=floor(q.x*lf);
  for(int j=-1;j<=1;j++){
   float L=lx+float(j);
   if(h(vec2(L,float(r)+40.))<.4)continue;
   float px=(L+.5)/lf;
   float pr=road(px,r);
   vec2 lp=vec2(px,pr+.021*sc);
   col+=vec3(.09,.085,.08)*smoothstep(.0008*sc,0.,abs(q.x-px))*step(pr,y)*step(y,lp.y);
   float d=length(q-lp);
   col+=SODIUM*(exp(-d*60./sc)*.14+smoothstep(.0028*sc,.0,d)*1.);
   col+=SODIUM*exp(-length(vec2((q.x-px)*1.1,(dy+.006*sc)*2.2))*38./sc)*.16*band;
   col+=SODIUM*exp(-length(vec2((q.x-px)*1.1,(dy+.006*sc)*2.2))*38./sc)*.04;
  }
 }
 col*=1.-.3*pow(length(uv-vec2(.5,.45))*1.15,2.);
 col+=(h(gl_FragCoord.xy*1.37)-.5)*.012;
 gl_FragColor=vec4(col,1.);
}
