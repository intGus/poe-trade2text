// Parse item data and return formatted text
function parseItemData(itemElement) {
  const rarityMap = {
    'item-popup--rare': 'Rare',
    'item-popup--magic': 'Magic',
    'item-popup--normal': 'Normal',
    'item-popup--unique': 'Unique',
    rarePopup: 'Rare',
    magicPopup: 'Magic',
    normalPopup: 'Normal',
    uniquePopup: 'Unique',
  };

  // Rarity class is on the outer .item-popup div (parent of .item-popup__content)
  let el = itemElement;
  let rarityClass = null;
  while (el && !rarityClass) {
    rarityClass = Array.from(el.classList).find(c => rarityMap[c]);
    el = el.parentElement;
  }
  const rarity = rarityMap[rarityClass] || 'Normal';

  // Item name and type line are in .item-popup__header-line (sibling of .item-popup__content)
  const popup = itemElement.closest('.item-popup') || itemElement.parentElement;
  const headerLines = Array.from(popup?.querySelectorAll('.item-popup__header-line') || []);
  const itemName = headerLines[0]?.textContent.trim() || '';
  const typeLine = headerLines[1]?.textContent.trim() || '';

  // Item class: property whose inner span has [type] but NO [data-field]
  const classSpan = itemElement.querySelector('.item-popup__property span[type]:not([data-field])');
  const itemClass = classSpan?.querySelector('span')?.textContent.trim()
    || classSpan?.textContent.trim()
    || '';

  // Stat properties: have .s[data-field], excluding ilvl and requirements
  const statProperties = Array.from(
    itemElement.querySelectorAll('.item-popup__property:not(.item-popup__property--requirements)')
  ).filter(p => {
    const s = p.querySelector('.s[data-field]');
    return s && s.getAttribute('data-field') !== 'ilvl';
  });

  const properties = statProperties
    .filter(p => !p.classList.contains('skill'))
    .map(p => p.textContent.trim())
    .join('\n');

  const skillProperties = statProperties
    .filter(p => p.classList.contains('skill'))
    .map(p => p.textContent.trim())
    .join('\n');

  // Requirements via data-field attributes
  const reqEl = itemElement.querySelector('.item-popup__property--requirements');
  const parsedRequirements = [];
  if (reqEl) {
    const lvlEl = reqEl.querySelector('[data-field="lvl"]');
    const strEl = reqEl.querySelector('[data-field="str"]');
    const dexEl = reqEl.querySelector('[data-field="dex"]');
    const intEl = reqEl.querySelector('[data-field="int"]');
    // Level: <span>Level</span> <span>39</span> → value is last-child
    const lvl = lvlEl?.querySelector('span:last-child')?.textContent.trim();
    // Str/Dex/Int: <span>70</span> <span>Dex</span> → value is first-child
    const str = strEl?.querySelector('span:first-child')?.textContent.trim();
    const dex = dexEl?.querySelector('span:first-child')?.textContent.trim();
    const int_ = intEl?.querySelector('span:first-child')?.textContent.trim();
    if (lvl) parsedRequirements.push(`Level: ${lvl}`);
    if (str) parsedRequirements.push(`Str: ${str}`);
    if (dex) parsedRequirements.push(`Dex: ${dex}`);
    if (int_) parsedRequirements.push(`Int: ${int_}`);
  }

  // Item level: value is in the last child span of [data-field="ilvl"]
  const ilvlEl = itemElement.querySelector('[data-field="ilvl"]');
  const itemLevel = ilvlEl?.querySelector('span:last-child')?.textContent.trim() || '';

  // Mods — new structure: .item-mod--TYPE contains .s span with mod text
  const enchantMods = Array.from(itemElement.querySelectorAll('.item-mod--enchant .s'))
    .map(m => `${m.textContent.trim()} (enchant)`).join('\n');

  const runeMods = Array.from(itemElement.querySelectorAll('.item-mod--rune .s'))
    .map(m => `${m.textContent.trim()} (rune)`).join('\n');

  const implicitMods = Array.from(itemElement.querySelectorAll('.item-mod--implicit .s'))
    .map(m => `${m.textContent.trim()} (implicit)`).join('\n');

  const fracturedMods = Array.from(itemElement.querySelectorAll('.item-mod--fractured .s'))
    .map(m => `${m.textContent.trim()} (fractured)`).join('\n');

  const explicitMods = Array.from(itemElement.querySelectorAll('.item-mod--explicit .s'))
    .map(m => m.textContent.trim()).join('\n');

  const desecratedMods = Array.from(
    itemElement.querySelectorAll('.item-mod--desecrated .s, .item-mod--corrupted .s')
  ).map(m => `${m.textContent.trim()} (desecrated)`).join('\n');

  const unmet = Array.from(itemElement.querySelectorAll('.unmet'))
    .map(e => e.textContent.trim()).join('\n');

  const augmented = Array.from(itemElement.querySelectorAll('.augmented span'))
    .map(e => e.textContent.trim()).join('\n');

  const sections = [
    itemClass ? `Item Class: ${itemClass}` : '',
    `Rarity: ${rarity}`,
    itemName,
    typeLine,
    '--------',
    properties,
    properties ? '--------' : '',
    parsedRequirements.length > 0 ? `Requirements:\n${parsedRequirements.join('\n')}` : '',
    parsedRequirements.length > 0 ? '--------' : '',
    itemLevel ? `Item Level: ${itemLevel}` : '',
    itemLevel ? '--------' : '',
    enchantMods,
    enchantMods ? '--------' : '',
    runeMods,
    runeMods ? '--------' : '',
    skillProperties,
    skillProperties ? '--------' : '',
    implicitMods,
    implicitMods ? '--------' : '',
    fracturedMods,
    explicitMods,
    desecratedMods,
    unmet ? '--------' : '',
    unmet,
    augmented ? '--------' : '',
    augmented,
  ];

  return sections.filter(s => s.trim() !== '').join('\n');
}

function createToastContainer() {
  if (document.querySelector('#toast-container')) return;

  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.style.position = 'fixed';
  toastContainer.style.bottom = '20px';
  toastContainer.style.right = '20px';
  toastContainer.style.zIndex = '9999';
  toastContainer.style.display = 'flex';
  toastContainer.style.flexDirection = 'column';
  toastContainer.style.gap = '10px';

  document.body.appendChild(toastContainer);
}

function showToast(message, targetElement) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.background = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.3s ease';
  toast.style.position = 'absolute';
  toast.style.zIndex = '9999';

  const rect = targetElement.getBoundingClientRect();
  toast.style.top = `${rect.top + window.scrollY - 40}px`;
  toast.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function addExportButtons() {
  const cards = document.querySelectorAll('.resultset .row');

  cards.forEach((card) => {
    const leftDiv = card.querySelector('.left');

    if (leftDiv && !card.querySelector('.export-icon')) {
      const exportButton = document.createElement('button');
      exportButton.innerText = 'Export';
      exportButton.className = 'export-icon';
      exportButton.style.cursor = 'pointer';

      exportButton.addEventListener('click', (event) => {
        // Try new selector first, fall back to old
        const itemPopup =
          card.querySelector('.item-popup__content') ||
          card.querySelector('.itemPopupContainer');
        if (itemPopup) {
          const formattedText = parseItemData(itemPopup);
          copyToClipboard(formattedText);
          showToast('Copied to clipboard!', event.currentTarget);
          // console.log("Copied:\n" + formattedText); // for debug
        } else {
          showToast('Item details not found!', event.currentTarget);
        }
      });

      leftDiv.appendChild(exportButton);
    }
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {},
    (err) => { console.error('Could not copy text to clipboard:', err); }
  );
}

// Main observer logic
let resultSetObserver = null;
let observedResultSet = null;

const mainObserver = new MutationObserver(() => {
  const resultSet = document.querySelector('.resultset');
  if (resultSet && resultSet !== observedResultSet) {
    if (resultSetObserver) {
      resultSetObserver.disconnect();
    }

    observedResultSet = resultSet;
    resultSetObserver = new MutationObserver(() => {
      addExportButtons();
    });

    resultSetObserver.observe(resultSet, { childList: true, subtree: false });

    addExportButtons();
  }
});

mainObserver.observe(document.body, { childList: true, subtree: true });
