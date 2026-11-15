const DEFAULT_QUOTES = [
  "再滑 5 分鐘，你的專注力就要離家出走了 👀",
  "真的要現在打開抖音嗎？先喝口水再決定！",
  "同學，作業／進度在背後看著你喔 🫣"
];

const STEPS = [
  {
    id: 1,
    title: "步驟 1：建立個人自動化",
    items: [
      "打開 iPhone 內建的<strong>「捷徑」App</strong>，點選底部的<strong>「自動化」</strong>。",
      "點右上角 <code>+</code> → 選擇<strong>「App」</strong>。",
      "點「選擇」勾選<strong>抖音（或 TikTok）</strong>，只勾選<strong>「開啟時」</strong>。",
      "選擇<strong>「立即執行」</strong>（建議關閉「執行時通知」），再選「新增空白自動化操作」。"
    ],
    tip: "不需要「螢幕使用時間」密碼，也不需要家長驗證，完全在自己手機本機運作。",
    simTitle: "捷徑自動化觸發條件",
    simBlocks: [
      "當「抖音」開啟時",
      "執行方式：立即執行（關閉通知）"
    ]
  },
  {
    id: 2,
    title: "步驟 2：加入隨機勸退語錄",
    items: [
      "搜尋並加入動作<strong>「列表」</strong>，貼上你在下方客製化好的溫柔提醒語。",
      "再加入<strong>「從列表取得項目」</strong>，將預設的「第一個項目」點一下改為<strong>「隨機項目」</strong>。"
    ],
    tip: "隨機語錄能讓每次提醒都不一樣，比較不會看膩而直接忽略。",
    simTitle: "動作 1 & 2：隨機語錄",
    simBlocks: [
      "列表：[3 句溫柔提醒語]",
      "從「列表」取得「隨機項目」"
    ]
  },
  {
    id: 3,
    title: "步驟 3：加入 3 秒柔和緩衝",
    items: [
      "搜尋並加入動作<strong>「等待」</strong>。",
      "將時間設為<strong>「3 秒」</strong>（也可以依照喜好調整為 2～5 秒）。"
    ],
    tip: "這 3 秒是為了中斷「無意識點開 App」的反射動作，不會讓人覺得卡死。",
    simTitle: "動作 3：柔和停頓",
    simBlocks: [
      "等待 3 秒"
    ]
  },
  {
    id: 4,
    title: "步驟 4：建立安全可退出的選單",
    items: [
      "搜尋並加入<strong>「從選單選擇」</strong>，把提示文字點選為上方變數<strong>「項目」</strong>。",
      "選項一改名為<strong>「好啦，先不滑了（回主畫面）」</strong>，並在它底下加入動作<strong>「前往主畫面」</strong>。",
      "選項二改名為<strong>「我就看這一次（放行）」</strong>，底下<strong>不放任何動作</strong>，點右上角「完成」。"
    ],
    tip: "選「放行」就能直接留在抖音，不會造成無限循環彈窗。",
    simTitle: "動作 4：柔和二選一",
    simBlocks: [
      "從選單選擇（提示：項目）",
      "├ 好啦，先不滑了 → 前往主畫面",
      "└ 我就看這一次 → （無動作，直接放行）"
    ]
  },
  {
    id: 5,
    title: "步驟 5：如何隨時安全關閉",
    items: [
      "如果想暫時停用或徹底移除，打開<strong>「捷徑」→「自動化」</strong>。",
      "點進該項目，將<strong>「啟用此自動化」</strong>切換為關閉即可。",
      "或直接在列表上<strong>左滑刪除</strong>，完全不留任何系統設定殘留。"
    ],
    tip: "隨時可開、隨時可關，這才是最健康的自律工具。",
    simTitle: "一鍵安全解除",
    simBlocks: [
      "捷徑 > 自動化 > 抖音開啟時",
      "啟用此自動化：[ 開 / 關 ]"
    ]
  }
];

let currentStep = 1;
let quotes = [...DEFAULT_QUOTES];
let simMode = "guide"; // "guide" | "home" | "waiting" | "menu" | "allowed"
let waitTimer = null;

function pickRandomQuote(list) {
  if (!list.length) return "先深呼吸 3 秒，再決定要不要滑吧！";
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderStep() {
  const step = STEPS.find((s) => s.id === currentStep);
  if (!step) return;

  document.getElementById("step-counter").textContent = `步驟 ${currentStep} / ${STEPS.length}`;
  const pct = (currentStep / STEPS.length) * 100;
  document.getElementById("progress-fill").style.width = `${pct}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", String(currentStep));

  document.querySelectorAll(".step-tab").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.step) === currentStep);
  });

  document.getElementById("btn-prev").disabled = currentStep === 1;
  document.getElementById("btn-next").disabled = currentStep === STEPS.length;

  const listItems = step.items.map((item) => `<li>${item}</li>`).join("");
  document.getElementById("step-content").innerHTML = `
    <h2>${step.title}</h2>
    <ol>${listItems}</ol>
    <div class="step-tip">💡 ${step.tip}</div>
  `;

  if (simMode === "guide") {
    renderSimulator();
  }
}

function renderQuotes() {
  const listEl = document.getElementById("quote-list");
  listEl.innerHTML = quotes
    .map(
      (q, index) => `
      <li class="quote-item">
        <span>${escapeHtml(q)}</span>
        <button class="quote-remove" type="button" data-index="${index}" aria-label="刪除此語錄">刪除</button>
      </li>
    `
    )
    .join("");
}

function renderSimulator() {
  const viewport = document.getElementById("iphone-viewport");

  if (simMode === "guide") {
    const step = STEPS.find((s) => s.id === currentStep);
    const blocks = step.simBlocks.map((b) => `<div class="shortcut-block">${escapeHtml(b)}</div>`).join("");
    viewport.innerHTML = `
      <div class="shortcut-card">
        <h4>📱 ${escapeHtml(step.simTitle)}</h4>
        ${blocks}
      </div>
      <div class="sim-hint-box">
        想實際體驗被攔截的感覺嗎？<br />
        <button id="btn-sim-home-inline" class="btn btn-small btn-primary" type="button" style="margin-top:8px;">
          切換到模擬桌面試玩
        </button>
      </div>
    `;
    document.getElementById("btn-sim-home-inline").addEventListener("click", () => {
      setSimMode("home");
    });
    return;
  }

  if (simMode === "home") {
    viewport.innerHTML = `
      <div class="ios-app-grid">
        <button id="btn-open-douyin" class="ios-app-icon" type="button">
          <span class="ios-icon-box icon-douyin">🎵</span>
          <span class="ios-app-name">抖音</span>
        </button>
        <div class="ios-app-icon">
          <span class="ios-icon-box icon-shortcuts">⚡</span>
          <span class="ios-app-name">捷徑</span>
        </div>
        <div class="ios-app-icon">
          <span class="ios-icon-box icon-notes">📝</span>
          <span class="ios-app-name">備忘錄</span>
        </div>
      </div>
      <div class="sim-hint-box">點擊左上角「抖音」圖示，體驗柔和勸退效果。</div>
    `;
    document.getElementById("btn-open-douyin").addEventListener("click", startDouyinDemo);
    return;
  }

  if (simMode === "waiting") {
    viewport.innerHTML = `
      <div class="sim-waiting">
        <div class="spinner"></div>
        <p style="margin:0;font-weight:600;">柔和緩衝中...</p>
        <p style="margin:6px 0 0;font-size:0.82rem;color:#94a3b8;">捷徑等待 3 秒後顯示提醒</p>
      </div>
    `;
    return;
  }

  if (simMode === "menu") {
    const msg = pickRandomQuote(quotes);
    viewport.innerHTML = `
      <div class="ios-alert-overlay">
        <div class="ios-alert-box" role="dialog" aria-label="柔和勸退選單">
          <div class="ios-alert-body">
            <div class="ios-alert-title">捷徑提醒</div>
            <div class="ios-alert-msg">${escapeHtml(msg)}</div>
          </div>
          <button id="btn-sim-exit" class="ios-alert-btn btn-exit" type="button">好啦，先不滑了（回主畫面）</button>
          <button id="btn-sim-allow" class="ios-alert-btn" type="button">我就看這一次（放行）</button>
        </div>
      </div>
    `;
    document.getElementById("btn-sim-exit").addEventListener("click", () => setSimMode("home"));
    document.getElementById("btn-sim-allow").addEventListener("click", () => setSimMode("allowed"));
    return;
  }

  if (simMode === "allowed") {
    viewport.innerHTML = `
      <div class="sim-douyin-feed">
        <div style="font-size:2rem;margin-bottom:8px;">🎵</div>
        <p style="margin:0 0 8px;font-weight:700;">已安全放行進入抖音</p>
        <p style="margin:0 0 14px;font-size:0.82rem;color:#94a3b8;">不會重複彈窗鎖死，可正常使用。</p>
        <button id="btn-sim-back-home" class="btn btn-small btn-secondary" type="button">關閉 App 回桌面</button>
      </div>
    `;
    document.getElementById("btn-sim-back-home").addEventListener("click", () => setSimMode("home"));
  }
}

function setSimMode(mode) {
  if (waitTimer) {
    clearTimeout(waitTimer);
    waitTimer = null;
  }
  simMode = mode;
  renderSimulator();
}

function startDouyinDemo() {
  setSimMode("waiting");
  waitTimer = setTimeout(() => {
    simMode = "menu";
    renderSimulator();
  }, 1500); // 模擬體驗用 1.5 秒代表 3 秒等待，節奏更流暢
}

function initEvents() {
  document.querySelectorAll(".step-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStep = Number(btn.dataset.step);
      simMode = "guide";
      renderStep();
    });
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep -= 1;
      simMode = "guide";
      renderStep();
    }
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    if (currentStep < STEPS.length) {
      currentStep += 1;
      simMode = "guide";
      renderStep();
    }
  });

  document.getElementById("btn-try-demo").addEventListener("click", () => {
    setSimMode("home");
    document.querySelector(".simulator-panel").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("btn-reset-sim").addEventListener("click", () => {
    setSimMode("home");
  });

  document.getElementById("quote-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("quote-remove")) {
      const idx = Number(e.target.dataset.index);
      quotes.splice(idx, 1);
      renderQuotes();
    }
  });

  document.getElementById("quote-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("quote-input");
    const val = input.value.trim();
    if (val) {
      quotes.push(val);
      input.value = "";
      renderQuotes();
    }
  });

  document.getElementById("btn-copy-quotes").addEventListener("click", async () => {
    const toast = document.getElementById("copy-toast");
    const text = quotes.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.textContent = "已複製全部語錄！可直接貼入捷徑列表。";
    } catch {
      toast.textContent = "瀏覽器不允許自動複製，請手動選取文字複製。";
    }
    setTimeout(() => {
      toast.textContent = "";
    }, 2500);
  });
}

if (typeof document !== "undefined") {
  renderStep();
  renderQuotes();
  initEvents();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DEFAULT_QUOTES, STEPS, pickRandomQuote, escapeHtml };
}
