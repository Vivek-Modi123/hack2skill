const emails=[
 {sender:"Dr. Priya Sharma",subject:"Project submission deadline moved to Friday",summary:"The project deadline has been moved from Monday to Friday at 5 PM. Please submit your final report through the portal.",priority:"high",cat:"Academic",time:"9:42 AM"},
 {sender:"Rahul Mehta",subject:"Can we discuss the internship opportunity?",summary:"Rahul would like to schedule a short call to discuss an internship opportunity and next steps.",priority:"medium",cat:"Career",time:"10:18 AM"},
 {sender:"Amazon Web Services",subject:"Your AWS billing alert",summary:"Your estimated monthly AWS charges have crossed the configured alert threshold. Review your current usage.",priority:"medium",cat:"Finance",time:"Yesterday"},
 {sender:"Product Weekly",subject:"August product trends you should know",summary:"A weekly digest covering product, AI and startup news. No action is required.",priority:"low",cat:"Newsletter",time:"Yesterday"},
 {sender:"Finance Alert",subject:"Urgent: verify your account",summary:"This message asks you to sign in through an external link. AlphaMail AI detected suspicious sender details.",priority:"high",cat:"Security",time:"Yesterday"}
];
const tasks=[
 {title:"Submit final project report",date:"Due Friday · 5:00 PM",done:false},
 {title:"Reply to Rahul about internship call",date:"Due today",done:false},
 {title:"Review AWS billing alert",date:"Due tomorrow",done:false},
 {title:"Schedule project team meeting",date:"Next Tuesday",done:true},
 {title:"Send follow-up to professor",date:"Due Aug 12",done:false}
];
function emailHTML(e){
 return `<div class="email" onclick="openEmail('${e.sender}')"><div class="email-top"><span class="sender">${e.sender}</span><span class="time">${e.time}</span></div><div class="subject">${e.subject}</div><div class="summary">${e.summary}</div><div class="tags"><span class="tag ${e.priority}">${e.priority==='high'?'🔴 High':e.priority==='medium'?'🟡 Medium':'🟢 Low'}</span><span class="tag">${e.cat}</span>${e.cat==='Security'?'<span class="tag high">⚠ Review</span>':''}</div></div>`
}
function taskHTML(t,i){return `<div class="task ${t.done?'done':''}" onclick="toggleTask(${i})"><div class="check"></div><div><div class="task-title">${t.title}</div><div class="task-date">${t.date}</div></div></div>`}
function render(){document.getElementById('emailList').innerHTML=emails.slice(0,4).map(emailHTML).join('');document.getElementById('inboxList').innerHTML=emails.map(emailHTML).join('');document.getElementById('taskList').innerHTML=tasks.slice(0,4).map((t,i)=>taskHTML(t,i)).join('');document.getElementById('allTasks').innerHTML=tasks.map((t,i)=>taskHTML(t,i)).join('')}
function toggleTask(i){tasks[i].done=!tasks[i].done;render();notify(tasks[i].done?'Task completed':'Task reopened')}
function switchView(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));let names={dashboard:['Good afternoon, Vivek','Here’s what AlphaMail AI found in your inbox.'],inbox:['AI Inbox','Every message analyzed, prioritized and summarized.'],tasks:['Tasks & Deadlines','Actionable items extracted automatically from your emails.'],security:['Security Center','AI-powered spam and phishing protection.'],analytics:['Analytics','See how AlphaMail AI is saving you time.']};document.getElementById('pageTitle').textContent=names[id][0];document.getElementById('pageSub').textContent=names[id][1]}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
function notify(msg){let t=document.getElementById('toast');t.textContent=msg;t.style.display='block';clearTimeout(window.tt);window.tt=setTimeout(()=>t.style.display='none',2200)}
function openEmail(sender){let e=emails.find(x=>x.sender===sender);document.getElementById('pageTitle').textContent=e.subject;document.getElementById('pageSub').textContent='AI analysis · '+e.sender;document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('inbox').classList.add('active');document.getElementById('inboxList').innerHTML=`<div class="reply"><div class="tags"><span class="tag ${e.priority}">${e.priority.toUpperCase()} PRIORITY</span><span class="tag">${e.cat}</span></div><h2>${e.subject}</h2><p style="color:var(--muted);font-size:13px">${e.sender}</p><div class="card" style="box-shadow:none;margin:20px 0"><b>✦ AI Summary</b><p style="font-size:13px;line-height:1.6;color:var(--muted)">${e.summary}</p><b>✅ Suggested action</b><p style="font-size:13px;color:var(--muted)">${e.priority==='high'?'Respond or complete the requested action as soon as possible.':'Review when convenient; no immediate action is required.'}</p></div><h3>Smart Reply</h3><textarea id="replyText">Thank you for the update. I’ve reviewed your message and will take the requested action. Please let me know if there is anything else you need from me.</textarea><div class="reply-tools"><select class="select"><option>Professional</option><option>Friendly</option><option>Concise</option><option>Formal</option></select><button class="btn primary" onclick="notify('AI reply generated')">✦ Generate reply</button></div></div>`}
render();

/* -----------------------------
   DEPLOYED AI API
----------------------------- */

async function analyzeInbox() {

  const status = document.getElementById("aiAnalysisStatus");

  if (status) {
    status.style.display = "block";
    status.textContent = "✦ AlphaMail AI is analyzing the inbox...";
  }

  try {

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        emails: emails.map(email => ({
          sender: email.sender,
          subject: email.subject,
          summary: email.summary,
          priority: email.priority,
          category: email.cat
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI analysis failed");
    }

    if (status) {
      status.textContent =
        `✓ AI analysis complete · ${data.results.length} emails analyzed`;
    }

    notify("AI inbox analysis completed");

    if (data.results && data.results.length) {
      console.log("AlphaMail AI analysis:", data.results);
    }

  } catch (error) {

    if (status) {
      status.textContent =
        "Demo mode: connect OPENAI_API_KEY to enable live AI analysis.";
    }

    notify("Live AI is not configured yet");

    console.error(error);
  }
}

async function generateLiveReply(emailText) {

  try {

    const response = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailText,
        tone: "professional"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Reply generation failed");
    }

    return data.reply;

  } catch (error) {

    console.error(error);

    return null;
  }
}
