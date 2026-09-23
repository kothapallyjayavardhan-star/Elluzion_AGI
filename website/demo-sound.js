// Synthesized locally: no audio downloads, microphone access or background music.
const toggle=document.querySelector('#demo-sound');
let enabled=false,context;
function tone(frequency,start,duration,volume){
  const oscillator=context.createOscillator(),gain=context.createGain();
  oscillator.type='sine';oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  oscillator.connect(gain);gain.connect(context.destination);
  oscillator.start(start);oscillator.stop(start+duration+.02);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};
}
async function play(kind){
  if(!enabled||document.hidden)return;
  try{
    if(context.state==='suspended')await context.resume();
    if(!enabled||document.hidden)return;
    const now=context.currentTime;
    tone(kind==='complete'?523:440,now,.16,.035);
    tone(kind==='complete'?784:659,now+.065,.23,.022);
  }catch{enabled=false;update()}
}
function update(){toggle.setAttribute('aria-pressed',String(enabled));toggle.innerHTML=`Sound ${enabled?'on':'off'} <span aria-hidden="true">♪</span>`}
toggle.addEventListener('click',()=>{
  const AudioEngine=window.AudioContext||window.webkitAudioContext;
  if(!AudioEngine){toggle.textContent='Sound unavailable';toggle.disabled=true;return}
  context??=new AudioEngine();enabled=!enabled;update();
  if(enabled)play('step');else context.suspend().catch(()=>{});
});
document.querySelector('#sales-demo').addEventListener('click',event=>{
  if(event.target.closest('[data-step],[data-next]')){
    const step=document.querySelector('.simulation-steps [aria-current]');
    play(step?.dataset.step==='4'?'complete':'step');
  }
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&context)context.suspend().catch(()=>{})});
