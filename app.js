// ===== إعداد وقت 12:00 يوم 8 بتوقيت السعودية =====
const TARGET_ISO_KSA = new Date(Date.now() + 0 * 60 * 1000).toISOString();

const targetMs = Date.parse(TARGET_ISO_KSA);

const $ = (id) => document.getElementById(id);
function pad2(n){ return String(n).padStart(2, "0"); }

let birthdayShown = false;
let timer = null;

// عناصر
const subtitle = $("subtitle");
const testBtn = $("test");
const overlay = $("focusOverlay");
const celebrateLayer = $("celebrateLayer");
const heartsWrap = $("hearts");
const confettiWrap = $("confetti");
const micBtn = $("micBtn");
const blowBtn = $("blow");
const btnRow = $("btnRow");
const micStatus = $("micStatus");

// لمنع تكرار احتفال الإطفاء
let partyDone = false;

// ===== الانتقال لمشهد الميلاد =====
function setBirthdayTexts(){
  subtitle.textContent = "اليوم يومك… وقلبي يحتفل فيك 💗✨";
}

function showBirthday(){
  if (birthdayShown) return;
  birthdayShown = true;

  if (timer){
    clearInterval(timer);
    timer = null;
  }

  // نخفي زر التجربة بمجرد الدخول للمشهد
  testBtn.classList.add("hidden");

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

// ===== العداد + إظهار زر التجربة فقط بعد الساعة 12 =====
function updateCountdown(){
  const now = Date.now();
  const diff = targetMs - now;

  // إذا دخلنا يوم 8 (12:00) — نقدر نظهر زر التجربة
  // لكن بمجرد ما نبدأ مشهد الميلاد، بنخفيه
  if (diff <= 0){
    testBtn.classList.add("hidden");
    showBirthday();
    return;
  }

  // قبل الهدف: الزر مخفي
  testBtn.classList.add("hidden");

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

// زر التجربة (إذا تبي تستخدمه لاختبارك لاحقاً)
testBtn.addEventListener("click", showBirthday);

// ===== إخفاء الأزرار بشكل مضمون 100% =====
function hideActionButtonsHard(){
  if (btnRow) btnRow.classList.add("hidden");

  if (micBtn){
    micBtn.disabled = true;
    micBtn.classList.add("hidden");
  }
  if (blowBtn){
    blowBtn.disabled = true;
    blowBtn.classList.add("hidden");
  }
}

// ===== قلوب + كونفيتي + إيموجيز =====
function spawnHearts(count){
  heartsWrap.innerHTML = "";
  for (let i=0;i<count;i++){
    const h = document.createElement("div");
    h.className = "heartFloat";
    const x = Math.random() * 100;
    const dx = (Math.random() * 140 - 70).toFixed(0) + "px";
    const dur = (1.8 + Math.random() * 1.3).toFixed(2) + "s";
    h.style.setProperty("--x", x.toFixed(2) + "vw");
    h.style.setProperty("--dx", dx);
    h.style.setProperty("--dur", dur);
    heartsWrap.appendChild(h);
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
    const dur = (2.2 + Math.random() * 1.8).toFixed(2) + "s";
    const r = (Math.random() * 180).toFixed(0) + "deg";
    const col = colors[Math.floor(Math.random()*colors.length)];

    c.style.setProperty("--x", x.toFixed(2) + "vw");
    c.style.setProperty("--dur", dur);
    c.style.setProperty("--r", r);
    c.style.setProperty("--c", col);

    // تنويع الحجم
    const w = 8 + Math.random() * 8;
    const h = 10 + Math.random() * 16;
    c.style.width = w.toFixed(0) + "px";
    c.style.height = h.toFixed(0) + "px";

    confettiWrap.appendChild(c);
    setTimeout(() => c.remove(), (parseFloat(dur) * 1000) + 400);
  }
}

function runEmojiBurst(){
  const layer = document.createElement("div");
  layer.className = "emojiBurst";
  document.body.appendChild(layer);

  const emojis = ["💗","🎀","🐰","🐇","🌸","✨","🩷","🎉"];
  const count = 28;

  for(let i=0;i<count;i++){
    const e = document.createElement("div");
    e.className = "emoji";
    e.textContent = emojis[Math.floor(Math.random()*emojis.length)];

    const x = (Math.random()*100).toFixed(2) + "vw";
    const y = (22 + Math.random()*50).toFixed(2) + "vh";
    const size = (22 + Math.random()*18).toFixed(0) + "px";
    const dx = (Math.random()*260 - 130).toFixed(0) + "px";
    const dy = (-(220 + Math.random()*280)).toFixed(0) + "px";
    const rot = (Math.random()*260 - 130).toFixed(0) + "deg";
    const dur = (1.2 + Math.random()*0.9).toFixed(2) + "s";

    e.style.setProperty("--x", x);
    e.style.setProperty("--y", y);
    e.style.setProperty("--size", size);
    e.style.setProperty("--dx", dx);
    e.style.setProperty("--dy", dy);
    e.style.setProperty("--rot", rot);
    e.style.setProperty("--dur", dur);

    layer.appendChild(e);
  }

  setTimeout(() => layer.remove(), 2600);
}

// ===== التسلسل السينمائي بعد النفخ =====
function setMicStatus(msg){
  if (micStatus) micStatus.textContent = msg;
}

function blowDoneParty(){
  if (partyDone) return;
  partyDone = true;

  // 0) اخفاء الأزرار فوراً (مضمون)
  hideActionButtonsHard();

  // 1) تغميق الأطراف للتركيز
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => overlay.classList.add("on"));

  // 2) تكبير الكيكة (Pop)
  const cake = document.querySelector(".cakeSvg");
  if (cake) cake.classList.add("pop");

  // 3) اطفي الشعلة بعد لحظة
  setMicStatus("لحظة… ✨");
  setTimeout(() => {
    $("flame").classList.add("out");
  }, 520);

  // 4) احتفال + ايموجيز
  setTimeout(() => {
    celebrateLayer.classList.remove("hidden");
    celebrateLayer.setAttribute("aria-hidden", "false");

    setMicStatus("🎀🎉🎉🎀");
    spawnHearts(26);
    spawnConfetti(70);
    runEmojiBurst();

    // 5) بعد الاحتفال: تطلع الرسالة
    setTimeout(() => {
      const msg = $("msg");
      msg.classList.remove("hidden");
      msg.classList.add("reveal");

      // نخفف التغميق بعد ما تقرأ
      setTimeout(() => {
        overlay.classList.remove("on");
        setTimeout(() => overlay.classList.add("hidden"), 450);

        // نخلي الاحتفال يختفي بعد شوي (اختياري)
        setTimeout(() => {
          celebrateLayer.classList.add("hidden");
          celebrateLayer.setAttribute("aria-hidden", "true");
          heartsWrap.innerHTML = "";
          confettiWrap.innerHTML = "";
        }, 600);

      }, 2600);
    }, 1200);
  }, 980);
}

// زر “طفيتها”
blowBtn.addEventListener("click", () => {
  showBirthday();
  blowDoneParty();
});

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

    // حساسية النفخ
    const THRESHOLD = 0.07;
    const NOISE_GATE = 5.0;   // لو الكلام يطفّي بسرعة ارفعها 6.5
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
