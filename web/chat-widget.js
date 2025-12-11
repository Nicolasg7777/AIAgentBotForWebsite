(function(){
  const CONFIG = {
    SUPABASE_URL: 'YOUR_SUPABASE_URL',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
    CALENDLY_LINK: 'https://calendly.com/yourname/15min',
    SUPPORT_AGENT_NAME: 'Support Bot',
    GEMINI_API_KEY: 'YOUR_GROQ_API_KEY', // Get free at https://console.groq.com/keys
    USE_AI: true // Set to false to use simple FAQ mode
  };

  const SYSTEM_PROMPT = `You are a helpful customer support agent for our business. Your goal is to:
1. Greet visitors warmly
2. Collect their information in a natural conversation:
   - Full name
   - Email address
   - Phone number
   - Reason for contacting (what they need help with)
   - Their availability for a meeting (days/times)
3. Once you have all info, provide the Calendly scheduling link: ${CONFIG.CALENDLY_LINK || 'https://calendly.com/yourname/15min'}
4. Answer questions about our services (marketing, SEO, web design)
5. Provide helpful information about pricing, hours, and services

IMPORTANT RULES:
- Always be friendly and professional
- Ask for ONE piece of information at a time (don't overwhelm)
- Validate email format before moving on
- If they ask questions, answer them, then gently guide back to collecting info
- Once you have name, email, phone, reason, and availability, summarize and provide the Calendly link
- Keep responses concise (2-3 sentences max)
- Never make up information - if you don't know, say a specialist will follow up

Our business info:
- Services: Marketing, SEO, Web Design, Consulting
- Hours: Mon-Fri 9am-5pm (your timezone)
- Pricing: Custom quotes based on needs

Remember: Your primary goal is to collect contact info and schedule a meeting!`;

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
      
      let greeting;
      if(CONFIG.USE_AI && CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'){
        greeting = `Hi! I'm here to help you. I can answer questions about our services and help schedule a meeting. What brings you here today?`;
      } else {
        greeting = 'Hi! I can help with services, bookings, and questions. Please share your full name.';
      }
      
      addMessage(messages,'bot', greeting);
      await logMessage('bot', greeting);
      conversationHistory.push({ role: 'assistant', content: greeting });
    });
    header.querySelector('.ai-chat-close').addEventListener('click',()=>{ panel.style.display='none'; btn.style.display='inline-block'; });

    let conversationHistory = [];
    let collectedData = { name: null, email: null, phone: null, reason: null, availability: null };

    sendBtn.addEventListener('click', async()=>{
      const text=input.value.trim(); if(!text) return; input.value='';
      addMessage(messages,'user',text); await logMessage('user',text);
      conversationHistory.push({ role: 'user', content: text });

      let reply;
      if(CONFIG.USE_AI && CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'){
        // Use AI mode
        reply = await getAIResponse(text);
        
        // Extract data from conversation context
        extractDataFromConversation(conversationHistory);
        
        // Check if we have all required info
        if(collectedData.name && collectedData.email && collectedData.phone && !reply.includes('calendly')){
          // AI should naturally provide link, but ensure it's there
          if(!conversationHistory.some(msg => msg.content.includes('calendly'))){
            reply += ` You can schedule a time here: ${CONFIG.CALENDLY_LINK}`;
          }
        }
        
        // Save profile if we have the basic info
        if(collectedData.name && collectedData.email && collectedData.phone && !state.profileId){
          await upsertProfile(collectedData.name, collectedData.email, collectedData.phone);
        }
      } else {
        // Fallback to simple FAQ mode
        reply = simpleFAQ(text);
      }
      
      addMessage(messages,'bot',reply);
      await logMessage('bot',reply);
      conversationHistory.push({ role: 'assistant', content: reply });

      // Handle booking if user provides datetime
      const when = parseNaturalTime(text);
      if(when && state.profileId){
        await createBooking(when.toISOString());
      }
    });

    async function getAIResponse(userMessage){
      const models = ['llama-3.1-8b-instant','llama-3.1-70b','gemma2-9b-it'];
      for(const model of models){
        try {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CONFIG.GEMINI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory.map(msg => ({
                  role: msg.role === 'user' ? 'user' : 'assistant',
                  content: msg.content
                }))
              ],
              max_tokens: 200,
              temperature: 0.7
            })
          });
          if(response.ok){
            const data = await response.json();
            return data.choices?.[0]?.message?.content || simpleFAQ(userMessage);
          }
        } catch(err) {
          console.warn('Groq model failed', model, err.message);
        }
      }
      console.log('All Groq models failed, using FAQ fallback');
      return simpleFAQ(userMessage);
    }

    function extractDataFromConversation(history){
      const allText = history.map(m => m.content).join(' ').toLowerCase();
      
      // Extract email
      const emailMatch = allText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
      if(emailMatch && !collectedData.email) collectedData.email = emailMatch[0];
      
      // Extract phone
      const phoneMatch = allText.match(/\+?1?[-.]?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/);
      if(phoneMatch && !collectedData.phone) collectedData.phone = phoneMatch[0];
      
      // Extract name (look for user's first response or after "my name is")
      if(!collectedData.name && history.length > 2){
        const firstUserMsg = history.find(m => m.role === 'user')?.content;
        if(firstUserMsg && firstUserMsg.split(' ').length <= 4 && !firstUserMsg.includes('@')){
          collectedData.name = firstUserMsg;
        }
      }
      
      // Extract reason/availability from context
      for(let i = history.length - 1; i >= 0; i--){
        if(history[i].role === 'user'){
          const msg = history[i].content.toLowerCase();
          if((msg.includes('need') || msg.includes('want') || msg.includes('help')) && !collectedData.reason){
            collectedData.reason = history[i].content;
          }
          if((msg.includes('available') || msg.includes('day') || msg.includes('time') || msg.match(/mon|tue|wed|thu|fri|sat|sun/i)) && !collectedData.availability){
            collectedData.availability = history[i].content;
          }
        }
      }
    }

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
