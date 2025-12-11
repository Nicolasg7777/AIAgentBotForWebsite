(function(){
  const CONFIG = {
    SUPABASE_URL: 'YOUR_SUPABASE_URL',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
    CALENDLY_LINK: 'https://calendly.com/yourname/15min',
    SUPPORT_AGENT_NAME: 'Support Bot'
  };

  let supabaseClient;
  const loadSupabase = async () => {
    if(window.supabase) return;
    await new Promise((resolve)=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload=resolve; document.head.appendChild(s);
    });
  };

  const state={ sessionId:null, profileId:null };

  function el(tag, attrs={}, children=[]) {
    const e=document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') e.className=v; else e.setAttribute(k,v); });
    children.forEach(c=>{ if(typeof c==='string') e.appendChild(document.createTextNode(c)); else if(c) e.appendChild(c); });
    return e;
  }

  function addMessage(container, sender, text){
    const msg=el('div',{class:'msg '+sender},[ el('div',{class:'bubble'},[text]) ]);
    container.appendChild(msg); container.scrollTop=container.scrollHeight;
  }

  async function ensureSession(){
    if(state.sessionId) return state.sessionId;
    const { data, error } = await supabaseClient.from('sessions').insert({}).select().single();
    if(error) console.error(error);
    state.sessionId=data.id; return data.id;
  }

  async function upsertProfile(full_name, email, phone){
    const { data, error } = await supabaseClient.from('profiles').insert({ full_name, email, phone }).select().single();
    if(error) console.error(error); state.profileId=data.id;
    await supabaseClient.from('sessions').update({ profile_id: data.id }).eq('id', state.sessionId);
  }

  async function logMessage(sender, content){
    await supabaseClient.from('messages').insert({ session_id: state.sessionId, sender, content });
  }

  async function createBooking(whenISO){
    await supabaseClient.from('bookings').insert({
      session_id: state.sessionId,
      profile_id: state.profileId,
      calendly_link: CONFIG.CALENDLY_LINK,
      scheduled_for: whenISO
    });
  }

  async function init(){
    await loadSupabase();
    supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

    const btn=el('button',{class:'ai-chat-button'},['Chat with us']);
    const panel=el('div',{class:'ai-chat-panel'});
    const header=el('div',{class:'ai-chat-header'},[CONFIG.SUPPORT_AGENT_NAME, el('span',{class:'ai-chat-close'},['✕'])]);
    const messages=el('div',{class:'ai-chat-messages'});
    const inputWrap=el('div',{class:'ai-chat-input'});
    const input=el('input',{type:'text',placeholder:'Type your message...'});
    const sendBtn=el('button',{},['Send']);
    inputWrap.appendChild(input); inputWrap.appendChild(sendBtn);
    panel.appendChild(header); panel.appendChild(messages); panel.appendChild(inputWrap);
    document.body.appendChild(btn); document.body.appendChild(panel);

    btn.addEventListener('click', async()=>{
      panel.style.display='flex'; btn.style.display='none';
      await ensureSession();
      addMessage(messages,'bot','Hi! I can help with services, bookings, and questions. Please share your full name.');
      await logMessage('bot','Hi! I can help with services, bookings, and questions. Please share your full name.');
    });
    header.querySelector('.ai-chat-close').addEventListener('click',()=>{ panel.style.display='none'; btn.style.display='inline-block'; });

    let step=0, fullName='', email='', phone='', availability='';

    sendBtn.addEventListener('click', async()=>{
      const text=input.value.trim(); if(!text) return; input.value='';
      addMessage(messages,'user',text); await logMessage('user',text);

      if(step===0){
        fullName=text; addMessage(messages,'bot','Thanks '+fullName+"! What's your email?"); await logMessage('bot','Ask email'); step=1; return;
      }
      if(step===1){
        email=text; addMessage(messages,'bot','Got it. Your phone number?'); await logMessage('bot','Ask phone'); step=2; return;
      }
      if(step===2){
        phone=text; await upsertProfile(fullName,email,phone);
        addMessage(messages,'bot','What days/times are you available? (e.g., Tue 2-4pm)'); await logMessage('bot','Ask availability'); step=3; return;
      }
      if(step===3){
        availability=text;
        addMessage(messages,'bot','Great. Use this link to pick a slot that fits: '+CONFIG.CALENDLY_LINK);
        await logMessage('bot','Provided Calendly link');
        addMessage(messages,'bot','If you tell me your chosen date/time, I will log it and send reminders.');
        await logMessage('bot','Ask chosen datetime'); step=4; return;
      }
      if(step===4){
        const when = parseNaturalTime(text); // simple parser
        if(!when){ addMessage(messages,'bot','Please provide a date/time like "2025-01-12 15:30" (local time).'); return; }
        await createBooking(when.toISOString());
        addMessage(messages,'bot','Booked! We will email a reminder before the meeting.');
        await logMessage('bot','Booking created for '+when.toISOString()); step=5; return;
      }
      // FAQ / fallback
      const reply = simpleFAQ(text);
      addMessage(messages,'bot',reply); await logMessage('bot',reply);
    });

    function simpleFAQ(q){
      q=q.toLowerCase();
      if(q.includes('price')||q.includes('cost')) return 'Our pricing is customized; share your needs and we will propose options.';
      if(q.includes('service')) return 'We offer marketing, SEO, and web design. Ask me specifics!';
      if(q.includes('hours')) return 'We are available Mon–Fri, 9am–5pm local time.';
      return 'Thanks! A specialist will review this and follow up.';
    }

    function parseNaturalTime(text){
      // very simple: if it looks like YYYY-MM-DD HH:MM
      const m=text.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
      if(m){ const dt=new Date(m[1]+'T'+m[2]+':00'); if(!isNaN(dt)) return dt; }
      return null;
    }
  }

  // Load CSS if not included elsewhere
  (function injectCSS(){
    const link=document.createElement('link');
    link.rel='stylesheet'; link.href='https://cdn.jsdelivr.net/gh/your-org/your-repo@main/web/chat-widget.css';
    document.head.appendChild(link);
  })();

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
