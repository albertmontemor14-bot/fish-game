// ADMIN PASSWORD para sa offline mode. Sa multiplayer, ang password ay nasa server.js (ADMIN_PASSWORD). PALITAN MO ITO.
const CONFIG={ADMIN_PW:'admin123'};
const $=id=>document.getElementById(id),R=Math.random;
const scene=new THREE.Scene(),SKY=0x9fdcf0;scene.background=new THREE.Color(SKY);scene.fog=new THREE.Fog(SKY,60,230);
const cam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,420);cam.rotation.order='YXZ';cam.position.set(0,1.7,4);scene.add(cam);
const ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(innerWidth,innerHeight);ren.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches?1.5:2));document.body.prepend(ren.domElement);
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
scene.add(new THREE.HemisphereLight(0xffffff,0x6aa0a8,.85));
const sun=new THREE.DirectionalLight(0xfff0c8,.8);sun.position.set(30,50,20);scene.add(sun);
const M=c=>new THREE.MeshLambertMaterial({color:c});
function box(w,h,d,c,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);scene.add(m);return m}
// water
const wg=new THREE.PlaneGeometry(500,500,60,60),wm=new THREE.Mesh(wg,new THREE.MeshPhongMaterial({color:0x1fa6c9,transparent:true,opacity:.9,shininess:90,flatShading:true}));wm.rotation.x=-Math.PI/2;wm.position.y=-.35;scene.add(wm);
const W=(x,z,t)=>-.35+Math.sin(x*.15+t)*.12+Math.cos(z*.12+t*1.3)*.1;
const wp=wg.attributes.position,wb=[];for(let i=0;i<wp.count;i++)wb.push([wp.getX(i),wp.getY(i)]);
const ZC=[0x1fa6c9,0x1583b5,0x0a4a86,0x4b3fa0].map(c=>new THREE.Color(c));
// islands
const MI={x:-120,z:-110,r:40}; // Mythic Isle
const ISL=[[90,-70,9],[-100,50,8],[30,-120,7]];
const COL=[...ISL,[MI.x,MI.z,12]];
function palm(x,z,h){const tr=box(.35,h,.35,0x7a5230,x,h/2,z);tr.rotation.z=(R()-.5)*.3;
 for(let k=0;k<5;k++){const l=box(2.6,.12,.7,0x2f9e4f,x,h,z);l.rotation.y=k*1.26;l.position.x+=Math.cos(k*1.26)*1.1;l.position.z-=Math.sin(k*1.26)*1.1;l.rotation.z=.25}}
const isl=new THREE.Mesh(new THREE.CylinderGeometry(14,15,1.4,40),M(0xe8d49a));isl.position.y=-.7;scene.add(isl);
const grs=new THREE.Mesh(new THREE.CylinderGeometry(9,10,.06,32),M(0x5fb85a));grs.position.y=.03;scene.add(grs);
ISL.forEach(([x,z,r])=>{const s=new THREE.Mesh(new THREE.CylinderGeometry(r,r+1,1.4,28),M(0xe8d49a));s.position.set(x,-.7,z);scene.add(s);const g=new THREE.Mesh(new THREE.CylinderGeometry(r*.6,r*.65,.06,24),M(0x5fb85a));g.position.set(x,.03,z);scene.add(g);palm(x+1,z,3.6);palm(x-2,z+1.5,3)});
// Mythic Isle: glowing crystals, tall beacon, floating ring
let MIring,MIbeam;
{const g=new THREE.Group();g.position.set(MI.x,0,MI.z);scene.add(g);
 const add=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m};
 add(new THREE.CylinderGeometry(12,13.5,1.6,32),M(0x8f7bd6),0,-.8,0);
 add(new THREE.CylinderGeometry(8,9,.08,28),M(0x3fd0d4),0,.04,0);
 const pal=[0xff6bd6,0x6bf0ff,0xb08cff,0xfff27a];
 for(let i=0;i<16;i++){const a=R()*6.28,r=3+R()*7,h=2+R()*3.5,c=add(new THREE.ConeGeometry(.5+R()*.5,h,5),new THREE.MeshBasicMaterial({color:pal[i%4]}),Math.cos(a)*r,h/2,Math.sin(a)*r);c.rotation.z=(R()-.5)*.4;c.rotation.x=(R()-.5)*.4}
 add(new THREE.ConeGeometry(2.4,14,6),new THREE.MeshBasicMaterial({color:0xb08cff,fog:false}),0,7,0);
 MIbeam=add(new THREE.CylinderGeometry(1,1.8,110,16,1,true),new THREE.MeshBasicMaterial({color:0x9fe8ff,transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false,fog:false}),0,55,0);
 MIring=add(new THREE.TorusGeometry(5.5,.18,8,40),new THREE.MeshBasicMaterial({color:0xffd23f,fog:false}),0,9,0);MIring.rotation.x=Math.PI/2.4;
 const pl=new THREE.PointLight(0xb08cff,1.4,70);pl.position.set(0,8,0);g.add(pl);
 const zr=new THREE.Mesh(new THREE.RingGeometry(MI.r-1.5,MI.r,64),new THREE.MeshBasicMaterial({color:0x9fe8ff,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}));zr.rotation.x=-Math.PI/2;zr.position.set(MI.x,-.12,MI.z);scene.add(zr)}
// dock
box(3,.15,17,0x9a6b3a,0,-.02,18.5);[10.5,14,17.5,21,24.5,27].forEach(z=>[-1.4,1.4].forEach(x=>box(.2,1.2,.2,0x5a3a1f,x,-.3,z)));
for(let i=0;i<7;i++){const a=i*.9+.4,r=9+R()*3;palm(Math.cos(a)*r,-Math.abs(Math.sin(a)*r)-2,4)}
// lighthouse
{const lh=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.3,8,14),M(0xffffff));lh.position.set(-9,4,-5);scene.add(lh);
 const rb=new THREE.Mesh(new THREE.CylinderGeometry(1.06,1.18,1.6,14),M(0xff6b57));rb.position.set(-9,3,-5);scene.add(rb);
 const rb2=rb.clone();rb2.position.y=6;scene.add(rb2);
 const lamp=new THREE.Mesh(new THREE.SphereGeometry(.8,12,10),new THREE.MeshBasicMaterial({color:0xfff2a0}));lamp.position.set(-9,8.6,-5);scene.add(lamp);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(1.1,1,14),M(0xff6b57));cap.position.set(-9,9.7,-5);scene.add(cap)}
// shop hut
const HUT=[6,4];box(4,2.5,3.5,0xc79a5a,HUT[0],1.25,HUT[1]);
const rf=new THREE.Mesh(new THREE.ConeGeometry(3.6,1.6,4),M(0xff6b57));rf.position.set(HUT[0],3.3,HUT[1]);rf.rotation.y=Math.PI/4;scene.add(rf);
const sc=document.createElement('canvas');sc.width=256;sc.height=96;const sx=sc.getContext('2d');sx.fillStyle='#0c3b4a';sx.fillRect(0,0,256,96);sx.fillStyle='#f6e7b8';sx.font='64px Lilita One,Trebuchet MS,sans-serif';sx.textAlign='center';sx.fillText('SHOP',128,70);
const sg=new THREE.Mesh(new THREE.PlaneGeometry(2,.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc)}));sg.position.set(HUT[0]-2.02,2.1,HUT[1]);sg.rotation.y=-Math.PI/2;scene.add(sg);
const dockRect=(x,z)=>Math.abs(x)<1.4&&z>10&&z<27;
const hitIsl=(x,z,m)=>COL.some(i=>Math.hypot(x-i[0],z-i[1])<i[2]+m);
const onLand=(x,z)=>Math.hypot(x,z)<13.6||dockRect(x,z)||hitIsl(x,z,0);
const boatBlock=(x,z)=>Math.hypot(x,z)<16.3||(Math.abs(x)<2.5&&z>9&&z<28.3)||hitIsl(x,z,2.4)||Math.hypot(x,z)>215;
// NPC: Kap Barracuda
const NPC={x:2.6,z:4,g:new THREE.Group(),bt:0,tt:3,met:false};NPC.g.position.set(NPC.x,0,NPC.z);NPC.g.scale.setScalar(.78);scene.add(NPC.g);
function nb(w,h,d,c,x,y,z,p){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);(p||NPC.g).add(m);return m}
nb(.3,.8,.32,0x274a8c,-.2,.4,0);nb(.3,.8,.32,0x274a8c,.2,.4,0);nb(.34,.14,.4,0x111111,-.2,.05,.04);nb(.34,.14,.4,0x111111,.2,.05,.04);
nb(.84,.88,.44,0xd8392b,0,1.24,0);nb(.86,.12,.46,0x3b2a1a,0,.83,0);
const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-.58,1.6,0);armR.position.set(.58,1.6,0);NPC.g.add(armL,armR);
[armL,armR].forEach(a=>{nb(.32,.9,.32,0xe0a070,0,-.4,0,a);nb(.34,.3,.34,0xe0a070,0,-.2,0,a)});
nb(.58,.58,.58,0xe0a070,0,1.95,0);nb(.62,.2,.62,0xd8392b,0,2.2,0);nb(.18,.16,.26,0xd8392b,-.34,2.18,-.1);
nb(.52,.12,.06,0x111111,0,2.0,.3);const mouthM=nb(.22,.05,.04,0x7a2d1a,0,1.83,.3);
{const ch=new THREE.Mesh(new THREE.TorusGeometry(.3,.04,8,24),M(0xffd23f));ch.position.set(0,1.64,0);ch.rotation.x=Math.PI/2;ch.scale.set(1,1.1,1);NPC.g.add(ch);
 const pd=new THREE.Mesh(new THREE.OctahedronGeometry(.08),M(0xffd23f));pd.position.set(0,1.45,.3);NPC.g.add(pd)}
function mkLabel(w,h,sx2,sy2){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),t=new THREE.CanvasTexture(c),s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(sx2,sy2,1);scene.add(s);return{c,x,t,s,w,h}}
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
const tagL=mkLabel(512,110,2.8,.6);tagL.s.position.set(NPC.x,2.5,NPC.z);
{const x=tagL.x;rr(x,6,6,500,98,24);x.fillStyle='#0c3b4a';x.fill();x.lineWidth=6;x.strokeStyle='#f6e7b8';x.stroke();x.fillStyle='#f6e7b8';x.font='46px "Lilita One",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('😎 Kap Barracuda',256,58);tagL.t.needsUpdate=true}
const bubL=mkLabel(640,200,4.4,1.38);bubL.s.position.set(NPC.x,3.5,NPC.z);bubL.s.visible=false;
function npcDraw(t,n){const x=bubL.x;x.clearRect(0,0,640,200);rr(x,8,8,624,160,28);x.fillStyle='#fffbe8';x.fill();x.lineWidth=6;x.strokeStyle='#0c3b4a';x.stroke();
 x.fillStyle='#0c3b4a';x.font='38px "Lilita One",sans-serif';x.textAlign='center';x.textBaseline='middle';
 let lines=[],cur='';t.split(' ').forEach(w=>{const tt=cur?cur+' '+w:w;if(x.measureText(tt).width>570&&cur){lines.push(cur);cur=w}else cur=tt});lines.push(cur);lines=lines.slice(0,3);
 const lh=44,y0=88-(lines.length-1)*lh/2;let left=n;
 lines.forEach((l,i)=>{const full=x.measureText(l).width,part=l.slice(0,Math.max(0,Math.min(l.length,left)));left-=l.length+1;
  x.textAlign='left';x.fillText(part,320-full/2,y0+i*lh)});
 bubL.t.needsUpdate=true;bubL.s.visible=true}
// NPC voice: totoong Tagalog voice kung meron sa device, kung wala ay "babble" na tunog
const VOICE={on:true};try{VOICE.on=localStorage.getItem('deepcast_voice')!=='0'}catch(e){}
function npcVoice(t){if(!VOICE.on)return false;try{const ss=window.speechSynthesis;if(!ss)return false;
 const v=ss.getVoices().find(v=>/^(fil|tl)/i.test(v.lang));if(!v)return false;
 ss.cancel();const u=new SpeechSynthesisUtterance(t.replace(/\$/g,' piso '));u.voice=v;u.lang=v.lang;u.rate=1.05;u.pitch=1.4;u.volume=.9;ss.speak(u);return true}catch(e){return false}}
function npcBabble(ch){if(!VOICE.on||!/[a-z0-9]/i.test(ch))return;const c=ch.toLowerCase().charCodeAt(0),f=170+(c%13)*24+Math.random()*14;blip(f,f*(.9+Math.random()*.25),.07,.05,'square')}
function npcBubble(t){NPC.full=t;NPC.n=0;NPC.acc=0;NPC.bt=5+t.length*.04;NPC.tts=npcVoice(t);npcDraw(t,0)}
function npcSay(t){NPC.el=$('npct');if(NPC.el)NPC.el.textContent='';npcBubble(t)}
const dirName=(dx,dz)=>['N','NE','E','SE','S','SW','W','NW'][((Math.round(Math.atan2(dx,-dz)/(Math.PI/4))%8)+8)%8];
const MID=dirName(MI.x-NPC.x,MI.z-NPC.z);
const pickLine=a=>a[R()*a.length|0];
const TAUNTS=['Uy boss! Tatayo ka lang ba diyan?','Sa dagat ang laban, hindi sa tabi!','Ako lang ang pinakamagaling mangisda dito.','Mahina yang rod mo, boss. Bili ka na!',`Gusto mo ng Mythical? Sundan mo yung ilaw sa ${MID}!`,'Ang mythical, nasa Mythic Isle. Kung kaya mo lang.','Isda ba yan o tinga? Ibenta mo na sa akin!','Walang tawad dito. Barracuda ang pangalan ko!'];
const GREET=['Oy, ikaw na naman! Ano dala mo, boss?','Tara, bentahan tayo. Walang tawad!','Kapitan Barracuda dito. Sino ka ba?','Ayos! Mukhang may huli ka ah.'];
const SELLL=[['Tsk, pang-meryenda lang yan.','Barya lang ito, boss. Mas malaki dapat!'],['Hmm, pwede na. Kunin ko na.','Okay lang yan. Pang-ulam.'],['Hindi masama, hindi masama.','Rare! Medyo marunong ka ah.'],['Aba, epic! May ibubuga ka pala!','Ayos! Pang-display yan!'],['LEGENDARY?! Boss, sino ka ba talaga?!','Legendary! Ngayon lang ako nakakita niyan!'],['MYTHICAL?! IDOL KA NA, BOSS!','Mythical! Nakuha mo yan sa Mythic Isle no?!']];
// boat
const BG=new THREE.Group();scene.add(BG);const hullM=M(0x8a5a2b),trimM=M(0xf6e7b8);
function part(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);BG.add(m);return m}
part(new THREE.BoxGeometry(1.7,.5,3.4),hullM,0,.1,0);
{const g=new THREE.ConeGeometry(1.2,1.6,4);g.rotateY(Math.PI/4);g.rotateX(-Math.PI/2);part(g,hullM,0,.1,-2.5).scale.y=.3}
part(new THREE.BoxGeometry(1.5,.05,3.2),trimM,0,.37,0);part(new THREE.BoxGeometry(1.5,.1,.4),trimM,0,.5,.6);
part(new THREE.CylinderGeometry(.05,.05,2.2,6),M(0x5a3a1f),0,1.3,1.3);
part(new THREE.BoxGeometry(.04,.5,.8),M(0xff6b57),0,2.1,1.7);
const cabin=part(new THREE.BoxGeometry(1.4,.9,1.2),M(0xffffff),0,.85,1.0);
const BOATS=[['Rowboat',0,6,0x8a5a2b,1,'Simple and sturdy. Gets you off the dock.'],['Skiff',1500,10,0x2aa7a1,1.15,'Quick little boat for the open sea.'],['Speedboat',9000,16,0xe0453a,1.3,'Fast enough to reach the deep ocean.'],['Yacht',50000,22,0xf4f4f4,1.6,'The fastest ride on the water.']];
function setBoat(i){hullM.color.set(BOATS[i][3]);BG.scale.setScalar(BOATS[i][4]);cabin.visible=i===3}
const moorFor=s=>({x:s%2?-3.6:3.6,z:22-(Math.floor(s/2)%4)*3.6,h:Math.PI,v:0}),B=moorFor(0);
const nearDock=()=>Math.abs(B.x)<9&&B.z>8&&B.z<32;
// rod, held fish & bobber
const rodG=new THREE.Group();cam.add(rodG);rodG.position.set(.35,-.35,-.5);
const rodM=new THREE.Mesh(new THREE.CylinderGeometry(.02,.035,2.2,6),M(0x8a5a2b));rodM.geometry.translate(0,1.1,0);rodG.add(rodM);
const tip=new THREE.Object3D();tip.position.set(0,2.2,0);rodM.add(tip);rodG.rotation.x=-1.2;
const holdG=new THREE.Group();cam.add(holdG);holdG.position.set(.32,-.3,-.75);holdG.visible=false;
const bob=new THREE.Mesh(new THREE.SphereGeometry(.14,12,10),M(0xff3b30));bob.visible=false;scene.add(bob);
const lg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xffffff}));line.frustumCulled=false;line.visible=false;scene.add(line);
// data: name, price, luck, control, bite speed, color, range
const RODS=[['Wooden Rod',0,0,.26,1,0x8a5a2b,0],['Bamboo Rod',200,.4,.28,1.1,0xb8c96a,2],['Carbon Rod',800,.8,.31,1.25,0x333a40,4],['Lucky Rod',3500,1.4,.34,1.4,0x39b36b,6],['Coral Rod',12000,2.2,.38,1.6,0xff7f9e,9],['Mythic Rod',40000,3.2,.42,1.8,0xb04cff,12],['Trident Rod',120000,5,.48,2.1,0x1fb5e0,16],['Celestial Rod',400000,8,.55,2.5,0xffd23f,22]];
// fish: name, tier, minKg, maxKg, value/kg, emoji, minZone (3 = Mythic Isle only)
const F=[
['Sardine',0,.1,.4,12,'🐟',0],['Anchovy',0,.05,.2,14,'🐟',0],['Perch',0,.3,1.2,10,'🐟',0],['Mackerel',0,.4,1.5,11,'🐟',0],['Bluegill',0,.2,.8,13,'🐠',0],['Carp',0,.8,4,8,'🐟',0],
['Bass',1,1,4,16,'🐟',0],['Trout',1,.8,3,18,'🐟',0],['Catfish',1,1,6,15,'🐟',0],['Snapper',1,1.5,5,17,'🐠',0],['Pike',1,2,8,14,'🐟',0],['Clownfish',1,.1,.4,90,'🐠',0],
['Salmon',2,3,9,24,'🐟',0],['Pufferfish',2,.6,2.5,40,'🐡',0],['Tuna',2,10,40,8,'🐟',1],['Barracuda',2,4,12,20,'🐟',1],['Lionfish',2,.5,1.5,80,'🐠',1],['Mahi-Mahi',2,5,15,18,'🐟',1],
['Swordfish',3,20,60,14,'🐟',1],['Anglerfish',3,5,18,35,'🐟',2],['Manta Ray',3,50,120,6,'🐟',1],['Hammerhead',3,80,200,5,'🦈',1],['Giant Squid',3,60,150,7,'🦑',2],['Electric Eel',3,5,20,25,'🐍',1],['Nebula Jelly',3,2,10,200,'🔮',3],
['Golden Koi',4,3,9,90,'🐠',0],['Moon Eel',4,8,25,70,'🐍',1],['Great White',4,150,400,8,'🦈',1],['Sunfire Marlin',4,100,300,10,'🐟',2],['Crystal Seahorse',4,.1,.5,3000,'✨',1],['Aurora Ray',4,40,120,60,'🌈',3],['Crystal Arowana',4,10,30,200,'💎',3],
['Leviathan',5,400,1200,12,'🐉',2],['Kraken Spawn',5,100,400,40,'🐙',2],['Celestial Whale',5,1000,3000,7,'🐋',2],['Abyssal Dragonfish',5,20,60,400,'🐲',2],["Poseidon's Koi",5,5,15,1800,'🔱',1],
['Phoenix Koi',5,8,25,2500,'🔥',3],['Void Whale',5,800,2500,12,'🌌',3],['Eclipse Dragon',5,60,200,300,'🌑',3]];
const TN=['Common','Uncommon','Rare','Epic','Legendary','Mythical'],TC=['#5a6b70','#2f9e4f','#2b7de0','#a23be0','#e0a000','#e0206f'];
const BASE=[55,28,11,5,1.2,.25],ZM=[[1,.8,.3,.06,.008,0],[.7,1,.9,.5,.2,.03],[.25,.6,1,1,.8,.4],[.02,.1,.4,1,1.4,2.2]],ZN=['Shallows','Open Sea','Deep Ocean','Mythic Isle'];
const MU=[['',1,69],['Shiny',2,15],['Albino',3,8],['Glowing',5,4],['Rainbow',10,3],['Galaxy',20,1]];
const zoneAt=(x,z)=>{if(Math.hypot(x-MI.x,z-MI.z)<MI.r)return 3;const d=Math.hypot(x,z);return d<42?0:d<100?1:2};
const S={money:0,rod:0,owned:[1,0,0,0,0,0,0,0],boat:0,bo:[1,0,0,0],bag:[],dex:{},uid:0,held:null,showT:0,showFish:null,flex:0,lastZ:-1,st:'idle',pw:0,pd:1,t:0,onB:false};
const KEY='deepcast_v2';
function save(){try{localStorage.setItem(KEY,JSON.stringify({money:S.money,rod:S.rod,owned:S.owned,boat:S.boat,bo:S.bo,bag:S.bag,dex:S.dex,uid:S.uid}))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d){Object.assign(S,d);while(S.owned.length<RODS.length)S.owned.push(0);while(S.bo.length<BOATS.length)S.bo.push(0);S.bag.forEach(f=>{if(!f.id)f.id=++S.uid;S.uid=Math.max(S.uid,f.id)})}}catch(e){}}
let yaw=Math.PI,pitch=-.1,hold=false,menu=false,menuT='',msgT,tab='sell',invF=-1,curHand=null,typing=false;
function pick(a,w){let s=0;w.forEach(x=>s+=x);let r=R()*s;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]}
function roll(zone){const L=RODS[S.rod][2]+(S.adminLuck||0),tw=BASE.map((w,i)=>w*ZM[zone][i]*Math.pow(1+L*.35,i));let tier=pick([0,1,2,3,4,5],tw),fs;
 while(!(fs=F.filter(f=>f[1]===tier&&f[6]<=zone)).length&&tier>0)tier--;
 const f=fs[R()*fs.length|0],mu=pick(MU,MU.map(m=>m[2]));return mkFish(f,mu)}
function mkFish(f,mu,kg){kg=kg>0?+(+kg).toFixed(2):+(f[2]+R()*(f[3]-f[2])).toFixed(2);return{id:++S.uid,n:(mu[0]?mu[0]+' ':'')+f[0],base:f[0],mu:mu[0],tier:f[1],kg,e:f[5],fav:false,val:Math.max(1,Math.round(kg*f[4]*5*mu[1]))}}
function addToBag(f){S.bag.push(f);const d=S.dex[f.base]||(S.dex[f.base]={c:0,b:0}),nw=d.c===0;d.c++;d.b=Math.max(d.b,f.kg);return nw}
function msg(s){const e=$('msg');e.textContent=s;e.style.opacity=1;clearTimeout(msgT);msgT=setTimeout(()=>e.style.opacity=0,1800)}
function hud(){$('money').textContent='$'+S.money.toLocaleString();const hf=S.held&&S.bag.find(f=>f.id===S.held);$('rodn').textContent=hf?'Holding: '+hf.n:RODS[S.rod][0];$('bag').textContent='Fish: '+S.bag.length}
// held fish model
function fishHue(b){let h=0;for(const c of b)h=(h*31+c.charCodeAt(0))%360;return h}
function buildFish(f){const g=new THREE.Group(),hue=fishHue(f.base)/360,mats=[];
 const mk=(l,s)=>{const m=new THREE.MeshLambertMaterial({color:new THREE.Color().setHSL(hue,s,l)});if(f.mu==='Albino')m.color.setHSL(0,0,.95);if(f.mu==='Shiny')m.color.setHSL(hue,.9,.7);
  const em=f.mu==='Glowing'?1:f.tier===5?.6:f.tier===4?.35:0;if(em){m.emissive=new THREE.Color().setHSL(hue,.8,.45);m.emissiveIntensity=em}mats.push(m);return m};
 const body=new THREE.Mesh(new THREE.SphereGeometry(.5,18,12),mk(.55,.65));body.scale.set(1.6,.75,.5);g.add(body);
 const tail=new THREE.Mesh(new THREE.ConeGeometry(.4,.7,4),mk(.45,.7));tail.rotation.z=Math.PI/2;tail.position.x=-1.15;tail.scale.z=.35;g.add(tail);
 const fin=new THREE.Mesh(new THREE.ConeGeometry(.3,.45,4),mk(.4,.7));fin.position.set(-.1,.45,0);fin.scale.z=.2;g.add(fin);
 const eyeM=new THREE.MeshBasicMaterial({color:0x111111});[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),eyeM);e.position.set(.85,.12,s*.2);g.add(e)});
 g.userData={mats,mu:f.mu,hue};return g}
function updateHand(dt){S.showT=Math.max(0,S.showT-dt);S.flex=Math.max(0,S.flex-dt);
 let f=null;if(S.showT>0)f=S.showFish;else if(S.held){f=S.bag.find(x=>x.id===S.held);if(!f){S.held=null;hud()}}
 const id=f?f.id:null;
 if(id!==curHand){curHand=id;while(holdG.children.length)holdG.remove(holdG.children[0]);if(f)holdG.add(buildFish(f))}
 holdG.visible=!!f;rodG.visible=!f;
 if(f){const m=holdG.children[0],s=Math.min(.55,.1+.12*Math.log10(1+f.kg*3)),fl=S.flex>0?S.flex/.6:0;m.scale.setScalar(s);
  holdG.position.set(.32,-.3+Math.sin(S.t*2)*.015+Math.sin(fl*Math.PI)*.25,-.75+Math.sin(fl*Math.PI)*.15);
  holdG.rotation.y=Math.sin(S.t*1.2)*.45+fl*Math.PI*2;holdG.rotation.z=Math.sin(S.t*1.7)*.08;
  const u=m.userData;if(u.mu==='Rainbow')u.mats.forEach(x=>x.color.setHSL((S.t*.4)%1,.85,.55));
  else if(u.mu==='Galaxy')u.mats.forEach(x=>{x.color.setHSL(.72+Math.sin(S.t)*.08,.8,.3);x.emissive=x.emissive||new THREE.Color();x.emissive.setHSL(.8+Math.sin(S.t*1.3)*.1,.9,.4);x.emissiveIntensity=.8})}}
// audio
let ac;
function initAudio(){ac=new (window.AudioContext||window.webkitAudioContext)();const b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R()*2-1;
 const s=ac.createBufferSource();s.buffer=b;s.loop=true;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=500;const g=ac.createGain();g.gain.value=.06;const l=ac.createOscillator(),lg2=ac.createGain();l.frequency.value=.12;lg2.gain.value=.04;l.connect(lg2).connect(g.gain);l.start();s.connect(f).connect(g).connect(ac.destination);s.start()}
function blip(a,b,d,v,ty='sine',delay=0){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime+delay;o.type=ty;o.frequency.setValueAtTime(a,n);o.frequency.exponentialRampToValueAtTime(b,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(ac.destination);o.start(n);o.stop(n+d)}
// ===== Background music (procedural, walang copyright, walang file) =====
const MUS={on:true,g:null,step:0,next:0,tid:null};try{MUS.on=localStorage.getItem('deepcast_music')!=='0'}catch(e){}
const mtof=m=>440*Math.pow(2,(m-69)/12);
function mnote(f,t,d,ty,v,at){const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+at);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(MUS.g);o.start(t);o.stop(t+d+.05)}
const CH=[[48,55,64],[43,50,59],[45,52,60],[41,48,57]],MEL=[[76,0,79,0,81,79,0,76],[74,0,76,0,79,0,76,74],[72,0,76,0,81,0,79,76],[74,76,0,72,0,0,69,0]],SP=.33;
function musStep(t,n){const bar=(n>>3)%4,st=n&7,ch=CH[bar];
 if(st===0){mnote(mtof(ch[0]-12),t,SP*7.5,'triangle',.20,.04);ch.forEach(m=>mnote(mtof(m),t,SP*7.5,'sine',.07,.9))}
 if(st===4)mnote(mtof(ch[1]-12),t,SP*3,'triangle',.10,.03);
 mnote(mtof(ch[[0,1,2,1,2,1,0,2][st]]+12),t,SP*1.6,'triangle',.05,.01);
 const m=MEL[bar][st];if(m)mnote(mtof(m),t,SP*2.6,'sine',.13,.015)}
function musTick(){if(!ac||!MUS.g)return;while(MUS.next<ac.currentTime+.6){musStep(MUS.next,MUS.step++);MUS.next+=SP}}
function startMusic(){if(!ac||MUS.g)return;MUS.g=ac.createGain();MUS.g.gain.value=MUS.on?.55:0;
 const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;const out=ac.createGain();out.gain.value=.5;
 const dl=ac.createDelay(1);dl.delayTime.value=SP*1.5;const fb=ac.createGain();fb.gain.value=.38;const wet=ac.createGain();wet.gain.value=.35;
 MUS.g.connect(lp);lp.connect(out);lp.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(out);out.connect(ac.destination);
 MUS.next=ac.currentTime+.2;musTick();MUS.tid=setInterval(musTick,150)}
function setMusic(on){MUS.on=on;try{localStorage.setItem('deepcast_music',on?'1':'0')}catch(e){}if(MUS.g)MUS.g.gain.setTargetAtTime(on?.55:0,ac.currentTime,.15);const b=document.getElementById('musbtn');if(b)b.textContent=(on?'🎵':'🔇')+' Music (M)'}
document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend();else ac.resume()});
// input
const keys={};let rdrag=false;
addEventListener('keydown',e=>{if(typing)return;
 if(e.code==='Escape'){if(S.go)closeAny();return}
 if(/^(INPUT|SELECT|TEXTAREA)$/.test((e.target&&e.target.tagName)||''))return;
 keys[e.code]=true;if(!S.go)return;
 if((e.code==='KeyT'||e.code==='Enter')&&!menu){e.preventDefault();openChat();return}
 if(e.code==='F2'){e.preventDefault();toggleAdmin();return}
 if(e.code==='KeyM'){setMusic(!MUS.on);msg(MUS.on?'Music: ON':'Music: OFF');return}
 if(e.code==='KeyV'){VOICE.on=!VOICE.on;try{localStorage.setItem('deepcast_voice',VOICE.on?'1':'0');window.speechSynthesis&&window.speechSynthesis.cancel()}catch(x){}msg(VOICE.on?'NPC voice: ON':'NPC voice: OFF');return}
 if(e.code==='KeyE')interact();
 if(e.code==='Escape')closeAny();
 if(e.code==='KeyI'||e.code==='KeyB')toggleInv();
 if(/^Digit[1-9]$/.test(e.code))selectSlot(+e.code[5]-1);
 if(e.code==='Space'){e.preventDefault();if(!menu)shake()}});
addEventListener('keyup',e=>keys[e.code]=false);
ren.domElement.addEventListener('contextmenu',e=>e.preventDefault());
ren.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;if(e.button===2){rdrag=true;return}hold=true;if(!S.go||menu)return;
 if(S.held){S.flex=.6;const f=S.bag.find(x=>x.id===S.held);if(f)msg(`${f.n}! ${f.kg} kg`);return}
 S.showT=0;
 if(S.st==='idle'){S.st='charge';S.pw=0;S.pd=1;$('power').style.display='block'}else if(S.st==='wait')cancel()});
ren.domElement.addEventListener('pointermove',e=>{if(rdrag){yaw-=e.movementX*.005;pitch=Math.max(-1,Math.min(1,pitch-e.movementY*.005))}});
addEventListener('pointerup',e=>{if(e.pointerType==='touch')return;if(e.button===2){rdrag=false;return}hold=false;if(S.st==='charge')cast()});
function cast(){$('power').style.display='none';const rg=RODS[S.rod][6],d=5+S.pw*(22+rg),fx=-Math.sin(yaw),fz=-Math.cos(yaw),tx=cam.position.x+fx*d,tz=cam.position.z+fz*d;
 if(onLand(tx,tz)||Math.hypot(tx,tz)<15||Math.abs(tx)>215||Math.abs(tz)>215){msg('Aim at open water');S.st='idle';return}
 tip.getWorldPosition(S.a=new THREE.Vector3());S.tx=tx;S.tz=tz;S.u=0;S.st='fly';bob.visible=line.visible=true;blip(500,200,.25,.08,'triangle')}
function cancel(){S.st='idle';bob.visible=line.visible=false;$('reel').style.display='none';$('power').style.display='none'}
function shake(){if(S.st==='wait'&&S.bt>0){S.bt=Math.max(.2,S.bt-1);S.shk=.3;blip(300,500,.1,.06,'triangle')}}
function startReel(){S.zone=zoneAt(S.tx,S.tz);S.fish=roll(S.zone);S.st='reel';const tr=S.fish.tier,rd=RODS[S.rod];S.w=rd[3];S.fp=.5;S.ft=.5;S.fc=0;S.bp=.5;S.bv=0;S.pr=.3;S.fs=.22+tr*.08;S.loss=.2+tr*.012;$('reel').style.display='block';$('zone').style.width=S.w*100+'%';msg('Bite! Hold to reel');blip(700,900,.2,.12,'square')}
function flash(col){const f=$('flash');f.style.transition='none';f.style.background=`radial-gradient(circle,transparent 35%,${col}cc)`;f.style.opacity=1;requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transition='opacity 1.2s';f.style.opacity=0}))}
function endReel(ok){$('reel').style.display='none';bob.visible=line.visible=false;S.st='idle';
 if(ok){const f=S.fish,nw=addToBag(f);
  S.showFish=f;S.showT=2.8;
  const c=$('catch');c.innerHTML=`<div class="em">${f.e}</div><h2 class="${f.tier===5?'myth':''}" style="color:${TC[f.tier]}">${f.n}</h2><div>${TN[f.tier]} · ${f.kg} kg</div><div>Worth $${f.val.toLocaleString()}</div>${nw?'<div style="color:#e0206f">NEW in Fishdex!</div>':''}<small>Saved in your backpack (I)</small>`;c.style.display='block';c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');if(window.catchFx)catchFx(f);setTimeout(()=>c.style.display='none',2800);
  if(f.tier>=4){netSend({t:'catch',n:f.n,tier:f.tier,kg:f.kg,e:f.e});flash(TC[f.tier]);msg(f.tier===5?'MYTHICAL CATCH!':'LEGENDARY CATCH!');[0,.12,.24,.36].forEach((t,i)=>blip(500+i*180,700+i*220,.3,.14,'triangle',t))}else blip(500,1000,.4,.15);
  hud();drawHotbar();save()}
 else msg('It got away...')}
// menus
function closeAny(){if(menuT==='shop')closeShop();else if(menuT==='inv')closeInv();else if(menuT==='adm')closeAdmin()}
function interact(){if(!S.go||S.st==='reel')return;if(menu){closeAny();return}
 const nShop=Math.min(Math.hypot(cam.position.x-HUT[0],cam.position.z-HUT[1]),Math.hypot(cam.position.x-NPC.x,cam.position.z-NPC.z));
 if(S.onB){if(nearDock()){if(S.st!=='idle')cancel();S.onB=false;B.v=0;cam.position.set(0,1.7,Math.max(12,Math.min(26,B.z)));cam.fov=70;cam.updateProjectionMatrix();msg('Docked')}else msg('Sail closer to the dock to get off');return}
 const nBoat=Math.hypot(cam.position.x-B.x,cam.position.z-B.z);
 if(nShop<4.8&&nShop<=nBoat)openShop();else if(nBoat<5&&S.st==='idle'){S.onB=true;B.v=0;msg('W/S throttle · A/D steer')}}
function openShop(){menu=true;menuT='shop';$('shop').style.display='flex';draw();
 const hf=S.held&&S.bag.find(f=>f.id===S.held);
 npcSay(hf?`Wow, ang laki ng ${hf.n}! ${hf.tier>=4?'Idol! ':''}Ibenta mo na sa akin yan.`:pickLine(GREET))}
function closeShop(){menu=false;menuT='';$('shop').style.display='none'}$('close').onclick=closeShop;
function toggleInv(){if(!S.go||S.st==='reel')return;if(menuT==='inv')closeInv();else if(!menu)openInv()}
function openInv(){menu=true;menuT='inv';$('inv').style.display='flex';drawInv()}
function closeInv(){menu=false;menuT='';$('inv').style.display='none'}
$('iclose').onclick=closeInv;$('bagbtn').onclick=toggleInv;
// hotbar
const favs=()=>S.bag.filter(f=>f.fav).slice(0,8);
function drawHotbar(){const fv=favs();let h=`<div class="slot ${!S.held?'on':''}" data-s="0"><i>1</i><span>🎣</span></div>`;
 fv.forEach((f,i)=>h+=`<div class="slot ${S.held===f.id?'on':''}" data-s="${i+1}" style="border-color:${TC[f.tier]}" title="${f.n}"><i>${i+2}</i><span>${f.e}</span></div>`);$('hotbar').innerHTML=h}
function selectSlot(n){if(menu)return;if(n>0&&S.st!=='idle'){msg('Reel in first');return}
 if(n===0){S.held=null;S.showT=0;msg(RODS[S.rod][0])}else{const f=favs()[n-1];if(!f)return;S.held=S.held===f.id?null:f.id;S.showT=0;msg(S.held?`${f.n} · ${f.kg} kg`:RODS[S.rod][0])}
 hud();drawHotbar()}
$('hotbar').onclick=e=>{const s=e.target.closest('.slot');if(s)selectSlot(+s.dataset.s)};
// backpack
function drawInv(){const sc0=$('ibody').scrollTop;
 const items=S.bag.filter(f=>invF<0||f.tier===invF).sort((a,b)=>b.tier-a.tier||b.kg-a.kg);
 $('ichips').innerHTML=['All',...TN].map((n,i)=>`<button class="tab ${invF===i-1?'on':''}" data-f="${i-1}">${n}</button>`).join('');
 $('icount').textContent=S.bag.length+' fish';
 let h='';items.slice(0,120).forEach(f=>{h+=`<div class="fc ${S.held===f.id?'held':''}" style="border-color:${TC[f.tier]}"><div class="e">${f.e}</div><div class="${f.tier===5?'myth':''}" style="color:${TC[f.tier]}">${f.n}</div><small>${TN[f.tier]} · ${f.kg} kg · $${f.val.toLocaleString()}</small><div class="bt"><button data-a="hold" data-id="${f.id}">${S.held===f.id?'Put away':'Hold'}</button><button data-a="fav" data-id="${f.id}" style="background:${f.fav?'#e0a000':'var(--deep)'}">${f.fav?'★':'☆'}</button><button data-a="rel" data-id="${f.id}" style="background:var(--deep)" ${f.fav?'disabled':''}>Release</button></div></div>`});
 if(items.length>120)h+=`<div style="grid-column:1/-1;text-align:center;font-size:14px">...at ${items.length-120} pa</div>`;
 if(!items.length)h='<div style="grid-column:1/-1;text-align:center;padding:30px;font-size:18px">Walang isda dito. Mangisda ka muna!</div>';
 $('ibody').innerHTML=h;$('ibody').scrollTop=sc0}
$('ichips').onclick=e=>{const t=e.target.dataset.f;if(t!==undefined){invF=+t;drawInv()}};
$('ibody').onclick=e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a,id=+b.dataset.id,f=S.bag.find(x=>x.id===id);if(!f)return;
 if(a==='hold'){if(S.st!=='idle'){msg('Reel in first');return}S.held=S.held===id?null:id;S.showT=0;closeInv();hud();drawHotbar();msg(S.held?`Holding ${f.n}`:RODS[S.rod][0]);return}
 if(a==='fav'){f.fav=!f.fav;if(f.fav&&favs().indexOf(f)<0)msg('Hotbar shows the first 8 favorites');drawHotbar()}
 if(a==='rel'){if(f.tier>=3&&!confirm(`Release ${f.n} back to the sea?`))return;S.bag=S.bag.filter(x=>x.id!==id);if(S.held===id)S.held=null;hud();drawHotbar();msg(`${f.n} swam away`)}
 save();drawInv()};
// shop
const bar=(l,p)=>`<span>${l}</span><div class="bar"><i style="width:${Math.min(100,p*100)}%"></i></div>`;
const tag=t=>`<span class="tag" style="background:${TC[t]}">${TN[t]}</span>`;
const hex=c=>'#'+c.toString(16).padStart(6,'0');
const VIEW={
 sell(){const sl=S.bag.filter(f=>!f.fav),tot=sl.reduce((a,f)=>a+f.val,0),cheap=sl.filter(f=>f.tier<2),ct=cheap.reduce((a,f)=>a+f.val,0);
  let h=`<div class="it"><div class="ic" style="background:#7be37b">💰</div><div class="tx">${S.bag.length} fish in your bag<br><small>Sellable value $${tot.toLocaleString()} · ★ favorites are protected</small></div><div style="display:grid;gap:6px"><button data-a="sellall" ${sl.length?'':'disabled'}>Sell all</button><button data-a="sellcheap" style="background:var(--deep)" ${cheap.length?'':'disabled'}>Sell Common+Uncommon ($${ct.toLocaleString()})</button></div></div>`;
  const list=[...S.bag].sort((a,b)=>b.val-a.val);
  list.slice(0,60).forEach(f=>{h+=`<div class="it"><div class="ic" style="background:#fff">${f.e}</div><div class="tx"><span class="${f.tier===5?'myth':''}">${f.n}</span> ${tag(f.tier)} ${f.fav?'★':''}<br><small>${f.kg} kg</small></div><button data-a="sell1" data-id="${f.id}" ${f.fav?'disabled':''}>${f.fav?'★ Locked':'Sell $'+f.val.toLocaleString()}</button></div>`});
  if(list.length>60)h+=`<div style="text-align:center;font-size:14px">...and ${list.length-60} more (sell all to clear)</div>`;
  if(!S.bag.length)h+='<div style="text-align:center;padding:20px;font-size:18px">Your bag is empty. Go catch something!</div>';return h},
 rods(){return RODS.map((r,i)=>{const own=S.owned[i],eq=S.rod===i;return`<div class="it"><div class="ic" style="background:${hex(r[5])}">🎣</div><div class="tx">${r[0]}<div class="st">${bar('Luck',r[2]/8)}${bar('Control',r[3]/.55)}${bar('Bite speed',(r[4]-1)/1.5)}${bar('Range',r[6]/22)}</div></div><button data-a="rod" data-i="${i}" class="${eq?'eq':''}" ${eq||(!own&&S.money<r[1])?'disabled':''}>${eq?'Equipped':own?'Equip':'$'+r[1].toLocaleString()}</button></div>`}).join('')},
 boats(){let h=`<div class="it"><div class="ic" style="background:#9fdcf0">⚓</div><div class="tx">Boat stuck somewhere?<br><small>Send it back to the dock.</small></div><button data-a="callboat" style="background:var(--deep)" ${S.onB?'disabled':''}>Return to dock</button></div>`;
  return h+BOATS.map((b,i)=>{const own=S.bo[i],eq=S.boat===i;return`<div class="it"><div class="ic" style="background:${hex(b[3])}">⛵</div><div class="tx">${b[0]}<br><small>${b[5]}</small><div class="st">${bar('Speed',b[2]/22)}</div></div><button data-a="boat" data-i="${i}" class="${eq?'eq':''}" ${eq||(!own&&S.money<b[1])?'disabled':''}>${eq?'In use':own?'Use':'$'+b[1].toLocaleString()}</button></div>`}).join('')},
 dex(){const found=F.filter(f=>S.dex[f[0]]).length;let h=`<div class="sec">Discovered ${found} / ${F.length}</div>`;
  for(let t=0;t<TN.length;t++){h+=`<div class="sec" style="color:${TC[t]}">${TN[t]}</div><div class="dex">`+F.filter(f=>f[1]===t).map(f=>{const d=S.dex[f[0]];return`<div class="dx ${d?'':'no'}"><div class="e">${f[5]}</div>${d?f[0]+`<br><small>best ${d.b} kg · x${d.c}</small>`:'???<br><small>'+ZN[f[6]]+(f[6]<3?'+':' only')+'</small>'}</div>`}).join('')+'</div>'}return h}};
const TABSAY={sell:()=>pickLine(GREET),rods:()=>'Mahina yang rod mo, boss. Tingnan mo mga ito.',boats:()=>`Gusto mo ng Mythical? Maglayag ka papuntang ${MID}, hanapin mo yung ilaw!`,dex:()=>'Kumpletuhin mo yan, boss. Ako, kumpleto na ako dyan.'};
function draw(){const sc0=$('tabc').scrollTop;$('sm').textContent='$'+S.money.toLocaleString();document.querySelectorAll('.tab').forEach(b=>{if(b.dataset.t)b.classList.toggle('on',b.dataset.t===tab)});$('tabc').innerHTML=VIEW[tab]();$('tabc').scrollTop=sc0}
$('tabs').onclick=e=>{const t=e.target.dataset.t;if(t){tab=t;$('tabc').scrollTop=0;draw();npcSay(TABSAY[t]())}};
function sellList(arr){if(!arr.length)return;const ids=new Set(arr.map(f=>f.id)),tot=arr.reduce((a,f)=>a+f.val,0),bt=Math.max(...arr.map(f=>f.tier));
 S.money+=tot;S.bag=S.bag.filter(f=>!ids.has(f.id));if(ids.has(S.held))S.held=null;blip(800,1200,.3,.15);npcSay(pickLine(SELLL[bt])+` (+$${tot.toLocaleString()})`);drawHotbar()}
$('tabc').onclick=e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a,i=+b.dataset.i,id=+b.dataset.id;
 if(a==='sellall')sellList(S.bag.filter(f=>!f.fav));
 else if(a==='sellcheap')sellList(S.bag.filter(f=>!f.fav&&f.tier<2));
 else if(a==='sell1')sellList(S.bag.filter(f=>f.id===id&&!f.fav));
 else if(a==='rod'){const r=RODS[i];if(!S.owned[i]){if(S.money<r[1])return;S.money-=r[1];S.owned[i]=1;npcSay('Astig na rod yan! Bagay sa iyo, boss.')}else npcSay('Ayan, ready ka na ulit.');S.rod=i;rodM.material=M(r[5]);blip(400,800,.2,.12)}
 else if(a==='boat'){const bt=BOATS[i];if(!S.bo[i]){if(S.money<bt[1])return;S.money-=bt[1];S.bo[i]=1;npcSay('Sakay na! Ingat sa dagat ha.')}S.boat=i;setBoat(i);Object.assign(B,moor());blip(400,800,.2,.12)}
 else if(a==='callboat'){Object.assign(B,moor());npcSay('Ibinalik ko na yung bangka mo sa dock.')}
 hud();save();draw()};
// ===== Chat, multiplayer at admin =====
const N={ws:null,id:null,slot:0,connected:false,name:'Player',players:new Map(),plist:[],acc:0,admin:false,to:null};
const A={on:false,tab:'me'};
const moor=()=>moorFor(N.slot);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hueOf=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const netSend=o=>{if(N.ws&&N.ws.readyState===1)N.ws.send(JSON.stringify(o))};
// --- chat ---
function chatLine(parts,cls){const log=$('clog'),d=document.createElement('div');d.className='m'+(cls?' '+cls:'');
 parts.forEach(p=>{const s=document.createElement('span');s.textContent=p[0];if(p[1])s.style.color=p[1];d.appendChild(s)});
 log.appendChild(d);while(log.children.length>60)log.removeChild(log.children[0]);log.scrollTop=log.scrollHeight}
function chatAdd(m){const col=`hsl(${hueOf(m.name)},85%,72%)`;
 if(m.me)chatLine([['* '+m.name+' '+m.text,col]],'me');
 else chatLine([...(m.admin?[['[ADMIN] ','#ff6b6b']]:[]),[m.name+': ',col],[m.text,'#fff']]);
 if(S.go&&!m.old&&m.id!==N.id){const r=N.players.get(m.id);if(r)remoteSay(r,m.text)}}
function chatSys(t,c){chatLine([[t,c||'#ffd23f']],'sys')}
function showAnn(t){const e=$('ann');e.textContent='📢 '+t;e.style.opacity=1;clearTimeout(showAnn.t);showAnn.t=setTimeout(()=>e.style.opacity=0,7000);chatSys('📢 '+t,'#ff9f43')}
function openChat(){if(!S.go||menu)return;typing=true;menu=true;menuT='chat';Object.keys(keys).forEach(k=>keys[k]=false);hold=false;$('chat').classList.add('on');const i=$('cin');i.style.display='block';i.value='';i.focus()}
function closeChat(){if(!typing)return;typing=false;if(menuT==='chat'){menu=false;menuT=''}$('chat').classList.remove('on');const i=$('cin');i.style.display='none';i.blur()}
$('cin').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){const t=$('cin').value;closeChat();sendChat(t)}else if(e.key==='Escape')closeChat()});
$('cin').addEventListener('blur',()=>closeChat());
function sendOut(text,me){if(N.connected)netSend({t:'chat',text,me});else chatAdd({name:N.name,text,me,admin:A.on,id:N.id})}
function sendChat(t){t=String(t||'').trim();if(!t)return;
 if(t[0]==='/'){const parts=t.slice(1).split(' '),c=parts[0].toLowerCase(),a=parts.slice(1).join(' ');
  if(c==='help')chatSys('Commands: /help · /me <aksyon> · /players · /clear · /admin   |   T o Enter = chat · F2 = admin panel');
  else if(c==='me'){if(a)sendOut(a,true)}
  else if(c==='players')chatSys('Online: '+[N.name,...[...N.players.values()].map(p=>p.name)].join(', '));
  else if(c==='clear')$('clog').innerHTML='';
  else if(c==='admin')toggleAdmin();
  else chatSys('Hindi kilalang command. Subukan ang /help');
  return}
 sendOut(t,false)}
// --- network ---
function serverUrl(){const v=$('pserver').value.trim(),ws=location.protocol==='https:'?'wss://':'ws://';
 if(v){if(/^wss?:\/\//i.test(v))return v.replace(/\/+$/,'')+'/deepcast';return ws+v.replace(/^https?:\/\//i,'').replace(/\/+$/,'')+'/deepcast'}
 if(/^https?:$/.test(location.protocol))return ws+location.host+'/deepcast';return ''}
function startNet(){N.name=($('pname').value.trim()||'Mangingisda'+(100+R()*900|0)).slice(0,16);try{localStorage.setItem('deepcast_name',N.name)}catch(e){}
 chatSys('Welcome, '+N.name+'! Pindutin ang T para mag-chat · /help para sa commands.','#9fe8ff');
 const url=serverUrl();if(!url){chatSys('Offline mode (walang server). Patakbuhin ang server.js para sa multiplayer.');return}
 try{N.ws=new WebSocket(url)}catch(e){chatSys('Hindi maka-connect: '+e.message);return}
 chatSys('Kumokonekta sa server...');
 N.to=setTimeout(()=>{if(!N.connected){try{N.ws.close()}catch(e){}chatSys('Walang sumagot na server. Offline mode.')}},4000);
 N.ws.onopen=()=>netSend({t:'join',name:N.name});
 N.ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}try{netMsg(m)}catch(e){console.error(e)}};
 N.ws.onclose=()=>{clearTimeout(N.to);if(N.connected)chatSys('Na-disconnect sa server. Offline mode na.','#ff6b6b');N.connected=false;N.admin=false;A.on=false;[...N.players.keys()].forEach(removeRemote);N.slot=0;Object.assign(B,moor());N.ws=null;if(menuT==='adm')drawAdmin()};
 N.ws.onerror=()=>{}}
function netMsg(m){switch(m.t){
 case 'welcome':clearTimeout(N.to);N.connected=true;N.id=m.id;N.slot=m.slot;N.name=m.name;if(!S.onB)Object.assign(B,moor());(m.players||[]).forEach(addRemote);(m.log||[]).forEach(x=>chatAdd(Object.assign({},x,{old:true})));chatSys('Nakakonekta! '+((m.players||[]).length+1)+' player(s) online.','#7be37b');break;
 case 'join':addRemote(m.p);chatSys(m.p.name+' ay sumali.','#7be37b');break;
 case 'leave':{const r=N.players.get(m.id);if(r){chatSys(r.name+' ay umalis.','#aaaaaa');removeRemote(m.id)}break}
 case 's':m.p.forEach(updRemote);break;
 case 'chat':chatAdd(m);break;
 case 'sys':chatSys(m.text,m.color);break;
 case 'announce':showAnn(m.text);break;
 case 'clearchat':$('clog').innerHTML='';chatSys('Nilinis ng admin ang chat.');break;
 case 'admin':A.on=!!m.ok;N.admin=!!m.ok;if(m.ok){chatSys('Admin access granted.','#ff6b6b');netSend({t:'admin',cmd:'players'})}else{chatSys('Maling admin password.','#ff6b6b');msg('Maling password')}if(menuT==='adm')drawAdmin();break;
 case 'players':N.plist=m.list||[];if(menuT==='adm')drawAdmin();break;
 case 'kicked':chatSys('Na-kick ka: '+(m.reason||''),'#ff6b6b');msg(m.reason||'Na-kick ka');break}}
// --- other players ---
function drawBubble(L,t){const x=L.x;x.clearRect(0,0,640,200);rr(x,8,8,624,160,28);x.fillStyle='#fffbe8';x.fill();x.lineWidth=6;x.strokeStyle='#0c3b4a';x.stroke();
 x.fillStyle='#0c3b4a';x.font='38px "Lilita One",sans-serif';x.textAlign='center';x.textBaseline='middle';
 let lines=[],cur='';String(t).split(' ').forEach(w=>{const tt=cur?cur+' '+w:w;if(x.measureText(tt).width>570&&cur){lines.push(cur);cur=w}else cur=tt});lines.push(cur);lines=lines.slice(0,3);
 const lh=44,y0=88-(lines.length-1)*lh/2;lines.forEach((l,i)=>x.fillText(l,320,y0+i*lh));L.t.needsUpdate=true;L.s.visible=true}
function makeAvatar(col){const g=new THREE.Group(),b=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);g.add(m)};
 b(.3,.8,.32,0x2b3a55,-.2,.4,0);b(.3,.8,.32,0x2b3a55,.2,.4,0);b(.84,.88,.44,col,0,1.24,0);b(.3,.86,.3,0xe0a070,-.58,1.2,0);b(.3,.86,.3,0xe0a070,.58,1.2,0);b(.56,.56,.56,0xe0a070,0,1.95,0);b(.6,.16,.6,0x3b2a1a,0,2.24,0);
 g.scale.setScalar(.78);return g}
const RB={hull:new THREE.BoxGeometry(1.7,.5,3.4),floor:new THREE.BoxGeometry(1.5,.05,3.2),bow:(()=>{const g=new THREE.ConeGeometry(1.2,1.6,4);g.rotateY(Math.PI/4);g.rotateX(-Math.PI/2);return g})()};
function makeRBoat(t){const g=new THREE.Group(),mat=M(BOATS[t][3]),h=new THREE.Mesh(RB.hull,mat);h.position.y=.1;g.add(h);
 const b=new THREE.Mesh(RB.bow,mat);b.position.set(0,.1,-2.5);b.scale.y=.3;g.add(b);const f=new THREE.Mesh(RB.floor,trimM);f.position.y=.37;g.add(f);g.scale.setScalar(BOATS[t][4]);return g}
function addRemote(p){if(!p||p.id===N.id||N.players.has(p.id))return;
 const av=makeAvatar(new THREE.Color().setHSL(hueOf(p.name)/360,.6,.5).getHex()),tag=mkLabel(512,110,2.2,.47);
 {const x=tag.x;rr(x,6,6,500,98,24);x.fillStyle='#0c3b4acc';x.fill();x.fillStyle='#f6e7b8';x.font='50px "Lilita One",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(p.name,256,58);tag.t.needsUpdate=true}
 av.visible=false;scene.add(av);tag.s.visible=false;
 const r={id:p.id,name:p.name,av,tag,bub:null,bt:0,bm:null,bType:-1,x:0,z:0,yaw:0,onB:0,bx:0,bz:0,bh:0,seen:false};N.players.set(p.id,r);
 if(p.x!==undefined)updRemote([p.id,p.x,p.z,p.yaw,p.onB,p.bx,p.bz,p.bh,p.bt])}
function updRemote(a){const r=N.players.get(a[0]);if(!r)return;r.x=a[1];r.z=a[2];r.yaw=a[3];r.onB=a[4];r.bx=a[5];r.bz=a[6];r.bh=a[7];
 if(a[8]!==r.bType){r.bType=a[8];if(r.bm)scene.remove(r.bm);r.bm=makeRBoat(a[8]>=0&&a[8]<BOATS.length?a[8]:0);scene.add(r.bm)}
 if(!r.seen){r.seen=true;r.av.position.set(r.x,0,r.z);r.bm.position.set(r.bx,0,r.bz);r.bm.rotation.y=r.bh;r.av.visible=true;r.tag.s.visible=true}}
function removeRemote(id){const r=N.players.get(id);if(!r)return;scene.remove(r.av);scene.remove(r.tag.s);if(r.bm)scene.remove(r.bm);if(r.bub){scene.remove(r.bub.s);r.bub.t.dispose()}r.tag.t.dispose();N.players.delete(id)}
function remoteSay(r,t){if(!r.bub)r.bub=mkLabel(640,200,3.4,1.06);drawBubble(r.bub,String(t).slice(0,90));r.bt=5}
function netTick(dt){$('net').textContent=N.connected?'🌐 '+(N.players.size+1)+' online':'📴 Offline';
 if(N.connected&&S.go){N.acc+=dt;if(N.acc>=.1){N.acc=0;const p=cam.position;netSend({t:'state',x:+p.x.toFixed(2),z:+p.z.toFixed(2),yaw:+yaw.toFixed(2),onB:S.onB?1:0,bx:+B.x.toFixed(2),bz:+B.z.toFixed(2),bh:+B.h.toFixed(2),bt:S.boat})}}
 const k=Math.min(1,dt*10);
 N.players.forEach(r=>{if(!r.seen)return;const bm=r.bm,av=r.av;
  bm.position.x+=(r.bx-bm.position.x)*k;bm.position.z+=(r.bz-bm.position.z)*k;bm.position.y=W(bm.position.x,bm.position.z,S.t)+.25;
  let dh=r.bh-bm.rotation.y;dh=Math.atan2(Math.sin(dh),Math.cos(dh));bm.rotation.y+=dh*k;
  const tx=r.onB?bm.position.x:r.x,tz=r.onB?bm.position.z:r.z;av.position.x+=(tx-av.position.x)*k;av.position.z+=(tz-av.position.z)*k;av.position.y=r.onB?bm.position.y+.2:.05;
  let dy=r.yaw+Math.PI-av.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));av.rotation.y+=dy*k;
  r.tag.s.position.set(av.position.x,av.position.y+2.25,av.position.z);
  r.bt-=dt;if(r.bub){r.bub.s.visible=r.bt>0;r.bub.s.position.set(av.position.x,av.position.y+3.2,av.position.z)}})}
// --- admin panel ---
function toggleAdmin(){if(!S.go)return;if(menuT==='adm')closeAdmin();else if(!menu)openAdmin()}
function openAdmin(){menu=true;menuT='adm';$('adm').style.display='flex';drawAdmin();if(N.connected&&A.on)netSend({t:'admin',cmd:'players'})}
function closeAdmin(){menu=false;menuT='';$('adm').style.display='none'}
$('aclose').onclick=closeAdmin;
$('atabs').onclick=e=>{const t=e.target.dataset.at;if(t){A.tab=t;drawAdmin();if(t==='plist'&&N.connected&&A.on)netSend({t:'admin',cmd:'players'})}};
function doLogin(pw){if(N.connected)netSend({t:'admin-login',pw});else if(pw===CONFIG.ADMIN_PW){A.on=true;chatSys('Admin (offline) enabled.','#ff6b6b');drawAdmin()}else{chatSys('Maling admin password.','#ff6b6b');msg('Maling password')}}
const arow=(ic,tx)=>`<div class="it"><div class="ic" style="background:#fff">${ic}</div><div class="tx">${tx}</div></div>`;
const alogin=()=>`<div class="it"><div class="ic" style="background:#ff6b57">🔒</div><div class="tx">Admin login<br><small>${N.connected?'Ang password ay nasa server.js (ADMIN_PASSWORD).':'Offline: ang password ay nasa CONFIG sa game.js.'}</small><div style="margin-top:6px"><input id="a-pw" type="password" placeholder="Admin password" style="width:100%;box-sizing:border-box"></div></div><button data-act="login">Login</button></div>`;
const AVIEW={
 me(){const rodO=RODS.map((r,i)=>`<option value="${i}" ${i===S.rod?'selected':''}>${r[0]}</option>`).join(''),fishO=F.map(f=>`<option value="${esc(f[0])}">${f[5]} ${esc(f[0])} (${TN[f[1]]})</option>`).join(''),muO=MU.map(m=>`<option value="${m[0]}">${m[0]||'Normal'}</option>`).join('');
  return arow('💰',`Pera: $${S.money.toLocaleString()}<div class="arow"><input id="a-money" type="number" placeholder="halaga" style="width:120px"><button data-act="addmoney">Add</button><button data-act="setmoney">Set</button><button data-act="addq" data-v="1000">+1k</button><button data-act="addq" data-v="100000">+100k</button><button data-act="addq" data-v="1000000">+1M</button></div>`)
  +arow('🎣',`Rod at Boat<div class="arow"><select id="a-rod">${rodO}</select><button data-act="giverod">Give &amp; equip</button><button data-act="allrods">Unlock all rods</button><button data-act="allboats">Unlock all boats</button></div>`)
  +arow('🐟',`Magbigay ng isda<div class="arow"><select id="a-fish">${fishO}</select><select id="a-mu">${muO}</select><input id="a-kg" type="number" placeholder="kg (optional)" style="width:120px"><button data-act="givefish">Give</button><button data-act="givemyth">1 ng bawat Mythical</button></div>`)
  +arow('🍀',`Cheats<div class="arow"><label>Luck +<span id="a-lv">${S.adminLuck||0}</span> <input id="a-luck" type="range" min="0" max="20" step="1" value="${S.adminLuck||0}"></label><label>Boat ×<span id="a-bv">${S.boatMul||1}</span> <input id="a-bm" type="range" min="1" max="4" step=".5" value="${S.boatMul||1}"></label><label><input id="a-inst" type="checkbox" ${S.instant?'checked':''}> Instant bite</label></div>`)
  +arow('📍',`Teleport<div class="arow"><button data-act="tp" data-v="dock">Dock</button><button data-act="tp" data-v="shop">Shop</button><button data-act="tp" data-v="isle">Mythic Isle</button></div>`)
  +arow('⚠️',`<div class="arow"><button data-act="resetsave" style="background:#b00020">Reset my save</button></div>`)},
 world(){if(!N.connected)return arow('📴','Offline mode. Patakbuhin ang server.js at buksan ang laro gamit ang http://IP:3000 para sa multiplayer.');
  return arow('📢',`Announcement para sa lahat<div class="arow"><input id="a-ann" maxlength="150" placeholder="Mensahe..." style="flex:1;min-width:160px"><button data-act="announce">Send</button></div>`)+arow('🧹',`Chat<div class="arow"><button data-act="clearchat">Linisin ang chat ng lahat</button></div>`)},
 plist(){if(!N.connected)return arow('📴','Offline: wala kang kasamang players.');if(!N.plist.length)return arow('⏳','Walang data pa...');
  return N.plist.map(p=>`<div class="it"><div class="ic" style="background:${p.admin?'#ff6b57':'#fff'}">${p.admin?'🛡':'🎣'}</div><div class="tx">${esc(p.name)}${p.id===N.id?' (ikaw)':''}<br><small>${esc(p.ip||'')} ${p.muted?'· 🔇 muted':''}</small></div>${p.id===N.id?'':`<div class="arow"><button data-act="mute" data-id="${p.id}">Mute 5m</button><button data-act="unmute" data-id="${p.id}">Unmute</button><button data-act="kick" data-id="${p.id}">Kick</button><button data-act="ban" data-id="${p.id}" style="background:#b00020">Ban</button></div>`}</div>`).join('')}};
function drawAdmin(){$('astat').textContent=(N.connected?'🌐 Server':'📴 Offline')+(A.on?' · ADMIN':'');
 document.querySelectorAll('#atabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.at===A.tab));
 const keep={};['a-money','a-kg','a-ann'].forEach(id=>{const e=document.getElementById(id);if(e&&e.value)keep[id]=e.value});
 $('abody').innerHTML=A.on?AVIEW[A.tab]():alogin();
 for(const id in keep){const e=document.getElementById(id);if(e)e.value=keep[id]}}
function tp(w){if(S.st!=='idle')cancel();
 if(w==='isle'){S.onB=true;Object.assign(B,{x:MI.x+20,z:MI.z+14,h:Math.PI,v:0});msg('Teleported: Mythic Isle')}
 else{S.onB=false;B.v=0;cam.fov=70;cam.updateProjectionMatrix();cam.position.set(...(w==='shop'?[3.4,1.7,6.6]:[0,1.7,22]));msg('Teleported')}}
$('abody').onclick=e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v,id=+b.dataset.id,num=i=>+($(i).value)||0;
 switch(a){
  case 'login':doLogin($('a-pw').value);return;
  case 'addmoney':S.money+=num('a-money');break;
  case 'setmoney':S.money=Math.max(0,num('a-money'));break;
  case 'addq':S.money+=+v;break;
  case 'giverod':{const i=+$('a-rod').value;S.owned[i]=1;S.rod=i;rodM.material=M(RODS[i][5]);msg(RODS[i][0]);break}
  case 'allrods':S.owned=S.owned.map(()=>1);msg('Lahat ng rod ay unlocked');break;
  case 'allboats':S.bo=S.bo.map(()=>1);msg('Lahat ng boat ay unlocked');break;
  case 'givefish':{const f=F.find(x=>x[0]===$('a-fish').value),mu=MU.find(m=>m[0]===$('a-mu').value)||MU[0];if(f){const fh=mkFish(f,mu,num('a-kg'));addToBag(fh);msg('Nakuha: '+fh.n)}break}
  case 'givemyth':F.filter(f=>f[1]===5).forEach(f=>addToBag(mkFish(f,MU[0])));msg('Binigyan ka ng lahat ng Mythical');break;
  case 'tp':tp(v);break;
  case 'resetsave':if(confirm('Burahin ang save mo?')){try{localStorage.removeItem(KEY)}catch(x){}location.reload()}return;
  case 'announce':{const t=$('a-ann').value.trim();if(t)netSend({t:'admin',cmd:'announce',text:t});$('a-ann').value='';return}
  case 'clearchat':netSend({t:'admin',cmd:'clearchat'});return;
  case 'mute':netSend({t:'admin',cmd:'mute',id,sec:300});return;
  case 'unmute':netSend({t:'admin',cmd:'unmute',id});return;
  case 'kick':netSend({t:'admin',cmd:'kick',id});return;
  case 'ban':if(confirm('I-ban ang player na ito?'))netSend({t:'admin',cmd:'ban',id});return}
 hud();save();drawAdmin()};
function aInput(e){const t=e.target;if(t.id==='a-luck'){S.adminLuck=+t.value;$('a-lv').textContent=t.value}else if(t.id==='a-bm'){S.boatMul=+t.value;$('a-bv').textContent=t.value}else if(t.id==='a-inst')S.instant=t.checked}
$('abody').addEventListener('input',aInput);$('abody').addEventListener('change',aInput);
$('abody').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='a-pw')doLogin(e.target.value)});
// ===== Mobile touch controls =====
const JOY={x:0,y:0};
const IS_TOUCH=matchMedia('(pointer:coarse)').matches||/[?&]touch=1/.test(location.search);
function tapKey(code){window.dispatchEvent(new KeyboardEvent('keydown',{code:code,key:code,bubbles:true,cancelable:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code:code,key:code,bubbles:true}))}
(function initTouch(){
 if(!IS_TOUCH)return;
 document.body.classList.add('touch');
 const root=document.createElement('div');root.id='tc';
 root.innerHTML='<div id="joy"><i id="jk"></i></div>'+
  '<div id="tbtns"><button id="tb-act" class="tb">🎣<span>CAST / REEL</span></button><button id="tb-shk" class="tb">🪝<span>SHAKE</span></button><button id="tb-use" class="tb">✋<span>E</span></button></div>'+
  '<div id="tmini"><button id="tb-chat" class="tb mini">💬</button><button id="tb-adm" class="tb mini">🛠</button><button id="tb-fs" class="tb mini">⛶</button></div>';
 document.body.appendChild(root);
 root.addEventListener('contextmenu',e=>e.preventDefault());
 // joystick
 const joy=$('joy'),jk=$('jk');let jid=null;
 function updJ(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width/2-12;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy);if(d>max){dx*=max/d;dy*=max/d}
  jk.style.transform='translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))';
  const nx=dx/max,ny=dy/max;if(Math.hypot(nx,ny)<.18){JOY.x=0;JOY.y=0}else{JOY.x=nx;JOY.y=-ny}}
 function endJ(e){if(e.pointerId!==jid)return;jid=null;JOY.x=0;JOY.y=0;jk.style.transform='translate(-50%,-50%)'}
 joy.addEventListener('pointerdown',e=>{e.preventDefault();jid=e.pointerId;joy.setPointerCapture(e.pointerId);updJ(e)});
 joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)updJ(e)});
 joy.addEventListener('pointerup',endJ);joy.addEventListener('pointercancel',endJ);
 // cast / reel (hold)
 const act=$('tb-act');let aid=null;
 act.addEventListener('pointerdown',e=>{e.preventDefault();if(aid!==null)return;aid=e.pointerId;act.setPointerCapture(e.pointerId);act.classList.add('dn');
  ren.domElement.dispatchEvent(new PointerEvent('pointerdown',{button:0,pointerType:'mouse',bubbles:true}))});
 function endA(e){if(e.pointerId!==aid)return;aid=null;act.classList.remove('dn');window.dispatchEvent(new PointerEvent('pointerup',{button:0,pointerType:'mouse'}))}
 act.addEventListener('pointerup',endA);act.addEventListener('pointercancel',endA);
 // tap buttons
 $('tb-shk').addEventListener('click',()=>tapKey('Space'));
 $('tb-use').addEventListener('click',()=>tapKey('KeyE'));
 $('tb-adm').addEventListener('click',()=>tapKey('F2'));
 let wasTyping=false;const cb=$('tb-chat');
 cb.addEventListener('pointerdown',()=>{wasTyping=typing});
 cb.addEventListener('click',()=>{if(wasTyping)closeChat();else tapKey('KeyT')});
 $('cin').addEventListener('blur',()=>{if(typing)closeChat()});
 $('tb-fs').addEventListener('click',()=>{try{const de=document.documentElement,f=de.requestFullscreen||de.webkitRequestFullscreen;if(document.fullscreenElement){document.exitFullscreen()}else if(f){const p=f.call(de);if(p&&p.then)p.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(x){}}).catch(()=>{})}}catch(x){}});
 // look: drag a finger on the game view
 const cv=ren.domElement;let lid=null,lx=0,ly=0;
 cv.style.touchAction='none';
 cv.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||lid!==null)return;lid=e.pointerId;lx=e.clientX;ly=e.clientY});
 cv.addEventListener('pointermove',e=>{if(e.pointerId!==lid)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;if(menu)return;yaw-=dx*.0065;pitch=Math.max(-1,Math.min(1,pitch-dy*.0065))});
 const endL=e=>{if(e.pointerId===lid)lid=null};cv.addEventListener('pointerup',endL);cv.addEventListener('pointercancel',endL);
})();
// ===== BEAUTY PASS: sky, day/night, clouds, stars, water, foam, fire, birds, particles =====
try{(function(){
const HQ=!IS_TOUCH,DAY=900,TAU=Math.PI*2;
const mkTex=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)};
const GLOW=mkTex(64,64,x=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
const CLOUDT=mkTex(256,128,x=>{for(let i=0;i<16;i++){const cx=44+R()*168,cy=52+R()*30,r=22+R()*26,g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,6.3);x.fill()}});
const MOONT=mkTex(128,128,x=>{x.fillStyle='#f4f1e0';x.beginPath();x.arc(64,64,56,0,6.3);x.fill();x.fillStyle='rgba(150,150,130,.35)';[[44,48,12],[78,70,16],[60,90,8],[86,40,7]].forEach(c=>{x.beginPath();x.arc(c[0],c[1],c[2],0,6.3);x.fill()})});
const SPK=mkTex(128,128,x=>{x.fillStyle='rgba(0,0,0,0)';for(let i=0;i<260;i++){x.fillStyle='rgba(255,255,255,'+(.25+R()*.6)+')';const s=1+R()*2.2;x.fillRect(R()*128,R()*128,s,s*(.6+R()))}});
SPK.wrapS=SPK.wrapT=THREE.RepeatWrapping;SPK.repeat.set(36,36);

// ---- sky dome
const skyU={top:{value:new THREE.Color(0x4aa8e8)},bot:{value:new THREE.Color(0xbfe9f7)}};
const sky=new THREE.Mesh(new THREE.SphereGeometry(380,24,16),new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,fog:false,
 vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform vec3 top;uniform vec3 bot;varying float h;void main(){float t=pow(clamp(h*1.5,0.,1.),.65);gl_FragColor=vec4(mix(bot,top,t),1.);}'}));
sky.renderOrder=-10;sky.frustumCulled=false;scene.add(sky);
// sun + moon
const mkSpr=(map,col,sc,add)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map,color:col,transparent:true,depthWrite:false,fog:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending}));s.scale.set(sc,sc,1);s.frustumCulled=false;scene.add(s);return s};
const sunCore=mkSpr(GLOW,0xfff4c0,46,true),sunHalo=mkSpr(GLOW,0xffc070,170,true),moon=mkSpr(MOONT,0xffffff,26,false),moonHalo=mkSpr(GLOW,0x9fb4ff,90,true);
sunCore.renderOrder=sunHalo.renderOrder=moon.renderOrder=moonHalo.renderOrder=-9;
// stars
const sN=HQ?420:200,sp=new Float32Array(sN*3);for(let i=0;i<sN;i++){const a=R()*TAU,y=.06+R()*.94,r=Math.sqrt(1-y*y);sp[i*3]=Math.cos(a)*r*360;sp[i*3+1]=y*360;sp[i*3+2]=Math.sin(a)*r*360}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:2.4,sizeAttenuation:false,color:0xffffff,transparent:true,opacity:0,fog:false,depthWrite:false}));stars.frustumCulled=false;stars.renderOrder=-8;scene.add(stars);
// clouds
const clouds=[],cN=HQ?14:8;for(let i=0;i<cN;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:CLOUDT,transparent:true,opacity:.9,depthWrite:false,fog:false}));const k=70+R()*70;s.scale.set(k*1.9,k,1);s.userData={x:(R()-.5)*520,z:(R()-.5)*520,y:62+R()*50,v:.6+R()*1.6};scene.add(s);clouds.push(s)}
// ---- day/night keys: [phase, top, bottom, dark, warm]
const KEYS=[[0,0x5b7fc7,0xffb48a,.5,.9],[.08,0x4aa8e8,0xbfe9f7,0,.1],[.45,0x3d9be0,0xaee6f5,0,0],[.70,0x4a9fe0,0xcdeaf0,0,.15],[.78,0x5a5fb8,0xff9a5a,.3,1],[.85,0x1e2a5e,0x6a5a9a,.7,.5],[.91,0x070d24,0x14224a,1,0],[.97,0x070d24,0x14224a,1,0],[1,0x5b7fc7,0xffb48a,.5,.9]];
const cA=new THREE.Color(),cB=new THREE.Color(),WHITE=new THREE.Color(1,1,1);
const HEMI=scene.children.find(o=>o.isHemisphereLight);
const hemiSky=new THREE.Color(0xffffff),hemiNight=new THREE.Color(0x6a7fc8),hemiGnd=new THREE.Color(0x6aa0a8),hemiGndN=new THREE.Color(0x1a2a44);
const sunDay=new THREE.Color(0xfff0c8),sunWarm=new THREE.Color(0xffa860),moonL=new THREE.Color(0x7f93e0);
const forced=/[?&]time=([\d.]+)/.exec(location.search);
const sdir=new THREE.Vector3();
let nightF=0,warmF=0,phase=0,dayName='';
function sky_(dt,T){
 phase=forced?+forced[1]%1:((Date.now()/1000)/DAY)%1;
 let i=0;while(i<KEYS.length-2&&phase>KEYS[i+1][0])i++;const a=KEYS[i],b=KEYS[i+1],t=(phase-a[0])/(b[0]-a[0]),s=t*t*(3-2*t);
 skyU.top.value.setHex(a[1]).lerp(cA.setHex(b[1]),s);skyU.bot.value.setHex(a[2]).lerp(cB.setHex(b[2]),s);
 nightF=a[3]+(b[3]-a[3])*s;warmF=a[4]+(b[4]-a[4])*s;
 scene.fog.color.copy(skyU.bot.value);scene.background.copy(skyU.bot.value);scene.fog.far=230-80*nightF;scene.fog.near=60-25*nightF;
 const isDay=phase>=.02&&phase<=.88;let ang=isDay?(phase-.02)/.86*Math.PI:((phase>.88?phase-.88:phase+.12)/.14)*Math.PI;
 sdir.set(Math.cos(ang)*.85,Math.sin(ang)*.8+.12,.35).normalize();
 const cp=cam.position;
 sky.position.copy(cp);stars.position.copy(cp);
 sunCore.visible=sunHalo.visible=isDay;moon.visible=moonHalo.visible=!isDay;
 const sp_=sdir.clone().multiplyScalar(340).add(cp);
 sunCore.position.copy(sp_);sunHalo.position.copy(sp_);moon.position.copy(sp_);moonHalo.position.copy(sp_);
 sunCore.material.color.setHex(0xfff4c0).lerp(cA.setHex(0xff9a50),warmF*.8);sunHalo.material.opacity=.35+.4*warmF;
 stars.material.opacity=Math.pow(nightF,1.6);
 if(HEMI){HEMI.intensity=.85-.6*nightF;HEMI.color.copy(hemiSky).lerp(hemiNight,nightF);HEMI.groundColor.copy(hemiGnd).lerp(hemiGndN,nightF)}
 sun.intensity=(.8*(1-nightF)+.28*nightF);sun.color.copy(nightF>.5?moonL:sunDay).lerp(sunWarm,warmF*(1-nightF)*.9);
 sunTarget.copy(cp);sunTarget.x=Math.round(sunTarget.x/3)*3;sunTarget.z=Math.round(sunTarget.z/3)*3;sunTarget.y=0;
 sun.position.copy(sdir).multiplyScalar(90).add(sunTarget);if(sun.target){sun.target.position.copy(sunTarget);sun.target.updateMatrixWorld()}
 // clouds
 for(const c of clouds){const u=c.userData;u.x+=u.v*dt;let dx=u.x-cp.x,dz=u.z-cp.z;if(dx>260)u.x-=520;if(dx<-260)u.x+=520;if(dz>260)u.z-=520;if(dz<-260)u.z+=520;
  c.position.set(u.x,u.y,u.z);c.material.color.copy(WHITE).lerp(skyU.bot.value,.25+.45*warmF).multiplyScalar(1-.85*nightF);c.material.opacity=.92-.4*nightF}
}
const sunTarget=new THREE.Vector3();
// ---- shadows (desktop only)
if(HQ){ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const c=sun.shadow.camera;c.left=-26;c.right=26;c.top=26;c.bottom=-26;c.near=1;c.far=220;sun.shadow.bias=-.0006;sun.shadow.normalBias=.05;scene.add(sun.target)}
let shT=0;function flagShadows(){if(!HQ)return;scene.traverse(o=>{if(o.isMesh&&!o.userData.shd){o.userData.shd=1;const m=o.material;if(m&&m.isMeshLambertMaterial){o.castShadow=true;o.receiveShadow=true}}})}
// ---- water sparkle + shore foam
const spark=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshBasicMaterial({map:SPK,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));spark.rotation.x=-Math.PI/2;spark.position.y=-.1;scene.add(spark);
const foam=[];[[0,0,14.3],...ISL.map(i=>[i[0],i[1],i[2]+.4]),[MI.x,MI.z,12.6]].forEach(([x,z,r],i)=>{const m=new THREE.Mesh(new THREE.RingGeometry(r,r+1.7,HQ?56:36),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.4,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,-.08,z);m.userData={r,i};scene.add(m);foam.push(m)});
// ---- island decor
const scatter=(n,a0,a1,ok)=>{const out=[];let k=0;while(out.length<n&&k++<n*25){const a=R()*TAU,r=a0+Math.sqrt(R())*(a1-a0),x=Math.cos(a)*r,z=Math.sin(a)*r;if(ok(x,z))out.push([x,z])}return out};
const okG=(x,z)=>!(Math.abs(x-6)<3.4&&Math.abs(z-4)<3)&&!(Math.abs(x)<2.5&&z>5)&&Math.hypot(x-2.6,z-4)>1.5&&Math.hypot(x+3.4,z-2.6)>1.8&&Math.hypot(x+9,z+5)>2.6;
const dm=new THREE.Object3D(),cc=new THREE.Color();
function inst(geo,mat,pts,fn){const m=new THREE.InstancedMesh(geo,mat,pts.length);pts.forEach((p,i)=>{fn(dm,p,i,cc);dm.updateMatrix();m.setMatrixAt(i,dm.matrix);m.setColorAt(i,cc)});m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;scene.add(m);return m}
const GR=[0x4fae4a,0x5fc25a,0x3e9a44,0x7ccc5c];
inst(new THREE.ConeGeometry(.1,.55,4),new THREE.MeshLambertMaterial({color:0xffffff}),scatter(HQ?320:160,1.5,8.9,okG),(d,p,i,c)=>{const s=.6+R()*1;d.position.set(p[0],.26*s,p[1]);d.rotation.set((R()-.5)*.4,R()*6,(R()-.5)*.4);d.scale.set(s,s,s);c.setHex(GR[i%4])});
const FC=[0xff7eb6,0xffd23f,0xffffff,0xff5a4f,0xb58cff];const fp=scatter(HQ?70:36,2,8.6,okG);
inst(new THREE.CylinderGeometry(.012,.012,.3,4),new THREE.MeshLambertMaterial({color:0xffffff}),fp,(d,p,i,c)=>{d.position.set(p[0],.15,p[1]);d.rotation.set(0,0,0);d.scale.set(1,1,1);c.setHex(0x3e9a44)});
inst(new THREE.SphereGeometry(.1,6,5),new THREE.MeshLambertMaterial({color:0xffffff}),fp,(d,p,i,c)=>{d.position.set(p[0],.33,p[1]);d.rotation.set(0,0,0);d.scale.set(1,.8,1);c.setHex(FC[i%5])});
inst(new THREE.DodecahedronGeometry(.35,0),new THREE.MeshLambertMaterial({color:0xffffff,flatShading:true}),scatter(16,9.8,13.2,(x,z)=>!(Math.abs(x)<3&&z>5)),(d,p,i,c)=>{const s=.5+R()*1;d.position.set(p[0],.08*s,p[1]);d.rotation.set(R()*3,R()*6,R()*3);d.scale.set(s,s*.6,s);c.setHex(i%3?0x9aa0a6:0x7d848b)});
inst(new THREE.IcosahedronGeometry(.12,0),new THREE.MeshLambertMaterial({color:0xffffff,flatShading:true}),scatter(20,10,13.3,(x,z)=>!(Math.abs(x)<3&&z>5)),(d,p,i,c)=>{d.position.set(p[0],.05,p[1]);d.rotation.set(R()*3,R()*6,0);d.scale.set(1,.6,1);c.setHex(i%2?0xffb7c5:0xfff0d8)});
// ---- hut windows, dock lanterns, lighthouse lamp/beam
const winM=new THREE.MeshBasicMaterial({color:0xa8d8e8});[-1.2,1.2].forEach(dz=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),winM);w.position.set(HUT[0]-2.01,1.5,HUT[1]+dz);w.rotation.y=-Math.PI/2;scene.add(w)});
const lamps=[];[[-1.4,12],[1.4,12],[-1.4,25],[1.4,25]].forEach(([x,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.2,.28,.2),new THREE.MeshBasicMaterial({color:0xc9a45a}));m.position.set(x,.46,z);scene.add(m);const g=mkSpr(GLOW,0xffd27a,2.6,true);g.position.set(x,.5,z);lamps.push([m,g])});
const LH=new THREE.Vector3(-9,8.6,-5);const lhGlow=mkSpr(GLOW,0xfff2a0,9,true);lhGlow.position.copy(LH);
const beamG=new THREE.Group();beamG.position.copy(LH);scene.add(beamG);
const bgeo=new THREE.CylinderGeometry(3,.15,40,14,1,true);bgeo.translate(0,20,0);bgeo.rotateZ(-Math.PI/2);
const bmat=new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:0,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false});
const b1=new THREE.Mesh(bgeo,bmat),b2=new THREE.Mesh(bgeo,bmat);b2.rotation.y=Math.PI;beamG.add(b1,b2);
// ---- campfire
const FIRE=new THREE.Group();FIRE.position.set(-3.4,0,2.6);scene.add(FIRE);
for(let i=0;i<7;i++){const a=i/7*TAU,s=new THREE.Mesh(new THREE.DodecahedronGeometry(.2,0),M(0x8a9096));s.position.set(Math.cos(a)*.7,.1,Math.sin(a)*.7);s.scale.y=.7;FIRE.add(s)}
[0,1.2].forEach(r=>{const l=new THREE.Mesh(new THREE.BoxGeometry(1.1,.14,.14),M(0x6b4423));l.position.y=.14;l.rotation.y=r+.4;l.rotation.z=.15;FIRE.add(l)});
const flames=[[.34,.9,0xff5a14],[.26,.7,0xffa020],[.16,.45,0xffe060]].map(([r,h,c],i)=>{const f=new THREE.Mesh(new THREE.ConeGeometry(r,h,7),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.92}));f.position.y=.1+h/2;f.userData={h,i};FIRE.add(f);return f});
const fglow=mkSpr(GLOW,0xff9a40,3.4,true);fglow.position.set(FIRE.position.x,.8,FIRE.position.z);
const fireL=new THREE.PointLight(0xff9a40,.5,16);fireL.position.set(FIRE.position.x,1.1,FIRE.position.z);scene.add(fireL);
// ---- fireflies
const ffN=HQ?40:20,ffB=[],ffP=new Float32Array(ffN*3);for(let i=0;i<ffN;i++)ffB.push([(R()-.5)*22,1+R()*3,(R()-.5)*20+2,R()*6]);
const ffG=new THREE.BufferGeometry();ffG.setAttribute('position',new THREE.BufferAttribute(ffP,3));
const ffM=new THREE.Points(ffG,new THREE.PointsMaterial({size:.55,map:GLOW,color:0xd8ff6a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));ffM.frustumCulled=false;scene.add(ffM);
// ---- gulls
const gulls=[];for(let i=0;i<(HQ?7:4);i++){const g=new THREE.Group(),mt=new THREE.MeshBasicMaterial({color:0xffffff});g.add(new THREE.Mesh(new THREE.BoxGeometry(.2,.14,.5),mt));
 const wl=new THREE.Group(),wr=new THREE.Group();const w1=new THREE.Mesh(new THREE.BoxGeometry(.9,.03,.26),mt),w2=w1.clone();w1.position.x=-.45;w2.position.x=.45;wl.add(w1);wr.add(w2);g.add(wl,wr);
 const c=[[0,0],...ISL][i%4];g.userData={cx:c[0],cz:c[1],r:20+R()*28,a:R()*TAU,v:(.06+R()*.06)*(R()<.5?1:-1),h:16+R()*14,ph:R()*6,wl,wr,mt};scene.add(g);gulls.push(g)}
// ---- jumping fish
const jf=[];for(let i=0;i<3;i++){const g=new THREE.Group(),mt=new THREE.MeshBasicMaterial({color:0xdff3fa});g.add(new THREE.Mesh(new THREE.BoxGeometry(.5,.16,.12),mt));const t=new THREE.Mesh(new THREE.BoxGeometry(.14,.22,.05),mt);t.position.x=-.3;g.add(t);g.visible=false;g.userData={t:-1,x:0,z:0,dx:0,dz:0,wait:3+R()*6};scene.add(g);jf.push(g)}
// ---- splash particles + ripples
const PN=HQ?260:140,pP=new Float32Array(PN*3),pC=new Float32Array(PN*3),pB=new Float32Array(PN*3),pV=new Float32Array(PN*3),pL=new Float32Array(PN),pM=new Float32Array(PN).fill(1);let pH=0;
for(let i=0;i<PN;i++)pP[i*3+1]=-100;
const pG=new THREE.BufferGeometry();pG.setAttribute('position',new THREE.BufferAttribute(pP,3));pG.setAttribute('color',new THREE.BufferAttribute(pC,3));
const pPts=new THREE.Points(pG,new THREE.PointsMaterial({size:.4,map:GLOW,vertexColors:true,transparent:true,depthWrite:false}));pPts.frustumCulled=false;scene.add(pPts);
function emit(x,y,z,n,spd,up,r,g,b,life){for(let k=0;k<n;k++){const i=(pH++)%PN,a=R()*TAU,s=R()*spd;pP[i*3]=x;pP[i*3+1]=y;pP[i*3+2]=z;pV[i*3]=Math.cos(a)*s;pV[i*3+1]=up*(.5+R()*.8);pV[i*3+2]=Math.sin(a)*s;pB[i*3]=r;pB[i*3+1]=g;pB[i*3+2]=b;pL[i]=pM[i]=life*(.6+R()*.6)}}
const RP=[];for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.RingGeometry(.9,1,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.visible=false;scene.add(m);RP.push({m,t:2,mx:2})}
let rpI=0;function ripple(x,z,mx){const r=RP[(rpI++)%RP.length];r.t=0;r.mx=mx||2.2;r.m.position.set(x,-.09,z);r.m.visible=true}
function splashAt(x,z,n){emit(x,-.1,z,n,2.4,5.5,.9,.97,1,.9);ripple(x,z,3.2)}
// vignette + time pill + start-screen bubbles
const vig=document.createElement('div');vig.id='vig';ren.domElement.after(vig);
const tod=document.createElement('div');tod.className='pill';tod.id='tod';const hudEl=$('hud');if(hudEl)hudEl.insertBefore(tod,$('musbtn'));
const st0=$('start');if(st0){for(let i=0;i<14;i++){const s=document.createElement('span');s.className='bub';s.textContent=['🫧','🐟','🐠','🫧','✨','🐡'][i%6];s.style.left=(R()*96)+'%';s.style.fontSize=(16+R()*26)+'px';s.style.animationDuration=(7+R()*9)+'s';s.style.animationDelay=(-R()*12)+'s';st0.appendChild(s)}}
// confetti + catch card effects
function confetti(n,cols){for(let i=0;i<n;i++){const s=document.createElement('span');s.className='cf';s.style.left=R()*100+'vw';s.style.background=cols[i%cols.length];s.style.animationDuration=(1.8+R()*1.8)+'s';s.style.animationDelay=(R()*.6)+'s';s.style.width=(6+R()*8)+'px';s.style.height=(10+R()*10)+'px';s.style.setProperty('--dx',(R()*200-100)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),4600)}}
window.catchFx=function(f){try{const col=TC[f.tier],c=$('catch');c.style.boxShadow=f.tier>=2?'0 0 0 4px '+col+',0 0 '+(18+f.tier*10)+'px '+col:'';
 if(S.tx!==undefined)splashAt(S.tx,S.tz,8+f.tier*4);
 if(f.tier>=3)confetti(f.tier===3?36:f.tier===4?70:110,f.tier===5?['#ff3b6b','#ffb300','#2bd96b','#2b9bff','#b04cff']:[col,'#fff7c2','#ffd23f'])}catch(e){}};
// ---- main per-frame update
let prevSt='idle',rpT=0,wakeT=0,fireT=0,todT=0,T=0;
const NAMES=[[.08,'🌄 Madaling-araw'],[.3,'🌤 Umaga'],[.6,'☀️ Tanghali'],[.78,'🌇 Hapon'],[.86,'🌆 Takipsilim'],[.97,'🌙 Gabi'],[1.01,'🌄 Madaling-araw']];
window.__beauty=function(dt){
 T+=dt;sky_(dt,T);
 shT-=dt;if(shT<=0){shT=3;flagShadows()}
 // water sparkle + foam
 SPK.offset.x+=dt*.004;SPK.offset.y+=dt*.0025;spark.material.opacity=(.34-.22*nightF)*(.8+.2*Math.sin(T*2));
 foam.forEach(m=>{const k=1+Math.sin(T*1.2+m.userData.i)*.035;m.scale.set(k,k,1);m.material.opacity=.34+.16*Math.sin(T*1.6+m.userData.i*2);m.material.color.setRGB(1,1,1).multiplyScalar(1-.7*nightF)});
 // lights at night
 winM.color.setHex(0xa8d8e8).lerp(cA.setHex(0xffc860),nightF);
 lamps.forEach(([m,g],i)=>{m.material.color.setHex(0xc9a45a).lerp(cA.setHex(0xffe08a),nightF);g.material.opacity=.12+.8*nightF*(.9+.1*Math.sin(T*3+i))});
 lhGlow.material.opacity=.15+.85*nightF;beamG.rotation.y=T*.9;bmat.opacity=.24*nightF;beamG.visible=nightF>.04;
 // campfire
 flames.forEach(f=>{const u=f.userData,fl=1+Math.sin(T*(11+u.i*4)+u.i)*.14+Math.sin(T*23+u.i*2)*.08;f.scale.set(1/Math.sqrt(fl)*.95,fl,1/Math.sqrt(fl)*.95);f.rotation.y+=dt*2});
 fireL.intensity=(.35+1.5*nightF)*(.85+.15*Math.sin(T*17)+.08*Math.sin(T*31));fglow.material.opacity=.3+.5*nightF;
 fireT-=dt;if(fireT<=0){fireT=.09+R()*.1;emit(FIRE.position.x+(R()-.5)*.3,.7,FIRE.position.z+(R()-.5)*.3,1,.35,2.6,1,.55,.15,1.3)}
 // fireflies
 ffM.material.opacity=Math.max(0,nightF*1.2-.1);if(ffM.material.opacity>0){for(let i=0;i<ffN;i++){const b=ffB[i];ffP[i*3]=b[0]+Math.sin(T*.7+b[3])*1.4;ffP[i*3+1]=b[1]+Math.sin(T*1.1+b[3]*2)*.5;ffP[i*3+2]=b[2]+Math.cos(T*.6+b[3])*1.4}ffG.attributes.position.needsUpdate=true}
 // gulls
 gulls.forEach(g=>{const u=g.userData;u.a+=u.v*dt;const x=u.cx+Math.cos(u.a)*u.r,z=u.cz+Math.sin(u.a)*u.r;g.position.set(x,u.h+Math.sin(T*.5+u.ph)*1.4,z);g.rotation.y=-u.a+(u.v>0?Math.PI:0);g.rotation.z=u.v>0?.25:-.25;const fl=Math.sin(T*(5+u.ph*.3)+u.ph)*.55;u.wl.rotation.z=fl;u.wr.rotation.z=-fl;u.mt.color.setRGB(1,1,1).multiplyScalar(1-.8*nightF);g.visible=nightF<.7});
 // jumping fish
 jf.forEach(g=>{const u=g.userData;if(u.t<0){u.wait-=dt;if(u.wait<=0&&nightF<.8){const a=R()*TAU,d=14+R()*34,p=cam.position;u.x=p.x+Math.cos(a)*d;u.z=p.z+Math.sin(a)*d;if(!boatBlock(u.x,u.z)&&!onLand(u.x,u.z)){const b=R()*TAU;u.dx=Math.cos(b)*2.2;u.dz=Math.sin(b)*2.2;u.t=0;g.visible=true;splashAt(u.x,u.z,6)}else u.wait=.5}}
  else{u.t+=dt/1.05;if(u.t>=1){u.t=-1;u.wait=3+R()*7;g.visible=false;splashAt(u.x+u.dx,u.z+u.dz,7)}else{const t=u.t;g.position.set(u.x+u.dx*t,-.2+4*2.1*t*(1-t),u.z+u.dz*t);g.rotation.set(0,-Math.atan2(u.dz,u.dx),(.5-t)*1.6)}}});
 // fishing / boat water effects
 const st=S.st;
 if(st!==prevSt){if(prevSt==='fly'&&st==='wait')splashAt(S.tx,S.tz,18);if(prevSt==='wait'&&st==='reel')splashAt(S.tx,S.tz,12);prevSt=st}
 if(st==='wait'||st==='reel'){rpT-=dt;if(rpT<=0){rpT=st==='reel'?.3:1.4;ripple(S.tx,S.tz,st==='reel'?3.2:1.8);if(st==='reel')emit(S.tx,-.1,S.tz,4,1.6,3.6,.9,.97,1,.7)}}
 if(S.onB&&Math.abs(B.v)>1.2){wakeT-=dt;if(wakeT<=0){wakeT=.2;const bx=B.x+Math.sin(B.h)*2.3,bz=B.z+Math.cos(B.h)*2.3;ripple(bx,bz,2.8);emit(bx,-.1,bz,3,1.1,1.8,.95,.98,1,.7)}}
 // particles + ripples update
 for(let i=0;i<PN;i++){if(pL[i]>0){pL[i]-=dt;if(pL[i]<=0){pP[i*3+1]=-100;pC[i*3]=pC[i*3+1]=pC[i*3+2]=0;continue}pV[i*3+1]-=9*dt;pP[i*3]+=pV[i*3]*dt;pP[i*3+1]+=pV[i*3+1]*dt;pP[i*3+2]+=pV[i*3+2]*dt;const k=pL[i]/pM[i];pC[i*3]=pB[i*3]*k;pC[i*3+1]=pB[i*3+1]*k;pC[i*3+2]=pB[i*3+2]*k}}
 pG.attributes.position.needsUpdate=true;pG.attributes.color.needsUpdate=true;
 RP.forEach(r=>{if(!r.m.visible)return;r.t+=dt/1.3;if(r.t>=1){r.m.visible=false;return}const e=1-Math.pow(1-r.t,2),s=.25+r.mx*e;r.m.scale.set(s,s,1);r.m.material.opacity=.55*(1-r.t)});
 // time pill
 todT-=dt;if(todT<=0){todT=2;const n=NAMES.find(x=>phase<x[0])[1];if(n!==dayName){dayName=n;tod.textContent=n}}
};
flagShadows();
})()}catch(e){console.warn('beauty pass failed:',e)}
// loop
let last=performance.now();
function boatMesh(dt){const y=W(B.x,B.z,S.t)+.25,sc2=BOATS[S.boat][4];BG.position.set(B.x,y,B.z);BG.rotation.set(Math.sin(S.t*1.1)*.02,B.h,Math.sin(S.t*1.3)*.03,'YXZ');
 if(S.onB)cam.position.set(B.x,y+.35*sc2+1.35,B.z)}
function driveBoat(dt,f,r){const mx=BOATS[S.boat][2]*(S.boatMul||1),tg=f>0?mx:f<0?-mx*.4:0;B.v+=(tg-B.v)*Math.min(1,dt*(f?.9:.6));
 const dh=-r*1.1*dt*Math.min(1,Math.abs(B.v)/3+.25)*(B.v>=-.1?1:-1);B.h+=dh;yaw+=dh;
 const nx=B.x-Math.sin(B.h)*B.v*dt,nz=B.z-Math.cos(B.h)*B.v*dt;if(boatBlock(nx,nz)){if(Math.abs(B.v)>3)blip(120,60,.2,.12,'square');B.v*=-.3}else{B.x=nx;B.z=nz}}
function loop(n){const dt=Math.min((n-last)/1000,.1);last=n;S.t+=dt;
 for(let i=0;i<wp.count;i++){const b=wb[i];wp.setZ(i,Math.sin(b[0]*.15+S.t)*.12+Math.cos(b[1]*.12+S.t*1.3)*.1)}wp.needsUpdate=true;
 boatMesh(dt);MIring.rotation.z=S.t*.5;MIring.position.y=9+Math.sin(S.t*1.2)*.5;MIbeam.material.opacity=.3+Math.sin(S.t*2)*.08;
 npcAnim(dt);netTick(dt);
 if(S.go)play(dt);else cam.rotation.set(-.1,Math.sin(n/5000)*.8+Math.PI,0);
 if(window.__beauty){try{__beauty(dt)}catch(e){}}ren.render(scene,cam);requestAnimationFrame(loop)}
function npcAnim(dt){const p=cam.position,dn=Math.hypot(p.x-NPC.x,p.z-NPC.z);
 NPC.g.rotation.y+=((dn<18?Math.atan2(p.x-NPC.x,p.z-NPC.z):0)-NPC.g.rotation.y)*Math.min(1,dt*4);
 NPC.g.position.y=Math.abs(Math.sin(S.t*2))*.03;
 const talk=menuT==='shop'||(NPC.full&&NPC.n<NPC.full.length);
 armL.rotation.z=talk?.9+Math.sin(S.t*6)*.15:.25;
 armR.rotation.z=(dn<10&&!menu)?-2.5+Math.sin(S.t*8)*.35:talk?-.9-Math.sin(S.t*6)*.15:-.25;
 if(NPC.full&&NPC.n<NPC.full.length){NPC.acc+=dt*30;while(NPC.acc>=1&&NPC.n<NPC.full.length){NPC.acc--;const ch=NPC.full[NPC.n++];if(!NPC.tts&&NPC.n%2===0)npcBabble(ch)}
  npcDraw(NPC.full,NPC.n);if(NPC.el)NPC.el.textContent=NPC.full.slice(0,NPC.n)}
 else if(NPC.el&&NPC.full&&NPC.el.textContent!==NPC.full)NPC.el.textContent=NPC.full;
 const talking=NPC.full&&NPC.n<NPC.full.length;
 mouthM.scale.y=talking?1+Math.abs(Math.sin(S.t*22))*3.2:1;NPC.g.scale.y=.78*(talking?1+Math.sin(S.t*16)*.018:1);
 NPC.bt-=dt;if(NPC.bt<=0)bubL.s.visible=false;
 if(S.go){if(!NPC.met&&dn<9&&!menu){NPC.met=true;npcBubble('Uy boss! Halika, bentahan tayo!');NPC.tt=10}if(dn>26)NPC.met=false;
  NPC.tt-=dt;if(NPC.tt<=0&&dn<16&&!menu){npcBubble(pickLine(TAUNTS));NPC.tt=10+R()*6}}}
function play(dt){
 const kf=Math.max(-1,Math.min(1,(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+JOY.y)),kr=Math.max(-1,Math.min(1,(keys.KeyD?1:0)-(keys.KeyA?1:0)+JOY.x)),st0=S.st,can=!menu&&st0!=='reel';
 if(S.onB){let f=0,r=0;if(can&&st0!=='charge'){f=kf;r=kr;if(st0==='wait'&&(f||r))cancel()}driveBoat(dt,f,r);
  const tf=70+Math.max(0,B.v/BOATS[S.boat][2])*9;if(Math.abs(cam.fov-tf)>.05){cam.fov+=(tf-cam.fov)*Math.min(1,dt*4);cam.updateProjectionMatrix()}}
 else if(can){const sp=4*dt,p=cam.position,f=kf,r=kr,blk=(x,z)=>Math.hypot(x-NPC.x,z-NPC.z)<.8;
  const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*r)*sp,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*r)*sp;if(onLand(p.x+dx,p.z)&&!blk(p.x+dx,p.z))p.x+=dx;if(onLand(p.x,p.z+dz)&&!blk(p.x,p.z+dz))p.z+=dz}
 if(!menu){if(keys.KeyQ||keys.ArrowLeft)yaw+=dt*1.8;if(keys.ArrowRight)yaw-=dt*1.8}
 cam.rotation.set(pitch,yaw,0);
 updateHand(dt);
 const st=S.st;rodG.rotation.x=-1.2+(st==='charge'?.5*S.pw:0)+(st==='reel'?Math.sin(S.t*14)*.04:0);
 if(st==='charge'){S.pw+=S.pd*dt*1.1;if(S.pw>=1){S.pw=1;S.pd=-1}if(S.pw<=0){S.pw=0;S.pd=1}$('power').firstChild.style.width=S.pw*100+'%'}
 if(st==='fly'){S.u+=dt/.8;const u=Math.min(1,S.u);bob.position.set(S.a.x+(S.tx-S.a.x)*u,S.a.y+(W(S.tx,S.tz,S.t)-S.a.y)*u+4*3*u*(1-u),S.a.z+(S.tz-S.a.z)*u);
  if(u>=1){S.st='wait';S.bt=S.instant?.4:(3+R()*6)/RODS[S.rod][4];S.shk=0;blip(200,60,.3,.15)}}
 if(st==='wait'||st==='reel'){const bx=S.tx,bz=S.tz;S.shk=Math.max(0,(S.shk||0)-dt);bob.position.set(bx,W(bx,bz,S.t)+.05+Math.sin(S.t*3)*.03-(st==='wait'?0:.12)+Math.sin(S.t*30)*S.shk*.1+(st==='reel'?Math.sin(S.t*20)*.05:0),bz)}
 if(st==='wait'){S.bt-=dt;if(S.bt<=0)startReel()}
 if(st==='reel'){
  S.fc-=dt;if(S.fc<=0){S.ft=.1+R()*.8;S.fc=.5+R()*.9}S.fp+=Math.sign(S.ft-S.fp)*Math.min(Math.abs(S.ft-S.fp),S.fs*dt*(1+S.fish.tier*.2));
  S.bv+=(hold?1:-1)*2.6*dt;S.bv*=1-2*dt;S.bp+=S.bv*dt;const h=S.w/2;if(S.bp<h){S.bp=h;S.bv=0}if(S.bp>1-h){S.bp=1-h;S.bv=0}
  const inz=Math.abs(S.fp-S.bp)<h;S.pr+=(inz?.28:-S.loss)*dt;
  $('fish').style.left=S.fp*100+'%';$('zone').style.left=(S.bp-h)*100+'%';$('pg').firstChild.style.width=Math.max(0,Math.min(1,S.pr))*100+'%';
  if(S.pr>=1)endReel(true);else if(S.pr<=0)endReel(false)}
 // prompts, zone, compass, water tint
 const p=cam.position,nShop=Math.hypot(p.x-HUT[0],p.z-HUT[1]),dn=Math.hypot(p.x-NPC.x,p.z-NPC.z),nBoat=Math.hypot(p.x-B.x,p.z-B.z);let pr='';
 if(!menu&&st==='idle'){if(S.onB){pr=nearDock()?'E: Dock the boat':'W/S throttle · A/D steer'}else if(Math.min(nShop,dn)<4.8&&Math.min(nShop,dn)<=nBoat)pr='E: Kausapin si Kap Barracuda (Shop)';else if(nBoat<5)pr='E: Board boat';else if(S.held)pr='Pindutin ang 1 para balikan ang rod'}
 if(st==='wait')pr='Waiting for a bite... Space to shake · move to reel in';$('prompt').textContent=IS_TOUCH?pr.replace(/^E:/,'✋ Tap:').replace('W/S throttle · A/D steer','Joystick: gas at liko').replace('Space to shake · move to reel in','🪝 Shake · igalaw ang joystick para i-reel in').replace('Pindutin ang 1','Tap ang slot 1'):pr;
 const zn=(st==='wait'||st==='reel')?zoneAt(S.tx,S.tz):zoneAt(p.x,p.z);$('zn').textContent='Zone: '+ZN[zn]+(S.onB?' · '+Math.round(Math.abs(B.v)*3.6)+' km/h':'');wm.material.color.lerp(ZC[zn],Math.min(1,dt*1.5));
 if(zn===3&&S.lastZ!==3)msg('Mythic Isle waters! Legendary at Mythical ang naririto');S.lastZ=zn;
 const mdx=MI.x-p.x,mdz=MI.z-p.z;$('nav').textContent=Math.hypot(mdx,mdz)<MI.r?'🌌 Mythic Isle waters':'🧭 Mythic Isle · '+Math.round(Math.hypot(mdx,mdz))+' m '+dirName(mdx,mdz);
 if(st!=='idle'&&st!=='charge'){const a=new THREE.Vector3();tip.getWorldPosition(a);const q=lg.attributes.position;q.setXYZ(0,a.x,a.y,a.z);q.setXYZ(1,bob.position.x,bob.position.y,bob.position.z);q.needsUpdate=true}}
$('go').onclick=()=>{$('start').style.display='none';S.go=true;document.body.classList.add('playing');initAudio();startMusic();setMusic(MUS.on);$('musbtn').onclick=()=>setMusic(!MUS.on);load();setBoat(S.boat);rodM.material=M(RODS[S.rod][5]);hud();drawHotbar();msg('Walk to the end of the dock. Your boat is moored there (E)');startNet()};
setBoat(0);hud();drawHotbar();requestAnimationFrame(loop);
$('go').disabled=false;$('go').textContent='Start fishing';
try{$('pname').value=localStorage.getItem('deepcast_name')||''}catch(e){}
