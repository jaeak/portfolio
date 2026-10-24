float h(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h(vec2(i,.5)),h(vec2(i+1.,.5)),f);}
// smooth base of the near slope; roads follow it (shared by the static picture and the live lights)
float nearBase(float x){return .27+.05*n1(x*1.3+23.)+.02*n1(x*3.1+5.);}
float road(float x,int k){
 if(k==0)return nearBase(x)-.035-.018*(.5+.5*sin(x*4.6+.7));
 if(k==1)return nearBase(x)-.115+.03*sin(x*3.2+1.)+.01*sin(x*8.3);
 return .085+.035*sin(x*1.6+.4)+.012*sin(x*3.9);
}
float roadScale(int k){return k==2?2.6:1.;}
