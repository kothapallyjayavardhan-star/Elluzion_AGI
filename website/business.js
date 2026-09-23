import { connectionReady, saveInquiry } from './supabase-inquiries.js';
const inquiry=document.querySelector('#inquiry');
const connected=connectionReady();
const submit=inquiry.querySelector('[type="submit"]');
const result=document.querySelector('#inquiry-result');
const status=result.querySelector('[role="status"]');
const area=document.querySelector('#inquiry-text');
const copy=document.querySelector('#copy-inquiry');
let busy=false, fingerprint='', submissionId='';
if(connected){submit.textContent='Send inquiry ↗';inquiry.querySelector('.form-note').innerHTML='Submitting sends these details to Elluzion AI to respond to your inquiry. <a href="legal.html#privacy">Privacy information</a>';document.querySelector('.preview-notice').innerHTML='Pilot and brand inquiries: <a href="mailto:jayavardhan@elluzionai.com">jayavardhan@elluzionai.com</a>. Send your details using the form below.';}
document.querySelectorAll('[data-intent]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#track').value=link.dataset.intent}));
inquiry.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  const data=new FormData(inquiry);
  const body=`Elluzion AI — ${data.get('track')} inquiry\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nBusiness: ${data.get('business')}\n\n${data.get('message')}`;
  if(!connected){area.value=body+'\n\nPrepared locally. Not sent.';result.hidden=false;status.textContent='Email draft prepared. Send it in your email app, or copy it below. This website has not sent your inquiry.';area.focus();location.href='mailto:jayavardhan@elluzionai.com?subject='+encodeURIComponent('Elluzion AI — '+data.get('track')+' inquiry')+'&body='+encodeURIComponent(area.value);return;}
  const fields={track:data.get('track'),full_name:data.get('name'),email:data.get('email'),business:data.get('business'),message:data.get('message')};
  const nextFingerprint=JSON.stringify(fields);if(nextFingerprint!==fingerprint){fingerprint=nextFingerprint;submissionId=crypto.randomUUID();}
  busy=true;submit.disabled=true;submit.textContent='Sending…';inquiry.setAttribute('aria-busy','true');result.hidden=false;area.hidden=true;copy.hidden=true;status.textContent='Sending your inquiry…';
  try {await saveInquiry({id:submissionId,...fields});status.textContent='Thank you. Your inquiry has been received by Elluzion AI.';inquiry.reset();fingerprint='';submissionId='';}
  catch(error){status.textContent=error.message;}
  finally{busy=false;submit.disabled=false;submit.textContent='Send inquiry ↗';inquiry.removeAttribute('aria-busy');}
});
copy.addEventListener('click',async event=>{try{await navigator.clipboard.writeText(area.value);event.target.textContent='Copied'}catch{area.focus();area.select();event.target.textContent='Select and copy the text above'}});


