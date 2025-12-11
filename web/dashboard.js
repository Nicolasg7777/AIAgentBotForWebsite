let supabaseClient;
let config = {};

// Tab management
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-buttons button').forEach(el => el.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
  
  if(tabName === 'analytics' && supabaseClient) loadSessions();
  if(tabName === 'bookings' && supabaseClient) loadBookings();
}

// Load saved config from localStorage
function loadConfig() {
  const saved = localStorage.getItem('aiAgentConfig');
  if(saved) {
    config = JSON.parse(saved);
    document.getElementById('supabaseUrl').value = config.supabaseUrl || '';
    document.getElementById('supabaseKey').value = config.supabaseKey || '';
    document.getElementById('geminiKey').value = config.geminiKey || '';
    document.getElementById('calendlyLink').value = config.calendlyLink || '';
    document.getElementById('agentName').value = config.agentName || 'Support Bot';
    document.getElementById('resendKey').value = config.resendKey || '';
    document.getElementById('fromEmail').value = config.fromEmail || '';
    document.getElementById('twilioSid').value = config.twilioSid || '';
    document.getElementById('twilioToken').value = config.twilioToken || '';
    document.getElementById('twilioPhone').value = config.twilioPhone || '';
    
    // Auto-connect if Supabase creds exist
    if(config.supabaseUrl && config.supabaseKey) {
      supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
    }
  }
}

// Save configuration
function saveConfig() {
  config = {
    supabaseUrl: document.getElementById('supabaseUrl').value.trim(),
    supabaseKey: document.getElementById('supabaseKey').value.trim(),
    geminiKey: document.getElementById('geminiKey').value.trim(),
    calendlyLink: document.getElementById('calendlyLink').value.trim(),
    agentName: document.getElementById('agentName').value.trim() || 'Support Bot',
    resendKey: document.getElementById('resendKey').value.trim(),
    fromEmail: document.getElementById('fromEmail').value.trim(),
    twilioSid: document.getElementById('twilioSid').value.trim(),
    twilioToken: document.getElementById('twilioToken').value.trim(),
    twilioPhone: document.getElementById('twilioPhone').value.trim()
  };
  
  localStorage.setItem('aiAgentConfig', JSON.stringify(config));
  alert('✅ Configuration saved! Now click "Generate WordPress Code" to get your snippet.');
}

// Test Supabase connection
async function testSupabase() {
  const url = document.getElementById('supabaseUrl').value.trim();
  const key = document.getElementById('supabaseKey').value.trim();
  const status = document.getElementById('supabaseStatus');
  
  if(!url || !key) {
    status.innerHTML = '<span class="error">❌ Please enter URL and key</span>';
    return;
  }
  
  try {
    const client = window.supabase.createClient(url, key);
    const { data, error } = await client.from('sessions').select('*').limit(1);
    if(error) throw error;
    
    supabaseClient = client;
    status.innerHTML = '<span class="success">✅ Connected! Found sessions table.</span>';
  } catch(err) {
    status.innerHTML = `<span class="error">❌ Error: ${err.message}</span>`;
  }
}

// Test Gemini AI
async function testGemini() {
  const key = document.getElementById('geminiKey').value.trim();
  const status = document.getElementById('geminiStatus');
  
  if(!key) {
    status.innerHTML = '<span class="error">❌ Please enter API key</span>';
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say "AI test successful" in exactly 3 words.' }] }]
      })
    });
    
    if(!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    
    status.innerHTML = `<span class="success">✅ AI working! Response: "${reply}"</span>`;
  } catch(err) {
    status.innerHTML = `<span class="error">❌ Error: ${err.message}</span>`;
  }
}

// Test email sending
async function testEmail() {
  const key = document.getElementById('resendKey').value.trim();
  const from = document.getElementById('fromEmail').value.trim();
  const status = document.getElementById('emailStatus');
  
  if(!key || !from) {
    status.innerHTML = '<span class="error">❌ Please enter API key and from email</span>';
    return;
  }
  
  const testTo = prompt('Enter your email to receive test:', from);
  if(!testTo) return;
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: from,
        to: testTo,
        subject: 'Test Email from AI Support Agent',
        html: '<p>✅ Your email reminders are configured correctly!</p><p>This is a test from your AI Support Agent dashboard.</p>'
      })
    });
    
    if(!response.ok) {
      const err = await response.json();
      throw new Error(err.message || `HTTP ${response.status}`);
    }
    
    status.innerHTML = '<span class="success">✅ Email sent! Check your inbox.</span>';
  } catch(err) {
    status.innerHTML = `<span class="error">❌ Error: ${err.message}</span>`;
  }
}

// Test SMS sending
async function testSMS() {
  const sid = document.getElementById('twilioSid').value.trim();
  const token = document.getElementById('twilioToken').value.trim();
  const from = document.getElementById('twilioPhone').value.trim();
  const status = document.getElementById('smsStatus');
  
  if(!sid || !token || !from) {
    status.innerHTML = '<span class="error">❌ Please enter all Twilio credentials</span>';
    return;
  }
  
  const testTo = prompt('Enter your phone number (+1234567890):', from);
  if(!testTo) return;
  
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${sid}:${token}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: from,
        To: testTo,
        Body: '✅ SMS test successful! Your AI Support Agent is configured.'
      })
    });
    
    if(!response.ok) {
      const err = await response.json();
      throw new Error(err.message || `HTTP ${response.status}`);
    }
    
    status.innerHTML = '<span class="success">✅ SMS sent! Check your phone.</span>';
  } catch(err) {
    status.innerHTML = `<span class="error">❌ Error: ${err.message}</span>`;
  }
}

// Generate WordPress snippet
function generateSnippet() {
  if(!config.supabaseUrl || !config.supabaseKey) {
    alert('⚠️ Please enter Supabase credentials and click "Save Configuration" first!');
    return;
  }
  
  const snippet = `<!-- AI Support Agent - Auto-generated from Dashboard -->
<style>
.ai-chat-button{position:fixed;right:20px;bottom:20px;background:#2b6cb0;color:#fff;border:none;border-radius:24px;padding:12px 16px;box-shadow:0 8px 24px rgba(0,0,0,.2);cursor:pointer;font-family:Inter,system-ui,sans-serif;z-index:9999}
.ai-chat-button:hover{background:#2c5282}
.ai-chat-panel{position:fixed;right:20px;bottom:70px;width:340px;max-height:480px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);display:none;flex-direction:column;overflow:hidden;z-index:9999}
.ai-chat-header{padding:10px 12px;background:#2b6cb0;color:#fff;font-weight:600}
.ai-chat-messages{flex:1;overflow:auto;padding:12px;background:#f8fafc}
.ai-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid #e2e8f0}
.ai-chat-input input{flex:1;border:1px solid #cbd5e1;border-radius:8px;padding:8px}
.msg{margin-bottom:10px}
.msg .bubble{display:inline-block;padding:8px 10px;border-radius:10px;max-width:85%}
.msg.user .bubble{background:#e2e8f0;color:#1f2937}
.msg.bot .bubble{background:#eef2ff;color:#1e293b}
.ai-chat-close{float:right;cursor:pointer}
</style>
<script>(function(){
  const CONFIG = {
    SUPABASE_URL: '${config.supabaseUrl}',
    SUPABASE_ANON_KEY: '${config.supabaseKey}',
    CALENDLY_LINK: '${config.calendlyLink || 'https://calendly.com/yourname/15min'}',
    SUPPORT_AGENT_NAME: '${config.agentName || 'Support Bot'}',
    GEMINI_API_KEY: '${config.geminiKey || ''}',
    USE_AI: ${config.geminiKey ? 'true' : 'false'}
  };
  const SYSTEM_PROMPT = \`You are a helpful customer support agent. Your goal: 1) Greet warmly 2) Collect: full name, email, phone, reason for contact, availability 3) Provide Calendly link: \${CONFIG.CALENDLY_LINK} 4) Answer service questions. RULES: Ask ONE question at a time, validate email format, be concise (2-3 sentences), guide conversation toward booking. Services: Marketing, SEO, Web Design. Hours: Mon-Fri 9am-5pm. Pricing: Custom quotes.\`;
  let supabaseClient; const loadSupabase = async () => { if(window.supabase) return; await new Promise((resolve)=>{ const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.onload=resolve; document.head.appendChild(s); }); };
  const state={ sessionId:null, profileId:null }; let conversationHistory=[]; let collectedData={name:null,email:null,phone:null,reason:null,availability:null};
  function el(tag, attrs={}, children=[]) { const e=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') e.className=v; else e.setAttribute(k,v); }); children.forEach(c=>{ if(typeof c==='string') e.appendChild(document.createTextNode(c)); else if(c) e.appendChild(c); }); return e; }
  function addMessage(container, sender, text){ const msg=el('div',{class:'msg '+sender},[ el('div',{class:'bubble'},[text]) ]); container.appendChild(msg); container.scrollTop=container.scrollHeight; }
  async function ensureSession(){ if(state.sessionId) return state.sessionId; const { data, error } = await supabaseClient.from('sessions').insert({}).select().single(); if(error) console.error(error); state.sessionId=data.id; return data.id; }
  async function upsertProfile(full_name, email, phone){ const { data, error } = await supabaseClient.from('profiles').insert({ full_name, email, phone }).select().single(); if(error) console.error(error); state.profileId=data.id; await supabaseClient.from('sessions').update({ profile_id: data.id }).eq('id', state.sessionId); }
  async function logMessage(sender, content){ await supabaseClient.from('messages').insert({ session_id: state.sessionId, sender, content }); }
  async function createBooking(whenISO){ await supabaseClient.from('bookings').insert({ session_id: state.sessionId, profile_id: state.profileId, calendly_link: CONFIG.CALENDLY_LINK, scheduled_for: whenISO }); }
  async function getAI(userMsg){ try { const r=await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${CONFIG.GEMINI_API_KEY}\`,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ contents:[{role:'user',parts:[{text:SYSTEM_PROMPT}]},...conversationHistory.map(m=>({role:m.role==='user'?'user':'model',parts:[{text:m.content}]}))], generationConfig:{temperature:0.7,maxOutputTokens:200,topP:0.8,topK:10} }) }); if(!r.ok) throw new Error('API error'); const d=await r.json(); return d.candidates[0].content.parts[0].text; } catch(e){ console.error('AI:',e); return simpleFAQ(userMsg); } }
  function extractData(h){ const t=h.map(m=>m.content).join(' '); const em=t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}/i); if(em&&!collectedData.email) collectedData.email=em[0]; const ph=t.match(/\\+?1?[-.]?\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}/); if(ph&&!collectedData.phone) collectedData.phone=ph[0]; if(!collectedData.name&&h.length>2){ const f=h.find(m=>m.role==='user')?.content; if(f&&f.split(' ').length<=4&&!f.includes('@')) collectedData.name=f; } for(let i=h.length-1;i>=0;i--){ if(h[i].role==='user'){ const m=h[i].content.toLowerCase(); if((m.includes('need')||m.includes('want')||m.includes('help'))&&!collectedData.reason) collectedData.reason=h[i].content; if((m.includes('available')||m.includes('day')||m.includes('time')||m.match(/mon|tue|wed|thu|fri|sat|sun/i))&&!collectedData.availability) collectedData.availability=h[i].content; }} }
  function simpleFAQ(q){ q=q.toLowerCase(); if(q.includes('price')||q.includes('cost')) return 'Our pricing is customized; share your needs and we will propose options.'; if(q.includes('service')) return 'We offer marketing, SEO, and web design. Ask me specifics!'; if(q.includes('hours')) return 'We are available Mon–Fri, 9am–5pm.'; return 'Thanks! A specialist will review and follow up.'; }
  function parseNaturalTime(text){ const m=text.match(/(\\d{4}-\\d{2}-\\d{2})\\s+(\\d{2}:\\d{2})/); if(m){ const dt=new Date(m[1]+'T'+m[2]+':00'); if(!isNaN(dt)) return dt; } return null; }
  async function init(){ await loadSupabase(); supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    const btn=el('button',{class:'ai-chat-button'},['Chat with us']); const panel=el('div',{class:'ai-chat-panel'}); const header=el('div',{class:'ai-chat-header'},[CONFIG.SUPPORT_AGENT_NAME, el('span',{class:'ai-chat-close'},['✕'])]); const messages=el('div',{class:'ai-chat-messages'}); const inputWrap=el('div',{class:'ai-chat-input'}); const input=el('input',{type:'text',placeholder:'Type your message...'}); const sendBtn=el('button',{},['Send']); inputWrap.appendChild(input); inputWrap.appendChild(sendBtn); panel.appendChild(header); panel.appendChild(messages); panel.appendChild(inputWrap); document.body.appendChild(btn); document.body.appendChild(panel);
    btn.addEventListener('click', async()=>{ panel.style.display='flex'; btn.style.display='none'; await ensureSession(); const g=CONFIG.USE_AI&&CONFIG.GEMINI_API_KEY?\`Hi! I'm here to help. I can answer questions about our services and help schedule a meeting. What brings you here today?\`:'Hi! I can help with services and bookings. Please share your full name.'; addMessage(messages,'bot',g); await logMessage('bot',g); conversationHistory.push({role:'assistant',content:g}); }); header.querySelector('.ai-chat-close').addEventListener('click',()=>{ panel.style.display='none'; btn.style.display='inline-block'; });
    sendBtn.addEventListener('click', async()=>{ const text=input.value.trim(); if(!text) return; input.value=''; addMessage(messages,'user',text); await logMessage('user',text); conversationHistory.push({role:'user',content:text}); let reply; if(CONFIG.USE_AI&&CONFIG.GEMINI_API_KEY){ reply=await getAI(text); extractData(conversationHistory); if(collectedData.name&&collectedData.email&&collectedData.phone&&!reply.includes('calendly')){ if(!conversationHistory.some(m=>m.content.includes('calendly'))) reply+=\` You can schedule here: \${CONFIG.CALENDLY_LINK}\`; } if(collectedData.name&&collectedData.email&&collectedData.phone&&!state.profileId) await upsertProfile(collectedData.name,collectedData.email,collectedData.phone); } else { reply=simpleFAQ(text); } addMessage(messages,'bot',reply); await logMessage('bot',reply); conversationHistory.push({role:'assistant',content:reply}); const when=parseNaturalTime(text); if(when&&state.profileId) await createBooking(when.toISOString()); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();</script>`;

  document.getElementById('generatedSnippet').textContent = snippet;
  showTab('snippet');
  document.querySelectorAll('.tab-buttons button')[3].classList.add('active');
  alert('✅ WordPress code generated! Switch to "Get Code" tab to copy it.');
}

// Copy snippet to clipboard
function copySnippet() {
  const snippet = document.getElementById('generatedSnippet').textContent;
  navigator.clipboard.writeText(snippet).then(() => {
    alert('✅ Code copied to clipboard! Now paste into WordPress WPCode.');
  }).catch(err => {
    alert('❌ Failed to copy. Please select and copy manually.');
  });
}

// Send email reminder
async function sendReminder(bookingId, email, name, scheduledFor) {
  if(!config.resendKey || !config.fromEmail) {
    alert('⚠️ Email not configured. Add Resend credentials in Setup tab.');
    return;
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: email,
        subject: 'Meeting Reminder',
        html: `<p>Hi ${name},</p><p>This is a reminder about your scheduled meeting on ${scheduledFor}.</p><p>Looking forward to speaking with you!</p>`
      })
    });
    
    if(response.ok) {
      await supabaseClient.from('bookings').update({ reminder_email_sent: true }).eq('id', bookingId);
      alert('✅ Reminder sent!');
      loadBookings();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch(err) {
    alert(`❌ Failed to send: ${err.message}`);
  }
}

// Load sessions
async function loadSessions(){
  if(!supabaseClient) return;
  const { data } = await supabaseClient.from('sessions').select('id, status, last_activity_at, profiles:profile_id(full_name,email)').order('last_activity_at',{ascending:false}).limit(50);
  const tbody=document.getElementById('sessionsBody'); tbody.innerHTML='';
  (data||[]).forEach(s=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${s.id.substring(0,8)}...</td><td>${s.profiles?.full_name||'Anonymous'}</td><td>${s.status}</td><td>${new Date(s.last_activity_at).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
}

// Load bookings
async function loadBookings(){
  if(!supabaseClient) return;
  const { data } = await supabaseClient.from('bookings').select('id, scheduled_for, reminder_email_sent, profiles:profile_id(full_name,email,phone), calendly_link').order('scheduled_for',{ascending:true}).limit(50);
  const tbody=document.getElementById('bookingsBody'); tbody.innerHTML='';
  (data||[]).forEach(b=>{
    const tr=document.createElement('tr');
    const reminderBtn = b.reminder_email_sent ? 
      '<span class="status-badge status-connected">Sent</span>' :
      `<button onclick="sendReminder('${b.id}','${b.profiles?.email}','${b.profiles?.full_name}','${b.scheduled_for}')">Send Email</button>`;
    tr.innerHTML=`<td>${new Date(b.scheduled_for).toLocaleString()}</td><td>${b.profiles?.full_name||'N/A'}</td><td>${b.profiles?.email||'N/A'}</td><td>${b.profiles?.phone||'N/A'}</td><td><a href="${b.calendly_link}" target="_blank">Open</a></td><td>${reminderBtn}</td><td><button onclick="if(confirm('Delete?')) deleteBooking('${b.id}')">🗑️</button></td>`;
    tbody.appendChild(tr);
  });
}

// Delete booking
async function deleteBooking(id) {
  await supabaseClient.from('bookings').delete().eq('id', id);
  loadBookings();
}

// Initialize on load
window.addEventListener('DOMContentLoaded', loadConfig);
