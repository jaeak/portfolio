const fs=require("fs");const C=fs.readFileSync(__dirname+"/common.glsl","utf8");
const inc=s=>fs.readFileSync(__dirname+"/"+s,"utf8").replace("#include common",C);
const S=inc("static.frag"),L=inc("lights.frag");
fs.writeFileSync(__dirname+"/shaders.json",JSON.stringify({S,L}));
const html=`<!doctype html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&family=Inter:wght@400;600;700&display=swap"><style>
body{margin:0;font-family:Inter,sans-serif;color:#EEF2FF;background:#05060c}
#bg{position:fixed;inset:0;background:#05060c center bottom/cover no-repeat;z-index:-3}#dk{position:fixed;inset:0;background:#000;opacity:0;z-index:-2}#lc{position:fixed;inset:0;width:100%;height:100%;z-index:-1}
.w{max-width:960px;margin:0 auto;padding:80px 20px}
h1{font:700 70px/1.05 "Pixelify Sans";margin:0 0 16px;text-shadow:0 0 10px rgba(0,0,0,.55),0 0 22px rgba(0,0,0,.35)}
.card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:20px;padding:28px;margin:24px 0;min-height:200px}
h2{font:800 40px/1 Inter;margin:0 0 10px}</style></head><body><div id=bg></div><div id=dk></div><canvas id=lc></canvas><div class=w><h1>Hello, I&#39;m Jack</h1><p>Systems Engineering student at Simon Fraser University.</p>
<div class=card><h2>About</h2><p>Turning ideas into working systems.</p></div><div class=card><h2>Projects</h2></div><div class=card><h2>Experience</h2></div><div class=card><h2>Skills</h2></div><div class=card><h2>Contact</h2></div><div class=card></div></div><script>
const SH=${JSON.stringify({S,L})};const IW=3200,IH=1800,IA=IW/IH;
function prog(gl,f){const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(x));return x};
const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,"attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);gl.useProgram(p);
const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const l=gl.getAttribLocation(p,"p");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);return n=>gl.getUniformLocation(p,n)}
// static picture
const oc=document.createElement("canvas");oc.width=IW;oc.height=IH;const og=oc.getContext("webgl",{preserveDrawingBuffer:true});const OU=prog(og,SH.S);og.viewport(0,0,IW,IH);og.uniform2f(OU("R"),IW,IH);og.drawArrays(og.TRIANGLES,0,3);
const url=window.BG_URL||oc.toDataURL("image/jpeg",.9);document.getElementById("bg").style.backgroundImage="url("+url+")";
window.save=async()=>{const r=await fetch("/save",{method:"POST",body:oc.toDataURL("image/png")});return r.text()};
// live lights
const c=document.getElementById("lc"),gl=c.getContext("webgl",{alpha:true,premultipliedAlpha:true});const U=prog(gl,SH.L);
const dk=document.getElementById("dk");let D=0;
function f(now){requestAnimationFrame(f);const w=c.clientWidth,h=c.clientHeight;if(c.width!==w||c.height!==h){c.width=w;c.height=h}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
const sa=w/h;let M;if(sa>IA){M=[1,IA/sa,0,0]}else{M=[sa/IA,1,.5-.5*sa/IA,0]}
gl.uniform2f(U("R"),w,h);gl.uniform1f(U("T"),window.FIXT??now/1000);gl.uniform4f(U("M"),...M);gl.uniform1f(U("IA"),IA);gl.drawArrays(gl.TRIANGLES,0,3);
const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const pp=Math.min(1,scrollY/max/.87);const tg=1-(1-pp)*(1-pp);D+=(tg-D)*.08;dk.style.opacity=(D*.5).toFixed(3)}f(0);
</script></body></html>`;
fs.writeFileSync(__dirname+"/index.html",html);
