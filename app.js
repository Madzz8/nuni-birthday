// تشغيل المفاجأة يوم 8 بتوقيت السعودية (+03:00)
const TARGET_ISO_KSA = "2026-01-08T00:00:00+03:00";

const $ = (id) => document.getElementById(id);
const targetMs = Date.parse(TARGET_ISO_KSA);

function pad2(n){ return String(n).padStart(2, "0"); }

// حالة تمنع تكرار الانتقال
let birthdayShown = false;
let countdownTimer = null;

// رسالة بعد إطفاء الشمعة
function revealMessage(){
  $("flame").classList.add("out");
  $("msg").classList.remove("hidden");
}

// إظهار مشهد الكيكة مرة واحدة فقط
function showBirthday(){
  if (birthdayShown) return;
  birthdayShown = true;

  // وقف العداد عشان ما يعيد النداء
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  const cd = $("countdown");
  const bd = $("birthday");

  cd.classList.add("fade-out");

  // حدّث النص مرة واحدة
  $("subtitle").textContent = "اليوم يومك يا نوني 💗";

  setTimeout(() => {
    cd.classList.add("hidden");
    bd.classList.remove("hidden");
    bd.classList.add("fade-in");
  }, 500);
}

function updateCountdown(){
  const diff = targetMs - Date.now();

  if(diff <= 0){
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

// شغّل العداد
countdownTimer = setInterval(updateCountdown, 250);
updateCountdown();

// زر تجربة المفاجأة
$("test").addEventListener("click", showBirthday);

// زر الإطفاء اليدوي
$("blow").addEventListener("click", revealMessage);

// ===== Mic Blow Detection (with clear status) =====
const micBtn = $("micBtn");
const micStatus = $("micStatus");
let blown = false;

function setMicStatus(msg){
  if (micStatus) micStatus.textContent = msg;
}

async function startMicBlow(){
  // لازم تكون في مشهد الكيكة
  showBirthday();

  setMicStatus("جاري تجهيز المايك…");

  // تشخيص: لازم https أو localhost
  if (!window.isSecureContext) {
    setMicStatus("لازم تفتحي الصفحة عبر https (GitHub Pages) أو localhost.");
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setMicStatus("جهازك/المتصفح لا يدعم المايك هنا.");
    return;
  }

  if (blown) {
    setMicStatus("تم إطفاء الشمعة مسبقًا 🎀");
    return;
  }

  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    const THRESHOLD = 0.18;  // جرّب 0.15 لو ما يلقط النفخ
    const TIMEOUT = 7000;
    const start = Date.now();

    micBtn.textContent = "انفخي الآن… 💨";
    micBtn.disabled = true;
    setMicStatus("انفخي باتجاه المايك 💨");

    const stopAll = () => {
      stream.getTracks().forEach(t => t.stop());
      ctx.close();
    };

    const loop = () => {
      analyser.getByteTimeDomainData(data);

      let sum = 0;
      for(let i=0;i<data.length;i++){
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      if (rms > THRESHOLD){
        blown = true;
        stopAll();
        revealMessage();
        micBtn.textContent = "يا سلام 🎀";
        setMicStatus("انطفَت 🎉");
        return;
      }

      if (Date.now() - start > TIMEOUT){
        stopAll();
        micBtn.disabled = false;
        micBtn.textContent = "ما ضبط؟ جرّبي مرة ثانية 🎤";
        setMicStatus("ما التقطت نفخة قوية — جرّبي أقرب للمايك.");
        return;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }catch(e){
    micBtn.disabled = false;
    micBtn.textContent = "انفخي الشمعة 🎤💨";
    // رسالة مفهومة بدل “ولا شيء”
    setMicStatus("رفضتي إذن المايك أو ما اشتغل. افتحي إعدادات الموقع واسمحي بالمايك.");
    console.error(e);
  }
}

micBtn.addEventListener("click", startMicBlow);


async function startMicBlow(){
  // لازم تكون في مشهد الكيكة أولًا
  showBirthday();

  if(blown) return;

  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    const THRESHOLD = 0.12;   // أسهل للنفخ
    const TIMEOUT = 9000;     // وقت أطول شوي
    const HOLD_FRAMES = 10;   // لازم يتجاوز العتبة ~10 فريم (حوالي 0.16 ثانية)
    const start = Date.now();

    micBtn.textContent = "انفخي الآن… 💨";
    micBtn.disabled = true;

    const stopAll = () => {
      stream.getTracks().forEach(t => t.stop());
      ctx.close();
    };

    let hitFrames = 0;

    const loop = () => {
      analyser.getByteTimeDomainData(data);

      // RMS
      let sum = 0;
      for(let i=0;i<data.length;i++){
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      // مقياس بسيط للـ "ضجيج": فرق بين العينات (يتحسس للنفخ أكثر من الكلام)
      let diffSum = 0;
      for(let i=1;i<data.length;i++){
        diffSum += Math.abs(data[i] - data[i-1]);
      }
      const noisiness = diffSum / data.length; // كل ما زاد = ضجيج أكثر


      // نفخ غالبًا يعطي noisiness أعلى من الكلام، فخلّنا نطلب الاثنين
      const looksLikeBlow = (rms > THRESHOLD) && (noisiness > 6.5);

      if (looksLikeBlow){
        hitFrames++;
      } else {
        hitFrames = Math.max(0, hitFrames - 1);
      }

      if (hitFrames >= HOLD_FRAMES){
        blown = true;
        stopAll();
        revealMessage();
        micBtn.textContent = "يا سلام 🎀";
        setMicStatus("نفخة قوية! انطفَت 🎉");
        return;
      }


      if(Date.now() - start > TIMEOUT){
        stopAll();
        micBtn.disabled = false;
        micBtn.textContent = "ما ضبط؟ جرّبي مرة ثانية 🎤";
        return;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }catch(e){
    micBtn.disabled = false;
    micBtn.textContent = "المايك مقفول — استخدمي زر 💨";
  }
}

micBtn.addEventListener("click", startMicBlow);
