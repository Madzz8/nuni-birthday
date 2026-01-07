// تشغيل المفاجأة يوم 8 بتوقيت السعودية (+03:00)
const TARGET_ISO_KSA = "2026-01-08T00:00:00+03:00";

const $ = (id) => document.getElementById(id);
const targetMs = Date.parse(TARGET_ISO_KSA);

function pad2(n){ return String(n).padStart(2, "0"); }

let birthdayShown = false;
let timer = null;

const card = $("card");
const title = $("title");
const subtitle = $("subtitle");

const micBtn = $("micBtn");
const micStatus = $("micStatus");

const celebrateLayer = $("celebrateLayer");
const heartsWrap = $("hearts");
const confettiWrap = $("confetti");

function setMicStatus(msg){
  if (micStatus) micStatus.textContent = msg;
}

function hideButtons(){
  const row = document.querySelector(".btnRow");
  if (row) row.classList.add("hidden");
}

function setBirthdayTexts(){
  // جملة أجمل لما يصير اليوم يوم ميلادها
  subtitle.textContent = "اليوم يومك يا نوني… وقلبي يحتفل فيك 💗✨";
}

function showBirthday(){
  if (birthdayShown) return;
  birthdayShown = true;

  if (timer){ clearInterval(timer); timer = null; }

  const cd = $("countdown");
  const bd = $("birthday");

  cd.classList.add("fade-out");
  setBirthdayTexts();

  setTimeout(() => {
    cd.classList.add("hidden");
    bd.classList.remove("hidden");
    bd.classList.add("fade-in");
  }, 500);
}

function updateCountdown(){
  const diff = targetMs - Date.now();
  if (diff <= 0){
    showBirthday();
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  $("d").textContent = days;
  $("h").textContent = pad2(hours);
  $("m").textContent = pad2(mins);
  $("s").textContent = pad2(secs);
}

timer = setInterval(updateCountdown, 250);
updateCountdown();

// زر تجربة المفاجأة
$("test").addEventListener("click", showBirthday);

// زر الإطفاء اليدوي
$("blow").addEventListener("click", () => {
  showBirthday();
  blowDoneParty();
});

// ===== احتفال خرافي بعد الإطفاء =====
let partyDone = false;

function blowDoneParty(){
  // امنع تكرار الاحتفال
  if (partyDone) return;
  partyDone = true;

  // اطفي الشعلة + الرسالة + اخفاء الأزرار
  $("flame").classList.add("out");
  $("msg").classList.remove("hidden");
  hideButtons();

  // نص لطيف بعد الإطفاء
  setMicStatus("يا سلام… يارب كل سنة وأنتي أجمل 💗");

  // فعّل طبقة الاحتفال
  celebrateLayer.classList.remove("hidden");
  celebrateLayer.setAttribute("aria-hidden", "false");

  // حركة للكرت والكيك
  card.classList.add("party");
  const cakeSvg = document.querySelector(".cakeSvg");
  if (cakeSvg) cakeSvg.classList.add("party");

  // قلوب + كونفيتي
  spawnHearts(26);
  spawnConfetti(60);

  // نظافة بعد وقت
  setTimeout(() => {
    celebrateLayer.classList.add("hidden");
    celebrateLayer.setAttribute("aria-hidden", "true");
    // امسح البقايا
    heartsWrap.innerHTML = "";
    confettiWrap.innerHTML = "";
  }, 4200);
}

function spawnHearts(count){
  heartsWrap.innerHTML = "";
  for (let i=0;i<count;i++){
    const h = document.createElement("div");
    h.className = "heartFloat";
    const x = Math.random() * 100;
    const dx = (Math.random() * 120 - 60).toFixed(0) + "px";
    const dur = (1.8 + Math.random() * 1.2).toFixed(2) + "s";

    h.style.setProperty("--x", x.toFixed(2) + "vw");
    h.style.setProperty("--dx", dx);
    h.style.setProperty("--dur", dur);

    // تنويع خفيف بالحجم
    const scale = 0.9 + Math.random() * 0.8;
    h.style.transform = `rotate(45deg) scale(${scale})`;

    heartsWrap.appendChild(h);

    // إزالة العنصر بعد نهاية الأنميشن
    setTimeout(() => h.remove(), (parseFloat(dur) * 1000) + 200);
  }
}

function spawnConfetti(count){
  confettiWrap.innerHTML = "";
  const colors = ["#ff4fa0","#ff9acc","#ffd24d","#ffffff","#ffc3df"];
  for (let i=0;i<count;i++){
    const c = document.createElement("div");
    c.className = "confettiPiece";

    const x = Math.random() * 100;
    const dur = (2.2 + Math.random() * 1.6).toFixed(2) + "s";
    const r = (Math.random() * 180).toFixed(0) + "deg";
    const col = colors[Math.floor(Math.random()*colors.length)];

    c.style.setProperty("--x", x.toFixed(2) + "vw");
    c.style.setProperty("--dur", dur);
    c.style.setProperty("--r", r);
    c.style.setProperty("--c", col);

    // تنويع بالحجم
    const w = 8 + Math.random() * 8;
    const h = 10 + Math.random() * 16;
    c.style.width = w.toFixed(0) + "px";
    c.style.height = h.toFixed(0) + "px";

    confettiWrap.appendChild(c);
    setTimeout(() => c.remove(), (parseFloat(dur) * 1000) + 300);
  }
}

// ===== Mic Blow Detection (سهل) =====
let blown = false;

async function startMicBlow(){
  showBirthday();
  if (blown) return;

  if (!window.isSecureContext){
    setMicStatus("افتحيها من GitHub Pages (https) عشان المايك يشتغل.");
    return;
  }

  try{
    setMicStatus("جهّزي نفخة قوية… 💨");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);

    // حساسية النفخ (أسهل)
    const THRESHOLD = 0.07;   // أقل = أسهل للنفخ
    const NOISE_GATE = 5.0;   // لو الكلام يطفّي بسرعة ارفعها (6.5)
    const HOLD_FRAMES = 4;
    const TIMEOUT = 9000;

    let hit = 0;
    const start = Date.now();

    micBtn.disabled = true;
    micBtn.textContent = "انفخي الآن… 💨";
    setMicStatus("انفخي باتجاه المايك 💗");

    const stopAll = () => {
      stream.getTracks().forEach(t => t.stop());
      ctx.close();
    };

    const loop = () => {
      analyser.getByteTimeDomainData(data);

      // RMS
      let sum = 0;
      for (let i=0;i<data.length;i++){
        const v = (data[i]-128)/128;
        sum += v*v;
      }
      const rms = Math.sqrt(sum / data.length);

      // noisiness
      let diffSum = 0;
      for (let i=1;i<data.length;i++){
        diffSum += Math.abs(data[i]-data[i-1]);
      }
      const noisiness = diffSum / data.length;

      const looksLikeBlow = (rms > THRESHOLD) && (noisiness > NOISE_GATE);

      if (looksLikeBlow) hit++;
      else hit = Math.max(0, hit-1);

      if (hit >= HOLD_FRAMES){
        blown = true;
        stopAll();
        micBtn.textContent = "يا سلام 🎀";
        setMicStatus("نفخة قوية! 🎉");
        blowDoneParty();
        return;
      }

      if (Date.now() - start > TIMEOUT){
        stopAll();
        micBtn.disabled = false;
        micBtn.textContent = "ما ضبط؟ جرّبي مرة ثانية 🎤";
        setMicStatus("قرّبي من المايك وانفخي 💗");
        return;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }catch(e){
    micBtn.disabled = false;
    micBtn.textContent = "انفخي الشمعة 🎤💨";
    setMicStatus("اسمحي بالمايك من إعدادات الموقع.");
    console.error(e);
  }
}

micBtn.addEventListener("click", startMicBlow);
