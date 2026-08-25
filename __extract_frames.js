const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = 'C:/Users/hp/AppData/Local/Temp/claude/d----atraslink-landing-updated-atraslink-landing/a81c2d81-9d2e-4648-b808-57b62aed99c1/scratchpad/uframes';
fs.mkdirSync(OUT, { recursive: true });

const videoPath = 'C:/Users/hp/AppData/Local/Temp/claude/d----atraslink-landing-updated-atraslink-landing/a81c2d81-9d2e-4648-b808-57b62aed99c1/scratchpad/rec.mp4';
const videoUrl = 'file:///' + videoPath.replace(/ /g, '%20');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(`<video id="v" src="${videoUrl}" muted playsinline></video>`);
  await page.waitForFunction(() => {
    const v = document.getElementById('v');
    return v.readyState >= 1 && !isNaN(v.duration);
  }, { timeout: 15000 });

  const duration = await page.evaluate(() => document.getElementById('v').duration);
  const dims = await page.evaluate(() => {
    const v = document.getElementById('v');
    return { w: v.videoWidth, h: v.videoHeight };
  });
  console.log('duration', duration, 'dims', dims);

  const stepCount = 60;
  for (let i = 0; i <= stepCount; i++) {
    const t = (duration * i) / stepCount;
    const dataUrl = await page.evaluate(async (t) => {
      const v = document.getElementById('v');
      await new Promise((resolve) => {
        const onSeeked = () => { v.removeEventListener('seeked', onSeeked); resolve(); };
        v.addEventListener('seeked', onSeeked);
        v.currentTime = t;
      });
      const canvas = document.createElement('canvas');
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(v, 0, 0);
      return canvas.toDataURL('image/png');
    }, t);
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(path.join(OUT, `t-${String(i).padStart(3, '0')}-${t.toFixed(2)}s.png`), base64, 'base64');
  }

  await browser.close();
  console.log('done');
})();
