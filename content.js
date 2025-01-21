// Parse item data and return formatted text
function parseItemData(itemElement) {
  const rarityMap = {
    rarePopup: "Rare",
    magicPopup: "Magic",
    normalPopup: "Normal",
    uniquePopup: "Unique",
  };

  // Extract item class
  const itemClass = itemElement.querySelector(".property .lc span")?.textContent.trim() || "";

  // Extract rarity
  const rarityClass = Array.from(itemElement.classList).find((cls) =>
    Object.keys(rarityMap).includes(cls)
  );
  const rarity = rarityMap[rarityClass] || "Unknown";

  // Extract item names
  const itemName = itemElement.querySelector(".itemName .lc")?.textContent.trim() || "";
  const typeLine = itemElement.querySelector(".itemName.typeLine .lc")?.textContent.trim() || "";

  // Extract all properties, skip the first one (item class)
  const propertyElements = Array.from(itemElement.querySelectorAll(".property"));
  const properties = propertyElements
    .filter((prop) => !prop.classList.contains("skill")) // Exclude skill properties
    .slice(1) // Skip the first property (item class)
    .map((prop) => prop.textContent.trim())
    .join("\n");

  // Extract skill properties as implicit mods
  const skillProperties = propertyElements
    .filter((prop) => prop.classList.contains("skill")) // Include only skill properties
    .map((prop) => `${prop.textContent.trim()} (implicit)`)
    .join("\n");

  // Extract requirements dynamically
  const requirementsElement = itemElement.querySelector(".requirements");
  const requirementsText = requirementsElement?.textContent.trim() || "";
  const parsedRequirements = [];
  if (requirementsText.includes("Level")) {
    const levelMatch = requirementsText.match(/Level\s(\d+)/);
    if (levelMatch) {
      parsedRequirements.push(`Level: ${levelMatch[1]}`);
    }
  }
  if (requirementsText.includes("Dex")) {
    const dexMatch = requirementsText.match(/(\d+)\sDex/);
    if (dexMatch) {
      parsedRequirements.push(`Dex: ${dexMatch[1]}`);
    }
  }
  if (requirementsText.includes("Int")) {
    const intMatch = requirementsText.match(/(\d+)\sInt/);
    if (intMatch) {
      parsedRequirements.push(`Int: ${intMatch[1]}`);
    }
  }
  if (requirementsText.includes("Str")) {
    const strMatch = requirementsText.match(/(\d+)\sStr/);
    if (strMatch) {
      parsedRequirements.push(`Str: ${strMatch[1]}`);
    }
  }

  // Extract item level
  const itemLevel = itemElement.querySelector(".itemLevel .colourDefault")?.textContent.trim() || "";

  // Extract enchant mods
  const enchantMods = Array.from(itemElement.querySelectorAll(".enchantMod .s"))
    .map((mod) => `${mod.textContent.trim()} (enchant)`)
    .join("\n");

  // Extract rune mods
  const runeMods = Array.from(itemElement.querySelectorAll(".runeMod .s"))
    .map((mod) => `${mod.textContent.trim()} (rune)`)
    .join("\n");

  // Extract implicit mods
  const implicitMods = Array.from(itemElement.querySelectorAll(".implicitMod .s"))
    .map((mod) => `${mod.textContent.trim()} (implicit)`)
    .join("\n");

  // Extract explicit mods
  const explicitMods = Array.from(itemElement.querySelectorAll(".explicitMod .s"))
    .map((mod) => mod.textContent.trim())
    .join("\n");

  // Extract unmet and augmented
  const unmet = itemElement.querySelector(".unmet")?.textContent.trim() || "";
  const augmented = itemElement.querySelector(".augmented span")?.textContent.trim() || "";

  // Construct the formatted text
  const sections = [
    `Item Class: ${itemClass}`,
    `Rarity: ${rarity}`,
    `${itemName}`,
    `${typeLine}`,
    `--------`,
    properties,
    properties ? "--------" : "",
    parsedRequirements.length > 0 ? `Requirements:\n${parsedRequirements.join("\n")}` : "",
    parsedRequirements.length > 0 ? "--------" : "",
    itemLevel ? `Item Level: ${itemLevel}` : "",
    itemLevel ? "--------" : "",
    enchantMods ? enchantMods : "",
    enchantMods ? "--------" : "",
    runeMods ? runeMods : "",
    runeMods ? "--------" : "",
    skillProperties ? skillProperties : "",
    implicitMods ? implicitMods : "",
    implicitMods ? "--------" : "",
    explicitMods ? `${explicitMods}` : "",
    unmet ? "--------" : "",
    unmet ? unmet : "",
    augmented ? "--------" : "",
    augmented ? augmented : "",
  ];

  // Filter sections and join
  return sections.filter((section) => section.trim() !== "").join("\n");
}

function createToastContainer() {
  // Check if toast container exists
  if (document.querySelector('#toast-container')) return;

  // Create the toast container
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

  // Get the button position
  const rect = targetElement.getBoundingClientRect();
  toast.style.top = `${rect.top + window.scrollY - 40}px`; // 40px above the button
  toast.style.left = `${rect.left + window.scrollX}px`; // Align with the button's left edge

  // Append the toast to the body
  document.body.appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function addExportButtons() {
  const cards = document.querySelectorAll(".resultset .row");

  cards.forEach((card) => {
    const leftDiv = card.querySelector('.left');

    if (leftDiv && !card.querySelector('.export-icon')) {
      const exportButton = document.createElement('button');
      exportButton.innerText = 'Export';
      exportButton.className = 'export-icon';
      exportButton.style.cursor = 'pointer';

      exportButton.addEventListener('click', (event) => {
        const itemPopup = card.querySelector(".itemPopupContainer");
        if (itemPopup) {
          const formattedText = parseItemData(itemPopup);
          copyToClipboard(formattedText);
          showToast('Copied to clipboard!', event.currentTarget);
          // alert("Copied to clipboard:\n" + formattedText); // for debug
        } else {
          showToast('Item details not found!', event.currentTarget);
        }
      });

      leftDiv.appendChild(exportButton);
    }
  });
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      //console.log("Text copied to clipboard:", text); // for debug
    },
    (err) => {
      console.error("Could not copy text to clipboard:", err);
    }
  );
}

// Main observer logic
const mainObserver = new MutationObserver((mutations, obs) => {
  const resultSet = document.querySelector('.resultset');
  if (resultSet) {
    //console.log("Result set found:", resultSet); // for debug

    //obs.disconnect();

    const resultSetObserver = new MutationObserver(() => {
      addExportButtons();
    });

    resultSetObserver.observe(resultSet, { childList: true, subtree: false });

    addExportButtons();
  }
});

mainObserver.observe(document.body, { childList: true, subtree: true });
