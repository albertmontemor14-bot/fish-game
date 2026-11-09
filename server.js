// Deep Cast server: static files + WebSocket multiplayer, chat, admin
// Run: npm install ws   then   node server.js
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // PALITAN MO ITO!
const MAX_PLAYERS = 16;
const LOG_MAX = 40;

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' };
const ALLOWED = new Set(['index.html', 'style.css', 'game.js']);

const server = http.createServer((req, res) => {
  let f = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  if (!ALLOWED.has(f)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, f), (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server, path: '/deepcast', maxPayload: 4096 });

let nextId = 1;
const players = new Map(); // id -> player
const bans = new Set();    // ips
const log = [];            // recent chat

const send = (ws, o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
const broadcast = (o, exceptId) => { const s = JSON.stringify(o); players.forEach(p => { if (p.id !== exceptId && p.ws.readyState === 1) p.ws.send(s); }); };
const sys = (text, color) => broadcast({ t: 'sys', text, color });
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

function freeSlot() {
  const used = new Set([...players.values()].map(p => p.slot));
  let s = 0; while (used.has(s)) s++; return s;
}
const pub = p => ({ id: p.id, name: p.name, x: p.x, z: p.z, yaw: p.yaw, onB: p.onB, bx: p.bx, bz: p.bz, bh: p.bh, bt: p.bt });
const plist = () => [...players.values()].map(p => ({ id: p.id, name: p.name, admin: p.admin, muted: p.mutedUntil > Date.now(), ip: p.ip }));

wss.on('connection', (ws, req) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
  if (bans.has(ip)) { send(ws, { t: 'kicked', reason: 'Banned ka sa server.' }); return ws.close(); }
  if (players.size >= MAX_PLAYERS) { send(ws, { t: 'kicked', reason: 'Puno na ang server.' }); return ws.close(); }

  let me = null;
  let msgCount = 0, windowStart = Date.now();

  ws.on('message', raw => {
    // simple rate limit: 60 msgs/sec
    const now = Date.now();
    if (now - windowStart > 1000) { windowStart = now; msgCount = 0; }
    if (++msgCount > 60) return;

    let m; try { m = JSON.parse(raw); } catch { return; }

    if (!me) {
      if (m.t !== 'join') return;
      let name = clean(m.name, 16) || 'Mangingisda' + (100 + Math.floor(Math.random() * 900));
      const taken = n => [...players.values()].some(p => p.name.toLowerCase() === n.toLowerCase());
      if (taken(name)) { let i = 2; while (taken(name.slice(0, 13) + i)) i++; name = name.slice(0, 13) + i; }
      me = { id: nextId++, ws, ip, name, slot: freeSlot(), admin: false, mutedUntil: 0, x: 0, z: 22, yaw: 0, onB: 0, bx: 0, bz: 0, bh: 0, bt: 0, lastChat: 0 };
      send(ws, { t: 'welcome', id: me.id, slot: me.slot, name: me.name, players: [...players.values()].map(pub), log });
      players.set(me.id, me);
      broadcast({ t: 'join', p: pub(me) }, me.id);
      console.log(`+ ${me.name} (${ip}) online: ${players.size}`);
      return;
    }

    switch (m.t) {
      case 'state':
        me.x = num(m.x); me.z = num(m.z); me.yaw = num(m.yaw);
        me.onB = m.onB ? 1 : 0; me.bx = num(m.bx); me.bz = num(m.bz); me.bh = num(m.bh);
        me.bt = Math.max(0, Math.min(20, num(m.bt) | 0));
        break;

      case 'chat': {
        const text = clean(m.text, 200);
        if (!text) return;
        if (me.mutedUntil > Date.now()) return send(ws, { t: 'sys', text: 'Naka-mute ka pa.', color: '#ff6b6b' });
        if (now - me.lastChat < 600) return send(ws, { t: 'sys', text: 'Dahan-dahan sa pag-chat.', color: '#ffd23f' });
        me.lastChat = now;
        const out = { t: 'chat', id: me.id, name: me.name, text, me: !!m.me, admin: me.admin };
        log.push(out); if (log.length > LOG_MAX) log.shift();
        broadcast(out);
        break;
      }

      case 'admin-login':
        if (String(m.pw) === ADMIN_PASSWORD) { me.admin = true; send(ws, { t: 'admin', ok: true }); console.log(`! admin: ${me.name}`); }
        else send(ws, { t: 'admin', ok: false });
        break;

      case 'admin': {
        if (!me.admin) return;
        const target = players.get(+m.id);
        switch (m.cmd) {
          case 'players': send(ws, { t: 'players', list: plist() }); break;
          case 'announce': { const text = clean(m.text, 150); if (text) broadcast({ t: 'announce', text }); break; }
          case 'clearchat': log.length = 0; broadcast({ t: 'clearchat' }); break;
          case 'mute': if (target && !target.admin) { target.mutedUntil = Date.now() + Math.min(3600, num(m.sec, 300)) * 1000; sys(`${target.name} ay na-mute.`, '#ff9f43'); } send(ws, { t: 'players', list: plist() }); break;
          case 'unmute': if (target) { target.mutedUntil = 0; sys(`${target.name} ay na-unmute.`, '#7be37b'); } send(ws, { t: 'players', list: plist() }); break;
          case 'kick': if (target && !target.admin) { send(target.ws, { t: 'kicked', reason: 'Na-kick ng admin.' }); target.ws.close(); } break;
          case 'ban': if (target && !target.admin) { bans.add(target.ip); send(target.ws, { t: 'kicked', reason: 'Na-ban ng admin.' }); target.ws.close(); } break;
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!me || !players.has(me.id)) return;
    players.delete(me.id);
    broadcast({ t: 'leave', id: me.id });
    console.log(`- ${me.name} online: ${players.size}`);
  });
  ws.on('error', () => {});
});

// broadcast all positions 10x/sec
setInterval(() => {
  if (players.size < 2) return;
  const arr = [...players.values()].map(p => [p.id, p.x, p.z, p.yaw, p.onB, p.bx, p.bz, p.bh, p.bt]);
  players.forEach(p => send(p.ws, { t: 's', p: arr.filter(a => a[0] !== p.id) }));
}, 100);

server.listen(PORT, () => {
  console.log(`Deep Cast server: http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}${ADMIN_PASSWORD === 'admin123' ? '  (PALITAN MO!)' : ''}`);
});
