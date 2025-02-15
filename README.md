# Chrome Extension: Path of Exile 2 Trade Item Exporter

## Overview
This Chrome and Firefox extension adds an "Export" button to each item card on the Path of Exile 2 trade website. Clicking the button copies the item's information to your clipboard in a formatted text style compatible with Path of Building.
It will be useful until the PoE devs enable their native "Copy Item" button like in PoE1 trade.

## Features
- Dynamically adds an "Export" button to each item card.
- Copies detailed item information (including properties, mods, requirements, and skills) to the clipboard.
- Displays a non-intrusive toast message near the clicked button for confirmation.

## Installation

You can install the extension directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/poe2-trade-item-exporter/kilkeofnehhbhnkdmjbdhhcjgiimojfc) or [Firefox Add-Ons catalog](https://addons.mozilla.org/en-US/firefox/addon/poe2-trade-item-exporter/). Or you can follow the steps to download and install the source code: 

### Step 1: Download the Extension
1. Clone or download (click the green "<> Code" button and select Download Zip) the repository containing the extension files.
2. Ensure the following files are present in the folder:
   - `manifest.json`
   - `content.js`
   - `styles.css`

### Step 2: Load the Extension
#### Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer Mode** in the top-right corner.
3. Click **Load Unpacked** and select the folder containing the extension files.
4. The extension will now appear in your list of installed extensions.

#### Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**. Select the manifest.json file from the unzipped folder.
3. You may need to do this every time you open Firefox.

## Usage

1. **Navigate to the Path of Exile Trade Website**:
   - Go to the official Path of Exile trade website (https://www.pathofexile.com/trade2).

2. **Locate the Export Button**:
   - After the search results load, each item card will have an "Export" button added.

3. **Copy Item Information**:
   - Click the "Export" button on any card to copy the item's information to your clipboard.

4. **Confirmation Message**:
   - A small toast message will appear near the button to confirm that the item's details were copied successfully.

5. **Paste the Information**:
   - Open any text editor (e.g., Notepad) or Path of Building "Create custom" item dialog and paste (`Ctrl + V`) the copied information.

## Notes
- The extension dynamically handles items loaded through scrolling or searching.
- I've seen errors when pressing Ctrl + V directly in the item section of PoB2, I rather open the "Create custom" dialog.
- Socket count is not supported yet.

## Uninstalling
To remove the extension:
Chrome:
1. Navigate to `chrome://extensions/`.
2. Locate the extension in your list.
3. Click **Remove** to uninstall it from your browser.
4. Delete the folder from your drive

Firefox:
1. Close Firefox
2. Delete the folder from your drive

## Troubleshooting
- **Export Button Not Appearing:** Ensure the extension is loaded and enabled in `chrome://extensions/`.
- **Item Information Not Copied:** Verify that the item card is fully loaded before clicking the "Export" button.
- **Unexpected Behavior:** Reload the page and try again. If the issue persists, reinstall the extension.

## Contributing
Feel free to open an issue or submit a pull request to improve the functionality or add new features.

