precision highp float;
uniform vec2 R;uniform float T;uniform vec4 M;uniform float IA;uniform float PX;
#include common
vec3 WARM=vec3(1.,.9,.74);vec3 TAIL=vec3(1.,.1,.05);
void main(){
 vec2 uv=gl_FragCoord.xy/R;
 vec2 iuv=vec2(uv.x*M.x+M.z,uv.y*M.y+M.w);
 vec2 q=vec2(iuv.x*IA,iuv.y);
 float y=q.y;
 vec3 col=vec3(0.);
 for(int r=0;r<3;r++){
  float sc=roadScale(r);
  float ry=road(q.x,r);
  float dy=y-ry;
  if(abs(dy)>.25*sc)continue;
  float lit=0.;
  int N=r==2?2:3;
  for(int i=0;i<3;i++){
   if(i>=N)break;
   float fi=float(i)+float(r)*7.;
   float dir=r==1?-1.:1.;
   float sp=(.03+h(vec2(fi,21.))*.03)*(r==2?2.6:1.);
   float span=IA+(r==2?3.5:1.6);
   float x0=fract(h(vec2(fi,22.))+T*sp/span*1.6)*span-(span-IA)*.5;
   x0=dir>0.?x0:IA-x0;
   float dx=(q.x-x0)*dir;
   float cdy=y-(ry-.0035*sc);
   float spread=.0025*sc+max(dx,0.)*.09;
   float beam=step(0.,dx)*smoothstep(.2*sc,.0,dx)*exp(-cdy*cdy/(spread*spread));
   col+=WARM*beam*.14;
   lit+=step(-.01,dx)*smoothstep(.17*sc,.0,dx);
   float hd=length(vec2(dx-.004*sc,cdy));
   col+=WARM*(smoothstep(.003*sc,.0,hd)*1.3+exp(-hd*170./sc)*.5);
   float tl=length(vec2(dx+.004*sc,cdy));
   col+=TAIL*(smoothstep(.0026*sc,.0,tl)*1.2+exp(-tl*210./sc)*.45);
   float tr=step(dx,-.004*sc)*exp((dx+.004*sc)*8./sc)*exp(-cdy*cdy/(.000003*sc*sc));
   col+=TAIL*tr*.85;
  }
  // guardrail reflectors flash as headlights pass
  float rx=abs(fract(q.x*90./sc)-.5)/90.*sc;
  float refl=smoothstep(.0012*sc,.0,length(vec2(rx,dy-.0015*sc)));
  col+=vec3(1.,.72,.35)*refl*min(lit,1.)*1.4;
 }
 float a=clamp(max(max(col.r,col.g),col.b),0.,1.);
 gl_FragColor=vec4(min(col,vec3(1.)),a);
}
