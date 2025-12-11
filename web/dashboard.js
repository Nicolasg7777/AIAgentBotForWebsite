let supabaseClient;
async function connect(){
  const url=document.getElementById('supabaseUrl').value.trim();
  const key=document.getElementById('supabaseKey').value.trim();
  supabaseClient = window.supabase.createClient(url,key);
  await loadSessions(); await loadBookings();
}

async function loadSessions(){
  const { data } = await supabaseClient.from('sessions').select('id, status, last_activity_at, profiles:profile_id(full_name,email)').order('last_activity_at',{ascending:false}).limit(50);
  const tbody=document.getElementById('sessionsBody'); tbody.innerHTML='';
  (data||[]).forEach(s=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${s.id}</td><td>${s.profiles?.full_name||''}</td><td>${s.status}</td><td>${s.last_activity_at||''}</td>`;
    tbody.appendChild(tr);
  });
}

async function loadBookings(){
  const { data } = await supabaseClient.from('bookings').select('scheduled_for, reminder_email_sent, profiles:profile_id(full_name,email), calendly_link').order('scheduled_for',{ascending:true}).limit(50);
  const tbody=document.getElementById('bookingsBody'); tbody.innerHTML='';
  (data||[]).forEach(b=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${b.scheduled_for||''}</td><td>${b.profiles?.full_name||''}</td><td>${b.profiles?.email||''}</td><td><a href="${b.calendly_link}" target="_blank">Open</a></td><td>${b.reminder_email_sent? 'Sent':'Pending'}</td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('connectBtn').addEventListener('click',connect);
