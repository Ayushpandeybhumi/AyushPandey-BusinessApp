(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* footer year */
$('#year').textContent=new Date().getFullYear();

/* mobile menu */
var btn=$('#menuBtn'),links=$('#navLinks');
function setMenu(o){links.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu')}
btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
$$('a',links).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

/* KPI count-up (runs once when dashboard is visible) */
function fmt(n,d){return n.toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d})}
function countUp(el){
  var end=parseFloat(el.dataset.count),d=+el.dataset.dec||0,suf=el.dataset.suf||'',t0=null,dur=1200;
  function step(t){t0=t0||t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=fmt(end*e,d)+suf;if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
}
if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('[data-count]').forEach(countUp);io.disconnect()}})},{threshold:.3});
  io.observe($('.kpis'));
}

/* Chart: trips completed vs delayed (SVG, no libraries) */
var weekDays=['Mon','Tue','Wed','Thu','Fri','Sat'],weekOk=[1120,1184,1210,1165,1230,640],weekLate=[62,48,55,70,41,22];
(function(){
  var days=weekDays,ok=weekOk,late=weekLate;
  var W=760,H=300,L=44,B=34,T=14,ph=H-B-T,max=1400,ns='http://www.w3.org/2000/svg',h='';
  for(var g=0;g<=4;g++){var v=g*350,y=T+ph-(v/max)*ph;h+='<line x1="'+L+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="#3a3a3c"/><text x="'+(L-8)+'" y="'+(y+4)+'" text-anchor="end" fill="#a1a1a6" font-size="12">'+v+'</text>'}
  var gw=(W-L)/days.length;
  days.forEach(function(d,i){
    var x=L+i*gw+gw/2,bw=Math.min(34,gw/4),h1=ok[i]/max*ph,h2=late[i]/max*ph;
    h+='<rect x="'+(x-bw-3)+'" y="'+(T+ph-h1)+'" width="'+bw+'" height="'+h1+'" rx="6" fill="#2997ff"><title>'+d+': '+ok[i]+' completed</title></rect>';
    h+='<rect x="'+(x+3)+'" y="'+(T+ph-h2)+'" width="'+bw+'" height="'+h2+'" rx="6" fill="#ff9f0a"><title>'+d+': '+late[i]+' delayed</title></rect>';
    h+='<text x="'+x+'" y="'+(H-10)+'" text-anchor="middle" fill="#a1a1a6" font-size="13">'+d+'</text>';
  });
  $('#chart').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true" focusable="false">'+h+'</svg>';
})();

/* FEATURE: Track a ride */
var trips={
 OR1001:{n:'Anita Sharma',route:'Alkapuri → TechPark, Gotri',s:'On the way',step:2,veh:'GJ-06-AB-4521 · 26-seater shuttle',drv:'Ramesh Patel',ph:'+91 98250 00011',loc:'Near Race Course Circle',eta:'8:42 AM'},
 OR1002:{n:'Rahul Verma',route:'Manjalpur → Makarpura GIDC',s:'Vehicle assigned',step:1,veh:'GJ-06-CD-1187 · 4-seater cab',drv:'Suresh Solanki',ph:'+91 98250 00022',loc:'Depot, Manjalpur',eta:'9:10 AM'},
 OR1003:{n:'Neha Joshi',route:'Karelibaug → Vasna Office Park',s:'Picked up',step:3,veh:'GJ-06-EF-9032 · 4-seater cab',drv:'Imran Shaikh',ph:'+91 98250 00033',loc:'Sayajigunj Bridge',eta:'9:05 AM'},
 OR1004:{n:'Amit Desai',route:'Waghodia Road → Makarpura GIDC',s:'Delayed',step:2,veh:'GJ-06-GH-7710 · 26-seater shuttle',drv:'Kiran Rathod',ph:'+91 98250 00044',loc:'Waghodia Crossing (traffic)',eta:'9:25 AM (+12 min)',late:1},
 OR1005:{n:'Pooja Mehta',route:'Alkapuri → TechPark, Gotri',s:'Completed',step:4,veh:'GJ-06-AB-4521 · 26-seater shuttle',drv:'Ramesh Patel',ph:'+91 98250 00011',loc:'TechPark, Gotri (dropped)',eta:'Arrived 8:31 AM',done:1},
 OR1006:{n:'Sanjay Iyer',route:'Gotri → Alkapuri',s:'Completed',step:4,veh:'GJ-06-CD-1187 · 4-seater cab',drv:'Suresh Solanki',ph:'+91 98250 00022',loc:'Alkapuri (dropped)',eta:'Arrived 8:12 AM',done:1},
 OR1007:{n:'Kavita Nair',route:'Vasna → Makarpura GIDC',s:'Completed',step:4,veh:'GJ-06-EF-9032 · 4-seater cab',drv:'Imran Shaikh',ph:'+91 98250 00033',loc:'Makarpura GIDC (dropped)',eta:'Arrived 7:55 AM',done:1},
 OR1008:{n:'Deepak Rana',route:'Manjalpur → TechPark, Gotri',s:'Completed',step:4,veh:'GJ-06-GH-7710 · 26-seater shuttle',drv:'Kiran Rathod',ph:'+91 98250 00044',loc:'TechPark, Gotri (dropped)',eta:'Arrived 7:40 AM',done:1},
 OR1009:{n:'Farah Qureshi',route:'Sayajigunj → TechPark, Gotri',s:'On the way',step:2,veh:'GJ-06-AB-4521 · 26-seater shuttle',drv:'Ramesh Patel',ph:'+91 98250 00011',loc:'Pratap Nagar Road',eta:'8:55 AM'},
 OR0999:{n:'Anita Sharma',route:'Alkapuri → TechPark, Gotri',s:'Completed',step:4,veh:'GJ-06-AB-4521 · 26-seater shuttle',drv:'Ramesh Patel',ph:'+91 98250 00011',loc:'TechPark, Gotri (dropped)',eta:'Arrived 8:34 AM (1 day ago)',done:1,h:1},
 OR0998:{n:'Anita Sharma',route:'TechPark, Gotri → Alkapuri',s:'Completed',step:4,veh:'GJ-06-AB-4521 · 26-seater shuttle',drv:'Ramesh Patel',ph:'+91 98250 00011',loc:'Alkapuri (dropped)',eta:'Arrived 6:52 PM (2 days ago)',done:1,h:1},
 OR0997:{n:'Anita Sharma',route:'Alkapuri → TechPark, Gotri',s:'Completed',step:4,veh:'GJ-06-AB-4521 · 26-seater shuttle',drv:'Ramesh Patel',ph:'+91 98250 00011',loc:'TechPark, Gotri (dropped)',eta:'Arrived 8:29 AM (2 days ago)',done:1,h:1}
};
var labels=['Booked','Vehicle assigned','On the way','Picked up','Dropped'];
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var form=$('#trackForm'),input=$('#tripId'),out=$('#trackResult');
function track(raw){
  var id=raw.trim().toUpperCase().replace(/\s+/g,''),t=trips[id];
  if(!id){out.innerHTML='<p class="err">Enter a Trip ID, for example OR1001.</p>';input.focus();return}
  if(!t){out.innerHTML='<p class="err">No trip found for “'+esc(id)+'”. Check the ID in your booking message, or try OR1001 to OR1009.</p>';return}
  var cls=t.late?'badge late':t.done?'badge done':'badge';
  out.innerHTML='<div class="res-card"><div class="res-top"><h3>Trip '+id+'</h3><span class="'+cls+'">'+t.s+'</span></div><p>'+t.route+'</p>'+
  '<ol class="steps" aria-label="Trip progress">'+labels.map(function(l,i){return'<li'+(i<=t.step?' class="on"':'')+(i===t.step?' aria-current="step"':'')+'>'+l+'</li>'}).join('')+'</ol>'+
  '<dl class="facts"><div><dt>Employee</dt><dd>'+t.n+'</dd></div><div><dt>Current location</dt><dd>'+t.loc+'</dd></div><div><dt>Expected time</dt><dd>'+t.eta+'</dd></div><div><dt>Vehicle</dt><dd>'+t.veh+'</dd></div><div><dt>Driver</dt><dd>'+t.drv+'</dd></div><div><dt>Contact</dt><dd><a href="tel:'+t.ph.replace(/\s/g,'')+'">'+t.ph+'</a></dd></div></dl></div>';
}
form.addEventListener('submit',function(e){e.preventDefault();track(input.value)});
$$('.chip').forEach(function(c){c.addEventListener('click',function(){input.value=c.dataset.id;track(c.dataset.id)})});

/* Enquiry form: sends straight to the owner's inbox through FormSubmit (no email app needed) */
var MAIL_TO='ayush52827@gmail.com',ENDPOINT='https://formsubmit.co/ajax/'+MAIL_TO;
var enq=$('#enqForm'),st=$('#enqStatus');
function mailHref(){var f=enq.elements;return'mailto:'+MAIL_TO+'?subject='+encodeURIComponent('OfficeRide enquiry from '+f.name.value)+'&body='+encodeURIComponent('Name: '+f.name.value+'\nEmail: '+f.email.value+'\nCompany: '+f.company.value+'\nEmployees: '+f.emp.value+'\nService: '+f.svc.value+'\n\n'+f.msg.value)}
function fail(msg){st.className='status bad';st.textContent=msg+' ';var a=document.createElement('a');a.href=mailHref();a.textContent='Send with your email app instead';st.appendChild(a);st.appendChild(document.createTextNode('.'))}
enq.addEventListener('submit',function(e){
  e.preventDefault();
  var f=enq.elements,btn=enq.querySelector('button[type=submit]'),name=f.name.value.trim(),mail=f.email.value.trim();
  if(!name){st.className='status bad';st.textContent='Please enter your name.';f.name.focus();return}
  if(!/^\S+@\S+\.\S+$/.test(mail)){st.className='status bad';st.textContent='Please enter a valid work email, like name@company.com.';f.email.focus();return}
  if(f._honey.value){enq.reset();return}
  btn.disabled=true;btn.textContent='Sending…';st.className='status';st.textContent='';
  fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({
    name:name,email:mail,company:f.company.value,employees:f.emp.value,service:f.svc.value,message:f.msg.value,
    _subject:'OfficeRide enquiry from '+name,_template:'table',_captcha:'false',
    _autoresponse:'Hello '+name.split(' ')[0]+', thank you for contacting OfficeRide. We have received your enquiry and will reply within one working day.'})})
  .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
  .then(function(x){
    if(x.ok&&String(x.d.success)==='true'){st.className='status ok';st.textContent='Thank you, '+name.split(' ')[0]+'. Your enquiry has been sent. We will reply within one working day.';enq.reset()}
    else{var m=String((x.d&&x.d.message)||'');
      if(/activat/i.test(m)){fail('This form needs a one-time activation. Open the "Activate Form" email sent to '+MAIL_TO+' (check Spam), click Activate, then send again.')}
      else{fail('Your enquiry could not be sent right now'+(m?' ('+m+').':'.'))}}
  })
  .catch(function(){
    if(location.protocol==='file:'){fail('Sending does not work from a file on your computer. Open the live GitHub Pages link and try again, or')}
    else{fail('Your enquiry could not be sent. Check your internet connection or any ad blocker, then try again, or')}
  })
  .then(function(){btn.disabled=false;btn.textContent='Send enquiry'});
});

/* Live trips board (dashboard) and recent trips (track section) */
var ids=Object.keys(trips),liveIds=ids.filter(function(k){return!trips[k].done}),doneIds=ids.filter(function(k){return trips[k].done&&!trips[k].h});
var nLate=liveIds.filter(function(k){return trips[k].late}).length;
$('#liveSummary').textContent=liveIds.length+' trips in progress, '+nLate+' delayed. Select a trip ID to see full details.';
$('#liveBody').innerHTML=liveIds.map(function(id){var t=trips[id];
  return'<tr'+(t.late?' class="late-row"':'')+'><th scope="row"><a href="#track" data-id="'+id+'">'+id+'</a></th><td>'+t.route+'</td><td>'+t.veh.split(' · ')[0]+'</td><td><span class="'+(t.late?'badge late':'badge')+'">'+t.s+'</span></td><td>'+t.eta+'</td></tr>'}).join('');
$('#recentList').innerHTML=doneIds.map(function(id){var t=trips[id];
  return'<li><button type="button" data-id="'+id+'"><span class="rid">'+id+'</span><span class="rroute">'+t.route+'</span><span class="rtime">'+t.eta.replace('Arrived ','')+'</span></button></li>'}).join('');
function openTrip(id){input.value=id;track(id);out.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'})}
$('#liveBody').addEventListener('click',function(e){var a=e.target.closest('a[data-id]');if(a){input.value=a.dataset.id;track(a.dataset.id)}});
$('#recentList').addEventListener('click',function(e){var b=e.target.closest('button[data-id]');if(b)openTrip(b.dataset.id)});

/* Account page: ride history, track shortcuts, offer prefill */
function goTrack(id){input.value=id;track(id);$('#track').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}
$('#historyList').innerHTML=ids.filter(function(k){return trips[k].h}).map(function(id){var t=trips[id];
  return'<li><button type="button" data-id="'+id+'"><span class="rid">'+id+'</span><span class="rroute">'+t.route+'</span><span class="rtime">'+t.eta.replace('Arrived ','')+'</span></button></li>'}).join('');
$('#historyList').addEventListener('click',function(e){var b=e.target.closest('button[data-id]');if(b)goTrack(b.dataset.id)});
$$('[data-track]').forEach(function(b){b.addEventListener('click',function(){goTrack(b.dataset.track)})});
$$('[data-offer]').forEach(function(a){a.addEventListener('click',function(){$('#msg').value='I would like to claim: '+a.dataset.offer+'.'})});

/* Downloads: CSV, PDF (print), chart PNG */
var dlSt=$('#dlStatus');
function say(m){dlSt.textContent=m}
function save(blob,name){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function cell(v){v=String(v);return/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function line(a){return a.map(cell).join(',')}
var stamp=new Date().toISOString().slice(0,10);
$('#dlCsv').addEventListener('click',function(){
  var r=['OfficeRide fleet dashboard (sample data)','Generated,'+stamp,'','KPI,Value'];
  $$('.kpi').forEach(function(k){var v=k.querySelector('.v');r.push(line([k.querySelector('.l').textContent,(+v.dataset.count).toLocaleString('en-IN',{maximumFractionDigits:1})+(v.dataset.suf||'')]))});
  r.push('','Weekday,Trips completed,Trips delayed,Delay rate %');
  weekDays.forEach(function(d,i){r.push(line([d,weekOk[i],weekLate[i],(weekLate[i]/(weekOk[i]+weekLate[i])*100).toFixed(1)]))});
  r.push('','Live trip,Route,Vehicle,Status,ETA');
  liveIds.forEach(function(id){var t=trips[id];r.push(line([id,t.route,t.veh.split(' · ')[0],t.s,t.eta]))});
  save(new Blob(['\ufeff'+r.join('\r\n')],{type:'text/csv;charset=utf-8'}),'officeride-dashboard-'+stamp+'.csv');
  say('CSV downloaded. Open it in Excel or Numbers.');
});
$('#dlPdf').addEventListener('click',function(){say('In the print window, choose Save as PDF (on Mac: the PDF menu at the bottom left).');setTimeout(function(){window.print()},300)});
$('#dlPng').addEventListener('click',function(){
  try{
    var svg=$('#chart svg').cloneNode(true),W=760,H=300;
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width',W);svg.setAttribute('height',H);svg.setAttribute('font-family','Helvetica, Arial, sans-serif');
    var img=new Image();
    img.onload=function(){
      var s=2,pad=28,c=document.createElement('canvas');c.width=(W+pad*2)*s;c.height=(H+pad*2+90)*s;
      var x=c.getContext('2d');x.scale(s,s);x.fillStyle='#1d1d1f';x.fillRect(0,0,c.width,c.height);
      x.fillStyle='#f5f5f7';x.font='600 22px Helvetica, Arial, sans-serif';x.fillText('Trips completed vs delayed this week',pad,pad+16);
      x.drawImage(img,pad,pad+40,W,H);
      x.font='14px Helvetica, Arial, sans-serif';x.fillStyle='#2997ff';x.fillRect(pad,H+pad+68,10,10);x.fillStyle='#a1a1a6';x.fillText('Completed',pad+16,H+pad+78);
      x.fillStyle='#ff9f0a';x.fillRect(pad+110,H+pad+68,10,10);x.fillStyle='#a1a1a6';x.fillText('Delayed',pad+126,H+pad+78);x.fillText('OfficeRide, sample data',W-110,H+pad+78);
      c.toBlob(function(b){save(b,'officeride-weekly-trips-'+stamp+'.png');say('Chart image downloaded.')});
    };
    img.onerror=function(){say('Could not create the image. Use Save report as PDF instead.')};
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
  }catch(e){say('Could not create the image. Use Save report as PDF instead.')}
});

/* Plan finder: rule-based ranking of services with estimated monthly cost */
var PR={shuttle:2800,cab:4500,drop:180,exec:1200,prem:499},TRIPS=44;
function inr(n){return'₹'+Math.round(n).toLocaleString('en-IN')}
function recommend(i){
  var e=i.emp;
  function mk(key,name,base){return{key:key,name:name,s:base,why:[],cons:[]}}
  var sh=mk('shuttle','Shuttle Route',40),cb=mk('cab','Cab Pool',40),sd=mk('drop','Night-Shift Safe Drop',30),bk=mk('bulk','Bulk Contract',45);
  /* Shuttle */
  if(e>=20){sh.s+=15;sh.why.push('A group of '+e+' fills a 26-seat shuttle efficiently')}else if(e<10){sh.s-=25;sh.cons.push('A small group leaves a shuttle mostly empty')}
  if(i.spread==='conc'){sh.s+=25;sh.why.push('Most employees live in one or two areas, so fixed stops work')}else{sh.s-=20;sh.cons.push('Employees spread across the city mean longer detours')}
  if(i.prio==='cost'){sh.s+=20;sh.why.push('Lowest price per employee ('+inr(PR.shuttle)+' a month)')}else if(i.prio==='bal'){sh.s+=5}else{sh.s-=10;sh.cons.push('Shared stops give less flexible timing')}
  if(i.shift==='day'){sh.s+=10;sh.why.push('Fixed routes suit regular day shifts')}else if(i.shift==='night'){sh.s-=30;sh.cons.push('Night shifts need door-to-door safety')}else{sh.s-=5}
  /* Cab pool */
  if(i.spread==='wide'){cb.s+=25;cb.why.push('Door-to-door pickups suit employees spread across the city')}else{cb.s-=5}
  if(e<=50){cb.s+=10;cb.why.push('Works well for teams up to 50')}else if(e>150){cb.s-=20;cb.cons.push('Very large groups need many cabs')}
  if(i.prio==='comfort'){cb.s+=25;cb.why.push('Most comfortable option, with door-to-door travel')}else if(i.prio==='bal'){cb.s+=10}else{cb.s-=20;cb.cons.push('Highest price per employee ('+inr(PR.cab)+' a month)')}
  if(i.shift==='rot'){cb.s+=10;cb.why.push('Flexible when shifts keep changing')}
  /* Safe drop */
  if(i.shift==='night'){sd.s+=60;sd.why.push('Built for 8 PM to 6 AM travel, with GPS monitoring')}else if(i.shift==='rot'){sd.s+=15;sd.why.push('Covers the night part of rotating shifts')}else{sd.s-=45;sd.cons.push('Priced per trip, so costly for regular day commutes')}
  if(i.women){sd.s+=20;sd.why.push('Includes our escorted women-safety protocol')}
  if(i.prio==='comfort'){sd.s+=10}else if(i.prio==='cost'){sd.s-=10}
  /* Bulk contract */
  if(e>=100){bk.s+=15;bk.why.push('100+ employees qualify for a dedicated fleet and custom routes');if(i.shift==='rot'){bk.s+=10;bk.why.push('Custom rosters for mixed shifts')}if(i.prio!=='cost'){bk.s+=5}bk.why.push('Offer BULK10: 10% off if signed before 30 Nov 2026')}
  sh.cost=e*PR.shuttle;sh.fleet='about '+Math.ceil(e/26)+' shuttle'+(Math.ceil(e/26)>1?'s':'')+' (26 seats)';
  cb.cost=e*PR.cab;cb.fleet='about '+Math.ceil(e/4)+' cabs (4 seats)';
  sd.cost=e*TRIPS*PR.drop;sd.fleet='about '+Math.ceil(e/4)+' escorted cabs';
  var list=[sh,cb,sd];if(e>=100){bk.fleet='dedicated fleet sized to your rosters';list.push(bk)}
  list.forEach(function(o){o.pct=Math.max(5,Math.min(98,Math.round(o.s)))});
  return list.sort(function(a,b){return b.s-a.s});
}
var plForm=$('#planForm'),plOut=$('#planResult'),lastPlan=null,lastIn=null;
var L={shift:{day:'day shift',night:'night shift',rot:'rotational shifts'},spread:{conc:'concentrated in 1-2 areas',wide:'spread across the city'},prio:{cost:'lowest cost',bal:'balanced',comfort:'most comfort'}};
function costLine(o,e){return o.cost!=null?'≈ '+inr(o.cost)+' per month<small>'+inr(o.cost/e)+' per employee · '+o.fleet+(o.key==='drop'?' · assumes 22 days, 2 trips a day':'')+'</small>':'Custom quote<small>'+o.fleet+'</small>'}
plForm.addEventListener('submit',function(ev){
  ev.preventDefault();
  var e=parseInt($('#pl-emp').value,10);
  if(!(e>=1)){plOut.innerHTML='<p class="err">Enter how many employees need transport, for example 120.</p>';$('#pl-emp').focus();return}
  var ex=Math.max(0,parseInt($('#pl-exec').value,10)||0);
  var i={emp:e,shift:$('#pl-shift').value,spread:$('#pl-spread').value,prio:$('#pl-prio').value,women:$('#pl-women').checked,exec:ex};
  var r=recommend(i),best=r[0],alts=r.slice(1,3).filter(function(o){return o.s>=30});
  lastPlan=r;lastIn=i;
  function lis(a,n){return a.slice(0,n).map(function(x){return'<li>'+x+'</li>'}).join('')}
  var html='<div class="rec-best"><span class="badge">Best fit</span><h3>'+best.name+'</h3><div class="match"><strong>'+best.pct+'%</strong> match<div class="bar" aria-hidden="true"><i style="width:'+best.pct+'%"></i></div></div><p class="cost">'+costLine(best,e)+'</p><ul class="ticks">'+lis(best.why,3)+'</ul>'+(best.cons[0]?'<p class="trade">Trade-off: '+best.cons[0]+'</p>':'')+'<a class="btn light" href="#contact" data-pick="'+best.key+'">Request this quote</a></div>';
  if(alts.length){html+='<div class="alts">'+alts.map(function(o){return'<div class="rec-alt"><h3>'+o.name+'</h3><div class="match"><strong>'+o.pct+'%</strong> match<div class="bar" aria-hidden="true"><i style="width:'+o.pct+'%"></i></div></div><p>'+(o.cost!=null?'≈ '+inr(o.cost)+' per month':'Custom quote')+'</p><ul class="ticks">'+lis(o.why,2)+'</ul><a class="link" href="#contact" data-pick="'+o.key+'">Request this quote ›</a></div>'}).join('')+'</div>'}
  if(ex>0){html+='<div class="addon"><strong>Add Executive Transfer</strong>'+ex+' trips a month × '+inr(PR.exec)+' = '+inr(ex*PR.exec)+' per month</div>'}
  if(i.prio==='comfort'||i.women){html+='<div class="addon"><strong>Consider Premium</strong>+'+inr(PR.prem)+' per employee ('+inr(e*PR.prem)+' a month) adds a seat guarantee, 24×7 priority support and a free women-safety escort on night trips.</div>'}
  plOut.innerHTML=html;
  plOut.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
});
plOut.addEventListener('click',function(ev){
  var a=ev.target.closest('[data-pick]');if(!a||!lastPlan)return;
  var o=lastPlan.filter(function(x){return x.key===a.dataset.pick})[0],i=lastIn;
  $('#svc').value=o.name;$('#emp').value=i.emp;
  $('#msg').value='Plan finder result: '+o.name+' for '+i.emp+' employees ('+L.shift[i.shift]+', '+L.spread[i.spread]+', priority: '+L.prio[i.prio]+(i.women?', women-safety escort needed':'')+'). '+(o.cost!=null?'Estimated cost: '+inr(o.cost)+' per month.':'Please share a custom quote.');
});
})();
