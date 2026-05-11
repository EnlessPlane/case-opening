const cases = [
  {
    id: "horizon",
    name: "Horizon Case",
    description: "Moderní case s futuristickými skiny, jasnými neonovými prvky a ostrými hranami.",
    themeColor: "#3e8cff",
    items: [
      { name: "M4A4 | The Emperor", rarity: "Covert", weight: 0.6, skinClass: "covert", icon: "🔫" },
      { name: "AK-47 | The Empress", rarity: "Covert", weight: 0.6, skinClass: "covert", icon: "🔫" },
      { name: "AWP | Wildfire", rarity: "Classified", weight: 3.4, skinClass: "classified", icon: "🎯" },
      { name: "Desert Eagle | Mecha Industries", rarity: "Classified", weight: 3.4, skinClass: "classified", icon: "💥" },
      { name: "MAC-10 | Neon Rider", rarity: "Restricted", weight: 15, skinClass: "restricted", icon: "⚡" },
      { name: "Glock-18 | Moonrise", rarity: "Restricted", weight: 15, skinClass: "restricted", icon: "🌙" },
      { name: "MP9 | Goo", rarity: "Mil-Spec", weight: 40, skinClass: "milspec", icon: "🧪" },
      { name: "P250 | Contamination", rarity: "Mil-Spec", weight: 40, skinClass: "milspec", icon: "☣️" }
    ]
  },
  {
    id: "prisma",
    name: "Prisma Case",
    description: "Klasická sbírka specialit s pestrými designy a mnoha vizuálně odlišnými skiny.",
    themeColor: "#c15cff",
    items: [
      { name: "USP-S | Printstream", rarity: "Covert", weight: 0.5, skinClass: "covert", icon: "🔵" },
      { name: "AK-47 | Aquamarine Revenge", rarity: "Covert", weight: 0.5, skinClass: "covert", icon: "🌊" },
      { name: "AWP | Asiimov", rarity: "Classified", weight: 3.8, skinClass: "classified", icon: "🚀" },
      { name: "Nova | Wood Fired", rarity: "Classified", weight: 3.8, skinClass: "classified", icon: "🔥" },
      { name: "P2000 | Imperial Dragon", rarity: "Restricted", weight: 15, skinClass: "restricted", icon: "🐉" },
      { name: "MAC-10 | Neon Rider", rarity: "Restricted", weight: 15, skinClass: "restricted", icon: "⚡" },
      { name: "P90 | Shapewood", rarity: "Mil-Spec", weight: 40, skinClass: "milspec", icon: "🌲" }
    ]
  },
  {
    id: "breakout",
    name: "Breakout Case",
    description: "Tradiční case s vyváženými šancemi a několika legendárními skiny.",
    themeColor: "#d1763f",
    items: [
      { name: "M4A1-S | Cyrex", rarity: "Covert", weight: 0.6, skinClass: "covert", icon: "⚙️" },
      { name: "AWP | Asiimov", rarity: "Covert", weight: 0.6, skinClass: "covert", icon: "🚀" },
      { name: "Desert Eagle | Blaze", rarity: "Classified", weight: 3.5, skinClass: "classified", icon: "🔥" },
      { name: "Glock-18 | Weasel", rarity: "Classified", weight: 3.5, skinClass: "classified", icon: "🪳" },
      { name: "USP-S | Kill Confirmed", rarity: "Restricted", weight: 15, skinClass: "restricted", icon: "🧨" },
      { name: "P250 | See Ya Later", rarity: "Restricted", weight: 15, skinClass: "restricted", icon: "👋" },
      { name: "MP9 | Rose Iron", rarity: "Mil-Spec", weight: 40, skinClass: "milspec", icon: "🌹" }
    ]
  }
];

const rarityColors = {
  "Rare Special": "#d4af37",
  Covert: "#b9523d",
  Classified: "#5639a9",
  Restricted: "#4a7cbe",
  "Mil-Spec": "#76b852"
};

let selectedCaseIndex = 0;
let lastOpenedItem = null;
let isOpening = false;

function getTotalWeight(items) {
  return items.reduce((sum, item) => sum + item.weight, 0);
}

function weightedRandom(items) {
  const total = getTotalWeight(items);
  let random = Math.random() * total;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }
  return items[items.length - 1];
}

function randomFloat(min = 0.0, max = 1.0) {
  return min + Math.random() * (max - min);
}

function floatToWear(floatValue) {
  if (floatValue <= 0.07) return "Factory New";
  if (floatValue <= 0.15) return "Minimal Wear";
  if (floatValue <= 0.38) return "Field-Tested";
  if (floatValue <= 0.45) return "Well-Worn";
  return "Battle-Scarred";
}
function randomStatTrak() {
  return Math.random() < 0.12;
}

function getRarityBadge(rarity) {
  return `<span class="item-rarity" style="color: ${rarityColors[rarity] || '#fff'};">${rarity}</span>`;
}

function formatChance(item, items) {
  const total = getTotalWeight(items);
  return ((item.weight / total) * 100).toFixed(2);
}

function formatResult(item) {
  const color = rarityColors[item.rarity] || "#ffffff";
  const statTrakLabel = item.stattrak ? "Ano" : "Ne";
  return `
    <div class="result-card" style="border-color: ${color};">
      <div style="display: grid; gap: 14px;">
        <div class="result-icon" style="color: ${color};">${item.icon}</div>
        <div style="font-size: 1.1rem; font-weight: 700; color: ${color};">${item.rarity}</div>
        <div style="font-size: 1.6rem; font-weight: 700;">${item.name}</div>
        <div style="display: grid; gap: 8px; color: #d0d9f3;">
          <div>Case: <strong>${item.caseName}</strong></div>
          <div>Float: <strong>${item.float.toFixed(4)}</strong> (${item.wear})</div>
          <div>StatTrak: <strong>${statTrakLabel}</strong></div>
          <div>Šance v case: <strong>${item.chance}%</strong></div>
        </div>
      </div>
    </div>
  `;
}

function renderCaseButtons() {
  const caseList = document.getElementById("case-list");
  if (!caseList) return;
  caseList.innerHTML = cases
    .map((caseData, index) => {
      const selectedClass = index === selectedCaseIndex ? "selected" : "";
      return `
        <button class="case-button ${selectedClass}" data-case-index="${index}">
          <span>${caseData.name}</span>
          <small style="opacity:.75;">${caseData.items.length} itemů</small>
        </button>
      `;
    })
    .join("");

  caseList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.caseIndex);
      selectCase(index);
    });
  });
}

function renderSelectedCase() {
  const selected = cases[selectedCaseIndex];
  const caseName = document.getElementById("selected-case-name");
  const caseDesc = document.getElementById("selected-case-desc");
  const caseItemsCount = document.getElementById("selected-case-items");
  const caseBest = document.getElementById("selected-case-best");
  const caseFace = document.getElementById("case-face");
  const caseMeta = document.getElementById("selected-case-meta");
  const list = document.getElementById("case-item-list");

  if (caseName) caseName.textContent = selected.name;
  if (caseDesc) caseDesc.textContent = selected.description;
  if (caseItemsCount) caseItemsCount.textContent = selected.items.length;
  if (caseBest) caseBest.textContent = [...new Set(selected.items.map((item) => item.rarity))]
    .filter((rarity) => rarity !== "Mil-Spec")
    .slice(0, 3)
    .join(", ");
  if (caseFace) {
    caseFace.textContent = selected.name.replace(" Case", "");
    caseFace.style.background = `linear-gradient(135deg, ${selected.themeColor} 0%, rgba(255,255,255,0.16) 100%)`;
  }
  if (caseMeta) caseMeta.innerHTML = `<div>Vybraná case: <strong>${selected.name}</strong></div><div>Rarity: ${getRarityBadge(selected.items[0].rarity)} ...</div>`;

  if (list) {
    list.innerHTML = `
      <h3>Obsah case</h3>
      <div class="item-list">
        ${selected.items
          .map(
            (item, idx) => `
            <div class="item-row" style="--item-index: ${idx};">
              <span class="item-icon">${item.icon}</span>
              <div class="item-name ${item.skinClass.toLowerCase().replace(/\s+/g, "-")}">${item.name}</div>
              <div class="item-rarity">${item.rarity}</div>
              <div>${formatChance(item, selected.items)}%</div>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  renderCaseButtons();
  animateSelectedCaseVisuals();
}

function animateSelectedCaseVisuals() {
  const box = document.getElementById("case-box");
  const list = document.querySelector(".case-item-list");
  if (box) {
    box.classList.remove("opened");
    box.classList.add("animate", "active");
    setTimeout(() => {
      box.classList.remove("animate");
    }, 900);
  }
  if (list) {
    list.classList.remove("visible");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        list.classList.add("visible");
      });
    });
  }
}

function selectCase(index) {
  selectedCaseIndex = index;
  renderSelectedCase();
}

function animateCaseOpen() {
  return new Promise((resolve) => {
    const box = document.getElementById("case-box");
    if (!box) {
      resolve();
      return;
    }

    box.classList.add("animate");
    const onEnd = () => {
      box.removeEventListener("animationend", onEnd);
      box.classList.remove("animate");
      resolve();
    };
    box.addEventListener("animationend", onEnd);
  });
}

async function openCase() {
  if (isOpening) return;
  isOpening = true;

  const button = document.getElementById("open-case");
  if (button) {
    button.disabled = true;
    button.textContent = "Otevírám...";
  }

  await animateCaseOpen();

  const selected = cases[selectedCaseIndex];
  const result = weightedRandom(selected.items);
  const floatValue = randomFloat(0.0001, 1.0);
  const openedItem = {
    ...result,
    caseName: selected.name,
    float: floatValue,
    wear: floatToWear(floatValue),
    stattrak: randomStatTrak(),
    chance: formatChance(result, selected.items)
  };

  lastOpenedItem = openedItem;
  const resultContainer = document.getElementById("result-container");
  if (resultContainer) {
    resultContainer.innerHTML = formatResult(openedItem);
  }

  const caseItemIcon = document.getElementById("case-item-icon");
  if (caseItemIcon) {
    caseItemIcon.textContent = openedItem.icon;
  }

  const box = document.getElementById("case-box");
  if (box) {
    box.classList.add("opened");
  }

  if (button) {
    button.disabled = false;
    button.textContent = "Otevřít case";
  }

  isOpening = false;
  return openedItem;
}

function initCaseOpening() {
  renderCaseButtons();
  renderSelectedCase();

  const button = document.getElementById("open-case");
  if (!button) return;
  button.addEventListener("click", () => {
    openCase();
  });
}

window.simulateCaseOpening = openCase;
window.selectCaseById = (caseId) => {
  const targetIndex = cases.findIndex((item) => item.id === caseId);
  if (targetIndex !== -1) {
    selectCase(targetIndex);
  }
};
window.lastOpenedItem = () => lastOpenedItem;

initCaseOpening();
