const $=(s)=>document.querySelector(s);
const $$=(s)=>document.querySelectorAll(s);

const clock=$("#clock");
function tick(){clock.textContent=new Date().toLocaleTimeString("en-GB",{hour12:false});}
tick();setInterval(tick,1000);

const cursor=$(".cursor"), ring=$(".cursor-ring");
window.addEventListener("mousemove",e=>{
  cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";
  ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px";
});
$$("a,.node,.project-card").forEach(el=>{
  el.addEventListener("mouseenter",()=>{ring.style.width="52px";ring.style.height="52px"});
  el.addEventListener("mouseleave",()=>{ring.style.width="30px";ring.style.height="30px"});
});

function fitCanvas(canvas){
  const d=Math.min(devicePixelRatio||1,2), r=canvas.getBoundingClientRect();
  canvas.width=r.width*d;canvas.height=r.height*d;
  const c=canvas.getContext("2d");c.setTransform(d,0,0,d,0,0);
  return [c,r.width,r.height];
}
function particles(canvas, mode){
  const pts=[];
  for(let i=0;i<(mode==="final"?100:140);i++) pts.push({
    x:Math.random(),y:Math.random(),r:Math.random()*1.7+.2,
    s:Math.random()*.0007+.00015,a:Math.random()*.55+.15
  });
  let W=0,H=0,c;
  function resize(){[c,W,H]=fitCanvas(canvas)}
  resize();addEventListener("resize",resize);
  function draw(t){
    c.clearRect(0,0,W,H);
    const grad=c.createRadialGradient(W*.5,H*.48,0,W*.5,H*.48,W*.65);
    grad.addColorStop(0,mode==="final"?"#17140e":"#111");
    grad.addColorStop(1,"#030303");c.fillStyle=grad;c.fillRect(0,0,W,H);
    for(const p of pts){
      p.y-=p.s;
      if(p.y<0)p.y=1;
      const x=p.x*W+Math.sin(t*.0004+p.y*8)*18;
      const y=p.y*H;
      c.globalAlpha=p.a*(.65+.35*Math.sin(t*.001+p.x*9));
      c.fillStyle=mode==="final"?"#b8a48c":"#cfcfcf";
      c.beginPath();c.arc(x,y,p.r,0,Math.PI*2);c.fill();
    }
    c.globalAlpha=1;
    if(mode==="hero"){
      const g=c.createRadialGradient(W*.55,H*.45,0,W*.55,H*.45,W*.28);
      g.addColorStop(0,"rgba(217,255,85,.08)");g.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle=g;c.fillRect(0,0,W,H);
    }
    requestAnimationFrame(draw);
  }requestAnimationFrame(draw);
}
particles($("#heroCanvas"),"hero");
particles($("#finalCanvas"),"final");

const sc=$("#stackCanvas"), ctx=sc.getContext("2d");
function drawStack(){
  const d=Math.min(devicePixelRatio||1,2),r=sc.getBoundingClientRect();sc.width=r.width*d;sc.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);
  ctx.clearRect(0,0,r.width,r.height);
  const cx=r.width*.5,cy=r.height*.56,R=Math.min(r.width,r.height)*.36;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(scrollY*.00012);
  for(let i=0;i<28;i++){
    const a=i*Math.PI*2/28, rr=R*(.72+Math.sin(i*2.4)*.18);
    const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.72;
    ctx.strokeStyle=i%4===0?"#313131":"#151515";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(x,y);ctx.stroke();
  }ctx.restore();requestAnimationFrame(drawStack);
}drawStack();

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("seen")});
},{threshold:.15});
$$(".scene").forEach(s=>io.observe(s));

const events=$$(".event");
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity="1";e.target.style.transform="translateX(0)"}})
},{threshold:.25});
events.forEach((e,i)=>{e.style.opacity="0";e.style.transform="translateX(25px)";e.style.transition=`opacity .8s ${i*.12}s,transform .8s ${i*.12}s`;revealObserver.observe(e)});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") window.scrollTo({top:0,behavior:"smooth"});
});
