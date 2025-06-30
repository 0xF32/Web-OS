let windowMoveAmount = 10;
let windowResizeAmount = 10;
let currentID = 0;
window.indexedDB;
// Window constants:
let windowControls = `\
  <button class="window-button min-button" onclick="minimiseWindow(this)">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 11 19 11" />
    </svg>
  </button>
  <button class="window-button max-button" onclick="maximiseWindow(this)">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 4 19 4" />
      <path d="M5 4 5 18" />
      <path d="M19 18 5 18" />
      <path d="M19 18 19 4" />
    </svg>
  </button>
  <button class="window-button close-button" onclick="closeWindow(this)">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 4 19 18"></path>
      <path d="M19 4 5 18"></path>
    </svg>
  </button>`;

// Init the IndexedDB
initFS("fileSystem");
// Global key listener
document.addEventListener("keydown", keydown, false);

async function init() {
  // Load windows that exist from localStorage
  // make them from defaults if the key does not exist
  await open("bin HelloWorld.html");
  await open("bin Terminal.html");
  await open("bin CSSSettings.html");
  await open("bin JSSettings.html");
  await open("bin DEV.html");
  // await open("bin Bar.html");
  // await open("bin Music.html");
  await open("bin iFrameBrowser.html");

  // Sync all the css settings to the settings panel
  syncCSS("--wallpaper");
  syncCSS("--theme-main");
  syncCSS("--theme-main-mono");
  syncCSS("--theme-bg");
  syncCSS("--theme-bg-alt");
  syncCSS("--theme-bg-alt2");
  syncCSS("--border");
  syncCSS("--border-width");
  syncCSS("--shadow");
  syncCSS("--shadow-distance");
  syncCSS("--shadow-blur");
  syncCSS("--inner-shadow");
  syncCSS("--inner-shadow-distance");
  syncCSS("--inner-shadow-blur");
  syncCSS("--rounding");
  syncCSS("--btn-rounding");
  syncCSS("--padding");
  syncCSS("--scroll-bar-width");
  syncCSS("--panel-bg-blur");
  syncCSS("--font-size");
  syncCSS("--large-font-size");
  syncCSS("--font-ui");
  syncCSS("--font-monospace");
  // Terminal Colours
  syncCSS("--t-foreground");
  syncCSS("--t-background");
  syncCSS("--t-cursor");
  syncCSS("--t-selection");
  syncCSS("--t-black");
  syncCSS("--t-red");
  syncCSS("--t-green");
  syncCSS("--t-yellow");
  syncCSS("--t-blue");
  syncCSS("--t-purple");
  syncCSS("--t-cyan");
  syncCSS("--t-white");
  syncCSS("--t-l-black");
  syncCSS("--t-l-red");
  syncCSS("--t-l-green");
  syncCSS("--t-l-yellow");
  syncCSS("--t-l-blue");
  syncCSS("--t-l-purple");
  syncCSS("--t-l-cyan");
  syncCSS("--t-l-white");
  // Sync all the JS settings to the settings panel
  syncJSVariable("windowMoveAmount");
  syncJSVariable("windowResizeAmount");
  // Add window control elements to the inside of the tag
  document.querySelectorAll(".windowControl").forEach((el) => {
    el.innerHTML = windowControls;
  });
  // Sync Window states:
  document.querySelectorAll("window").forEach((el) => {
    syncElementCSS(el, "--x");
    syncElementCSS(el, "--y");
    syncElementCSS(el, "--width");
    syncElementCSS(el, "--height");
    syncElementCSS(el, "--z-index");
    syncElementCSS(el, "--maximised");
    // Fix maximised states:
    let isMaximised = getElementCSS(el, "--maximised");
    if (isMaximised == 0) {
      setElementCSS(el, "translate", "var(--x) var(--y)");
      setElementCSS(el, "width", "var(--width)");
      setElementCSS(el, "height", "var(--height)");
      setElementCSS(el, "border-radius", "var(--rounding)");
      setElementCSS(el, "border", "var(--border-width) solid var(--border)");
      setElementCSS(el, "--maximised", 0);
    } else {
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      setElementCSS(
        el,
        "translate",
        "calc(0px - var(--padding)) calc(0px - var(--padding))"
      );
      setElementCSS(el, "width", width + "px");
      setElementCSS(el, "height", height + "px");
      setElementCSS(el, "border-radius", 0);
      setElementCSS(el, "border", 0);
      setElementCSS(el, "--maximised", 1);
    }
  });
  // Set the wallpaper
  await setWallpaper(getCSS("--wallpaper"));

  // Done
  console.log("Init done!");
}

async function initFS(dbName) {
  // Recreate default stores
  return new Promise(function recreateDBPromise(resolve) {
    // Open the database
    let openDB = indexedDB.open(dbName);
    console.log("Opened DB", dbName);

    openDB.onupgradeneeded = function upgradeDB(event) {
      let db = event.target.result;
      // Create Stores
      // "bin"
      let binStore = db.createObjectStore("bin", {
        keyPath: "file",
      });
      binStore.add({
        file: "HelloWorld.html",
        type: "app/html",
        app: {
          title: "Hello World!",
          icon: "👋",
          size: [370, 490],
          position: [0, 0],
        },
        contents: `<div class="window-area">
          Welcome to this website, which aims to be a fully functional graphical OS.
          This website will demonstrate how Web-OS works, and how you can setup your
          own distro of Web-OS.
          <p></p>
          All customisations made, and files saved, are stored in local-storage, so
          that upon reloading the page, or closing the browser, OS state can be
          restored.
          <p></p>
          The terminal is cool:
          <code>\`cat welcome.txt\`</code>
          <p></p>
          Web-OS is still in the very early stages of development, new features may
          break various parts of the OS. It is highly recommended to reset all your
          data when a newer version is released.
          <ul>
          <li>All fileSystem data is stored in the IndexedDB.</li>
          <li>
              All customisations and local changes that should be persistent between
              refreshes of the page are stored in localStorage.
          </li>
          <li>
              And of course, if everything is reset, it will be as if you have never
              visited the website before.
          </li>
          </ul>
          You can use a custom wallpaper by making a file in the fileSystem that
          contains a link to the image (or a base64 data uri), and then set the
          wallpaper by setting the CSS Setting: <code>\`--wallpaper\`</code> to the
          fileSystem path where you saved the image.
          <p></p>
          TODO: All data can be imported and exported if you want to mess around
          with the setup of the OS without being in the OS.
          <p></p>
          List of things to implement:
          <ul>
          <li>Import and Export of CSS Settings.</li>
          <li>App Launcher, and permanent closing of apps</li>
          <li>Multiple of the same window</li>
          <li>Import and Export of all Data.</li>
          <li>Drag windows with mouse cursor</li>
          <li>Tiling mode, where each window moves to make space for others</li>
          <li>Ability to write programs</li>
          <li>
              Remove all text fields, replacing with custom key events, that keep
              focus (specifically in the terminal)
          </li>
          <li>
              Mock package manager and/or ability to make packages and pull request
              on github
          </li>
          </ul>
        </div>
        <footer class="window-footer">
          <span>
            See the <a href="https://github.com/0xF32/Web-OS">Source Code</a>
          </span>
        </footer>`,
      });
      binStore.add({
        file: "Terminal.html",
        type: "app/html",
        app: {
          title: "Terminal",
          icon: "<code>&lt;/&gt;</code>",
          size: [510, 430],
          position: [400, 60],
        },
        contents: `\
          <code
            class="window-area terminal"
            onclick="if (event.target.children.namedItem('terminal_input')) { event.target.children.namedItem('terminal_input').focus() } else { resetTerminal(event.target) }"
          >
            Click to activate.
          </code>`,
      });
      binStore.add({
        file: "CSSSettings.html",
        type: "app/html",
        app: {
          title: "CSS Settings",
          icon: "<code>CSS</code>",
          size: [460, 490],
          position: [940, 0],
        },
        contents: `\
        <div class="window-area">
          <table>
            <tr>
              <th>Setting</th>
              <th>Value</th>
              <th>Preview</th>
            </tr>
            <tr>
              <td><code>--wallpaper</code></td>
              <td>
                <input
                  id="setting--wallpaper"
                  onchange="setWallpaper(this.value)"
                />
              </td>
              <td
                name="setting_wallpaper_preview"
                id="setting_wallpaper_preview"
                style="
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: center;
                "
              ></td>
            </tr>
            <tr>
              <td><code>--theme-main</code></td>
              <td>
                <input
                  id="setting--theme-main"
                  onchange="setCSS('--theme-main', this.value)"
                />
              </td>
              <td style="background-color: var(--theme-main)"></td>
            </tr>
            <tr>
              <td><code>--theme-main-mono</code></td>
              <td>
                <input
                  id="setting--theme-main-mono"
                  onchange="setCSS('--theme-main-mono', this.value)"
                />
              </td>
              <td style="background-color: var(--theme-main-mono)"></td>
            </tr>
            <tr>
              <td><code>--theme-bg</code></td>
              <td>
                <input
                  id="setting--theme-bg"
                  onchange="setCSS('--theme-bg', this.value)"
                />
              </td>
              <td style="background-color: var(--theme-bg)"></td>
            </tr>
            <tr>
              <td><code>--theme-bg-alt</code></td>
              <td>
                <input
                  id="setting--theme-bg-alt"
                  onchange="setCSS('--theme-bg-alt', this.value)"
                />
              </td>
              <td style="background-color: var(--theme-bg-alt)"></td>
            </tr>
            <tr>
              <td><code>--theme-bg-alt2</code></td>
              <td>
                <input
                  id="setting--theme-bg-alt2"
                  onchange="setCSS('--theme-bg-alt2', this.value)"
                />
              </td>
              <td style="background-color: var(--theme-bg-alt2)"></td>
            </tr>
            <tr>
              <td><code>--border</code></td>
              <td>
                <input
                  id="setting--border"
                  onchange="setCSS('--border', this.value)"
                />
              </td>
              <td style="background-color: var(--border)"></td>
            </tr>
            <tr>
              <td><code>--border-width</code></td>
              <td>
                <input
                  id="setting--border-width"
                  type="number"
                  onchange="setCSS('--border-width', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--shadow</code></td>
              <td>
                <input
                  id="setting--shadow"
                  onchange="setCSS('--shadow', this.value)"
                />
              </td>
              <td style="background-color: var(--shadow)"></td>
            </tr>
            <tr>
              <td><code>--shadow-distance</code></td>
              <td>
                <input
                  id="setting--shadow-distance"
                  type="number"
                  onchange="setCSS('--shadow-distance', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--shadow-blur</code></td>
              <td>
                <input
                  id="setting--shadow-blur"
                  type="number"
                  onchange="setCSS('--shadow-blur', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--inner-shadow</code></td>
              <td>
                <input
                  id="setting--inner-shadow"
                  onchange="setCSS('--inner-shadow', this.value)"
                />
              </td>
              <td style="background-color: var(--shadow)"></td>
            </tr>
            <tr>
              <td><code>--inner-shadow-distance</code></td>
              <td>
                <input
                  id="setting--inner-shadow-distance"
                  type="number"
                  onchange="setCSS('--inner-shadow-distance', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--inner-shadow-blur</code></td>
              <td>
                <input
                  id="setting--inner-shadow-blur"
                  type="number"
                  onchange="setCSS('--inner-shadow-blur', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--rounding</code></td>
              <td>
                <input
                  id="setting--rounding"
                  type="number"
                  onchange="setCSS('--rounding', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--btn-rounding</code></td>
              <td>
                <input
                  id="setting--btn-rounding"
                  type="number"
                  onchange="setCSS('--btn-rounding', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--scroll-bar-width</code></td>
              <td>
                <input
                  id="setting--scroll-bar-width"
                  type="number"
                  onchange="setCSS('--scroll-bar-width', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--padding</code></td>
              <td>
                <input
                  id="setting--padding"
                  type="number"
                  onchange="setCSS('--padding', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--panel-bg-blur</code></td>
              <td>
                <input
                  id="setting--panel-bg-blur"
                  type="number"
                  onchange="setCSS('--panel-bg-blur', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--font-size</code></td>
              <td>
                <input
                  id="setting--font-size"
                  type="number"
                  onchange="setCSS('--font-size', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--large-font-size</code></td>
              <td>
                <input
                  id="setting--large-font-size"
                  type="number"
                  onchange="setCSS('--large-font-size', this.value + 'px')"
                />
              </td>
            </tr>
            <tr>
              <td><code>--font-ui</code></td>
              <td>
                <input
                  id="setting--font-ui"
                  onchange="setCSS('--font-ui', this.value)"
                />
              </td>
            </tr>
            <tr>
              <td><code>--font-monospace</code></td>
              <td>
                <input
                  id="setting--font-monospace"
                  onchange="setCSS('--font-monospace', this.value)"
                />
              </td>
            </tr>
          </table>
          <p style="font-size: var(--large-font-size); text-align: center">
            Terminal Colours
          </p>
          <table>
            <tr>
              <th>Setting</th>
              <th>Value</th>
              <th>Preview</th>
            </tr>
            <tr>
              <td><code>--t-foreground</code></td>
              <td>
                <input
                  id="setting--t-foreground"
                  onchange="setCSS('--t-foreground', this.value)"
                />
              </td>
              <td style="background-color: var(--t-foreground)"></td>
            </tr>
            <tr>
              <td><code>--t-background</code></td>
              <td>
                <input
                  id="setting--t-background"
                  onchange="setCSS('--t-background', this.value)"
                />
              </td>
              <td style="background-color: var(--t-background)"></td>
            </tr>
            <tr>
              <td><code>--t-cursor</code></td>
              <td>
                <input
                  id="setting--t-cursor"
                  onchange="setCSS('--t-cursor', this.value)"
                />
              </td>
              <td style="background-color: var(--t-cursor)"></td>
            </tr>
            <tr>
              <td><code>--t-selection</code></td>
              <td>
                <input
                  id="setting--t-selection"
                  onchange="setCSS('--t-selection', this.value)"
                />
              </td>
              <td style="background-color: var(--t-selection)"></td>
            </tr>
            <tr>
              <td><code>--t-black</code></td>
              <td>
                <input
                  id="setting--t-black"
                  onchange="setCSS('--t-black', this.value)"
                />
              </td>
              <td style="background-color: var(--t-black)"></td>
            </tr>
            <tr>
              <td><code>--t-red</code></td>
              <td>
                <input
                  id="setting--t-red"
                  onchange="setCSS('--t-red', this.value)"
                />
              </td>
              <td style="background-color: var(--t-red)"></td>
            </tr>
            <tr>
              <td><code>--t-green</code></td>
              <td>
                <input
                  id="setting--t-green"
                  onchange="setCSS('--t-green', this.value)"
                />
              </td>
              <td style="background-color: var(--t-green)"></td>
            </tr>
            <tr>
              <td><code>--t-yellow</code></td>
              <td>
                <input
                  id="setting--t-yellow"
                  onchange="setCSS('--t-yellow', this.value)"
                />
              </td>
              <td style="background-color: var(--t-yellow)"></td>
            </tr>
            <tr>
              <td><code>--t-blue</code></td>
              <td>
                <input
                  id="setting--t-blue"
                  onchange="setCSS('--t-blue', this.value)"
                />
              </td>
              <td style="background-color: var(--t-blue)"></td>
            </tr>
            <tr>
              <td><code>--t-purple</code></td>
              <td>
                <input
                  id="setting--t-purple"
                  onchange="setCSS('--t-purple', this.value)"
                />
              </td>
              <td style="background-color: var(--t-purple)"></td>
            </tr>
            <tr>
              <td><code>--t-cyan</code></td>
              <td>
                <input
                  id="setting--t-cyan"
                  onchange="setCSS('--t-cyan', this.value)"
                />
              </td>
              <td style="background-color: var(--t-cyan)"></td>
            </tr>
            <tr>
              <td><code>--t-white</code></td>
              <td>
                <input
                  id="setting--t-white"
                  onchange="setCSS('--t-white', this.value)"
                />
              </td>
              <td style="background-color: var(--t-white)"></td>
            </tr>
            <tr>
              <td><code>--t-l-black</code></td>
              <td>
                <input
                  id="setting--t-l-black"
                  onchange="setCSS('--t-l-black', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-black)"></td>
            </tr>
            <tr>
              <td><code>--t-l-red</code></td>
              <td>
                <input
                  id="setting--t-l-red"
                  onchange="setCSS('--t-l-red', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-red)"></td>
            </tr>
            <tr>
              <td><code>--t-l-green</code></td>
              <td>
                <input
                  id="setting--t-l-green"
                  onchange="setCSS('--t-l-green', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-green)"></td>
            </tr>
            <tr>
              <td><code>--t-l-yellow</code></td>
              <td>
                <input
                  id="setting--t-l-yellow"
                  onchange="setCSS('--t-l-yellow', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-yellow)"></td>
            </tr>
            <tr>
              <td><code>--t-l-blue</code></td>
              <td>
                <input
                  id="setting--t-l-blue"
                  onchange="setCSS('--t-l-blue', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-blue)"></td>
            </tr>
            <tr>
              <td><code>--t-l-purple</code></td>
              <td>
                <input
                  id="setting--t-l-purple"
                  onchange="setCSS('--t-l-purple', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-purple)"></td>
            </tr>
            <tr>
              <td><code>--t-l-cyan</code></td>
              <td>
                <input
                  id="setting--t-l-cyan"
                  onchange="setCSS('--t-l-cyan', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-cyan)"></td>
            </tr>
            <tr>
              <td><code>--t-l-white</code></td>
              <td>
                <input
                  id="setting--t-l-white"
                  onchange="setCSS('--t-l-white', this.value)"
                />
              </td>
              <td style="background-color: var(--t-l-white)"></td>
            </tr>
          </table>
        </div>
        <footer class="window-footer">
          Export and Import Buttons can go here!
        </footer>`,
      });
      binStore.add({
        file: "JSSettings.html",
        type: "app/html",
        app: {
          title: "JS Settings",
          icon: "<code>JS</code>",
          size: [370, 170],
          position: [0, 520],
        },
        contents: `\
          <div class="window-area">
            <table>
              <tr>
                <th>Setting</th>
                <th>Value</th>
              </tr>
              <tr>
                <td><code>windowMoveAmount</code></td>
                <td>
                  <input
                    id="setting_windowMoveAmount"
                    type="number"
                    onchange="setJSVariable('windowMoveAmount', this.value)"
                  />
                </td>
              </tr>
              <tr>
                <td><code>windowResizeAmount</code></td>
                <td>
                  <input
                    id="setting_windowResizeAmount"
                    type="number"
                    onchange="setJSVariable('windowResizeAmount', this.value)"
                  />
                </td>
              </tr>
            </table>
          </div>
          <footer class="window-footer">
            Export and Import Buttons can go here!
          </footer>`,
      });
      binStore.add({
        file: "DEV.html",
        type: "app/html",
        app: {
          title: "DEV",
          icon: "<code>DEV</code>",
          size: [400, 170],
          position: [400, 520],
        },
        contents: `\
          <div class="window-area">
            <table>
              <tr>
                <th>Button</th>
                <th>Description</th>
              </tr>
              <tr>
                <td>
                  <button
                    class="warning-button"
                    style="padding: 0 var(--padding)"
                    onclick="if (confirm('Are you sure you want to fully reset the fileSystem')) { resetFileSystem('fileSystem'); location.reload(); }"
                  >
                    Reset fileSystem
                  </button>
                </td>
                <td>Deletes all data in the indexedDB</td>
              </tr>
              <tr>
                <td>
                  <button
                    class="warning-button"
                    style="padding: 0 var(--padding)"
                    onclick="if (confirm('Are you sure you want to fully reset customisations stored in localStorage')) { localStorage.clear(); location.reload(); }"
                  >
                    Reset localStorage
                  </button>
                </td>
                <td>Deletes all data in the localStorage</td>
              </tr>
              <tr>
                <td>
                  <button
                    class="warning-button"
                    style="padding: 0 var(--padding)"
                    onclick="resetAll()"
                  >
                    Reset ALL!
                  </button>
                </td>
                <td>Reset everything to original state</td>
              </tr>
            </table>
          </div>
          <footer class="window-footer">
            If this window exists, the website is unstable
          </footer>`,
      });
      binStore.add({
        file: "Music.html",
        type: "app/html",
        app: {
          title: "Music Player",
          icon: "<code>🎵</code>",
          size: [510, 30],
          position: [400, 0],
        },
        contents: `\
            <head>
              <style>
              
              </style>
              <link rel="stylesheet" href="apps/music/music.css" />
              <script
                src="https://kit.fontawesome.com/ab54ee68f9.js"
                crossorigin="anonymous"
              ></script>
            </head>
            <body>
              <div class="player-container">
                <div class="image-container">
                  <img src="apps/music/images/Airflow.jpg" alt="music cover" id="image" />
                </div>
                <audio src="apps/music/music/Airflow.mp3" id="audio"></audio>

                <p class="music-title" id="music-title">Airflow</p>
                <div class="cta-container">
                  <button class="replay" id="replay">
                    <i class="fas fa-redo"></i>
                  </button>
                  <button class="previous-btn" id="previous-track">
                    <i class="fas fa-step-backward"></i>
                  </button>
                  <button class="play-btn" id="play">
                    <i class="fas fa-play"></i>
                  </button>
                  <button class="next-track-btn" id="next-track">
                    <i class="fas fa-step-forward"></i>
                  </button>
                  <button class="random" id="shuffle">
                    <i class="fas fa-random"></i>
                  </button>
                </div>
                <div class="progress-container" id="progress-container">
                  <p class="time-progress" id="time-progress"></p>
                  <div class="progress" id="progress"></div>
                  <p class="total-track-time" id="total-track-time"></p>
                </div>

                <div class="range-container">
                  <i class="fas fa-volume-mute mute" id="mute"></i>
                  <input type="range" min="0" max="100" value="100" id="volume-range" />
                  <i class="fas fa-volume-up volume-up" id="volume-up"></i>
                </div>
              </div>
              <script src="apps/music/music.js"></script>
            </body>`,
      });
      binStore.add({
        file: "iFrameBrowser.html",
        type: "app/html",
        app: {
          title: "iFrame Browser",
          icon: "<code>🌐</code>",
          size: [500, 800],
          position: [1430, 0],
        },
        contents: `\
          <div class="window-area" style="margin: 0">
            <input
              style="
                width: calc(100% - 2 * var(--padding));
                padding-bottom: var(--padding);
                padding-top: var(--padding);
              "
              type="text"
              value="assets"
              onchange="document.getElementById('customIFrame_frame').src = this.value"
            />
            <div style="width: 100%; height: calc(100% - 1em - 2 * var(--padding))">
              <iframe
                src="assets"
                width="100%"
                height="100%"
                frameborder="0"
                allowtransparency="true"
                id="customIFrame_frame"
              ></iframe>
            </div>
          </div>
          <footer class="window-footer">Testing external iframes</footer>`,
      });
      // "dev"
      let devStore = db.createObjectStore("dev", {
        keyPath: "file",
      });
      devStore.add({
        file: "null",
        type: "null",
        contents: "",
      });
      // "etc"
      let etcStore = db.createObjectStore("etc", {
        keyPath: "file",
      });
      // "home"
      let homeStore = db.createObjectStore("home", {
        keyPath: "file",
      });
      homeStore.add({
        file: "ArchLogo",
        type: "file/txt",
        contents: `<pre>                   -'
                  .o+'
                 'ooo/
                '+oooo:
               '+oooooo:
               -+oooooo+:
             '/:-:++oooo+:
            '/++++/+++++++:
           '/++++++++++++++:
          '/+++ooooooooooooo/'
         ./ooosssso++osssssso+'
        .oossssso-''''/ossssss+'
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   '/ossssso+/:-        -:/+osssso+-
  '+sso+:-'                 '.-/+oso:
 '++:.                           '-/+/
 .'                                 '</pre>`,
      });
      homeStore.add({
        file: "terminal_help.txt",
        type: "file/txt",
        contents:
          "<br />Welcome to the terminal help, a quick guide that lists the syntax of the available commands.<br /><br />help :: no args :: shows a list of commands<br />ls :: no args :: lists the files in the current path <br />clear :: no args :: clears the output of the terminal<br />echo :: dumbly prints all of the text following 'echo '<br />loop {amount} {command} :: dumbly loops the command for the amount specified, can be nested<br />neofetch :: no args :: prints browser info<br />cat {store} {file} :: outputs the contents of the file<br />pwd :: outputs the current path<br />fsw {store} {file} {type} {contents} :: writes the file to the store with the type and contents provided<br />rm {store} {file} :: deletes the file from the store<br /><br />More to be added soon!<br />",
      });
      homeStore.add({
        file: "welcome.txt",
        type: "file/txt",
        contents:
          "<br />Hello World!<br /><br />Welcome to Web OS, read the Hello World window for more information.<br />To learn how to use the terminal, run the command: <code>`cat home terminal_help.txt`</code><br />",
      });
      homeStore.add({
        file: "wall1.jpg",
        type: "image/jpg",
        contents: "assets/images/wall1.jpg",
      });
      homeStore.add({
        file: "Astronaut.jpg",
        type: "image/jpg",
        contents: "assets/images/Astronaut.jpg",
      });
      homeStore.add({
        file: "Leaves.jpg",
        type: "image/jpg",
        contents: "assets/images/Leaves.jpg",
      });
      homeStore.add({
        file: "Malefor.jpg",
        type: "image/jpg",
        contents:
          "https://gitlab.com/garuda-linux/themes-and-settings/artwork/garuda-wallpapers/-/raw/9982951df13614bf9aa1471adcde9e811d34ce94/src/garuda-wallpapers/Malefor.jpg",
      });
      homeStore.add({
        file: "abstract-swirls.jpg",
        type: "image/jpg",
        contents:
          "https://raw.githubusercontent.com/orangci/walls-catppuccin-mocha/master/abstract-swirls.jpg",
      });
      homeStore.add({
        file: "dark-star.jpg",
        type: "image/jpg",
        contents:
          "https://raw.githubusercontent.com/orangci/walls-catppuccin-mocha/master/dark-star.jpg",
      });
      homeStore.add({
        file: "flying-comets-clouds.jpg",
        type: "image/jpg",
        contents:
          "https://raw.githubusercontent.com/orangci/walls-catppuccin-mocha/master/flying-comets-clouds.jpg",
      });
      homeStore.add({
        file: "wall01.svg",
        type: "image/svg",
        contents: "assets/images/wall01.svg",
      });
      homeStore.add({
        file: "wall02.svg",
        type: "image/svg",
        contents: "assets/images/wall02.svg",
      });
      homeStore.add({
        file: "wall03.svg",
        type: "image/svg",
        contents: "assets/images/wall03.svg",
      });
      homeStore.add({
        file: "wall04.svg",
        type: "image/svg",
        contents: "assets/images/wall04.svg",
      });
      homeStore.add({
        file: "wall05.svg",
        type: "image/svg",
        contents: "assets/images/wall05.svg",
      });
      homeStore.add({
        file: "wall06.svg",
        type: "image/svg",
        contents: "assets/images/wall06.svg",
      });
      homeStore.add({
        file: "wall07.svg",
        type: "image/svg",
        contents: "assets/images/wall07.svg",
      });
      homeStore.add({
        file: "wall08.svg",
        type: "image/svg",
        contents: "assets/images/wall08.svg",
      });
      homeStore.add({
        file: "wall09.svg",
        type: "image/svg",
        contents: "assets/images/wall09.svg",
      });
      homeStore.add({
        file: "wall10.svg",
        type: "image/svg",
        contents: "assets/images/wall10.svg",
      });
      // "lib"
      let libStore = db.createObjectStore("lib", {
        keyPath: "file",
      });
      // "run"
      let runStore = db.createObjectStore("run", {
        keyPath: "file",
      });
      // "tmp"
      let tmpStore = db.createObjectStore("tmp", {
        keyPath: "file",
      });
      // "var"
      let varStore = db.createObjectStore("var", {
        keyPath: "file",
      });

      console.log("Initialised DB", dbName, db);
      return resolve(db);
    };

    // Return success if the db is already there
    openDB.onsuccess = function checkedDB(event) {
      return resolve(event.target.result);
    };
  });
}

// ########################
// #                      #
// #   Helper Functions   #
// #                      #
// ########################

// Reset everything function
async function resetAll() {
  if (confirm("Are you sure you want to reset EVERYTHING")) {
    // Confirmed
    localStorage.clear();
    resetFileSystem("fileSystem");
    console.log("Cleared all data, and reset everything");
    location.reload();
  } else {
    // Cancelled
    console.log("Cancelled the deletion of all data");
  }
}

// Make window function
// adds a window to the body
// initialises:
//   css: size, position, z-index, maximisation
//   icon, title, window buttons
//   add to taskbar / window list
// uses localStorage values while doing above
// if they don't exist, makes them
async function makeWindow(id, size, position, icon, title, content) {
  // Define the window HTML
  let windowHTML = `\
  <window
    name="window_${id}"
    style="
      --x: ${position[0]}px;
      --y: ${position[1]}px;
      --width: ${size[0]}px;
      --height: ${size[1]}px;
      --z-index: ${numberOfWindows()};
      --maximised: 0;
    "
    onclick="makeMain(this)"
    id=${id}
  >
    <header class="window-header">
      <div class="fill-left">${icon}</div>
      <div>${title}</div>
      <div
        class="fill-right windowControl"
        id="window_${id}_Control"
      >${windowControls}</div>
    </header>
    ${content}
  </window>`;

  let window = document.createElement("window");
  window.setAttribute("name", "window_" + id);
  setElementCSS(window, "--x", position[0] + "px");
  setElementCSS(window, "--y", position[1] + "px");
  setElementCSS(window, "--width", size[0] + "px");
  setElementCSS(window, "--height", size[1] + "px");
  setElementCSS(window, "--z-index", numberOfWindows());
  setElementCSS(window, "--maximised", 0);
  window.addEventListener("click", () => makeMain(document.getElementById(id)));
  window.id = id;
  window.innerHTML = `\
  <header class="window-header">
    <div class="fill-left">${icon}</div>
    <div>${title}</div>
    <div
      class="fill-right windowControl"
      id="window_${id}_Control"
    >${windowControls}</div>
  </header>
  ${content}`

  // Add to document
  document.body.append(window);
  // document.body.innerHTML += windowHTML;
}

// Count the number of windows:
function numberOfWindows() {
  return document.querySelectorAll("window").length;
}

// Called when a window is clicked
async function makeMain(element) {
  if (element.children) {
  }
  document.querySelectorAll("window").forEach((el) => {
    el.className = "subWindow";
    setElementCSS(el, "--z-index", getElementCSS(el, "--z-index") - 1);
  });
  element.className = "mainWindow";
  setElementCSS(element, "--z-index", numberOfWindows()); // Set to the number of windows when adding a new window #TODO make automatic
  console.log(element.getAttribute("name"), "is main");
}

// Minimise
function minimiseWindow(element) {
  let window = element.parentElement.id.split("_");
  window.pop();
  window = document.getElementsByName(window.join("_"))[0];
  let isVisible = getElementCSS(window, "display");
  if (isVisible == "none") {
    setElementCSS(window, "display", "grid");
    console.log("Made visible:", window.getAttribute("name"));
  } else {
    setElementCSS(window, "display", "none");
    console.log("Minimised:", window.getAttribute("name"));
  }
}
// Maximise
function maximiseWindow(element) {
  let window = element.parentElement.id.split("_");
  window.pop();
  window = document.getElementsByName(window.join("_"))[0];
  let isMaximised = getElementCSS(window, "--maximised");
  if (isMaximised == 1) {
    setElementCSS(window, "translate", "var(--x) var(--y)");
    setElementCSS(window, "width", "var(--width)");
    setElementCSS(window, "height", "var(--height)");
    setElementCSS(window, "border-radius", "var(--rounding)");
    setElementCSS(window, "border", "var(--border-width) solid var(--border)");
    setElementCSS(window, "--maximised", 0);
    console.log("Restored:", window);
  } else {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    setElementCSS(
      window,
      "translate",
      "calc(0px - var(--padding)) calc(0px - var(--padding))"
    );
    setElementCSS(window, "width", width + "px");
    setElementCSS(window, "height", height + "px");
    setElementCSS(window, "border-radius", 0);
    setElementCSS(window, "border", 0);
    setElementCSS(window, "--maximised", 1);
    console.log("Maximised:", window);
  }
}

// Close
function closeWindow(element) {
  let window = element.parentElement.id.split("_");
  window.pop();
  window = document.getElementsByName(window.join("_"))[0];
  window.remove();
}

// Called when the wallpaper is changed
async function setWallpaper(args) {
  setCSS("--wallpaper", args);
  // Handle args
  args = args.split(" ");
  // Get the image
  let image = (await fsRead("fileSystem", args[0], args[1])).contents;
  setCSS("background-image", "url(" + image + ")");
  // Set the preview
  setElementCSS(
    document.getElementById("setting_wallpaper_preview"),
    "background-image",
    "url(" + image + ")"
  );
}

// Move window
function moveWindow(element, deltaX, deltaY) {
  // Move in X:
  // Calculate position
  let x = parseInt(getElementCSS(element, "--x")) + deltaX + "px";
  setElementCSS(element, "--x", x);

  // Move in Y:
  // Calculate position
  let y = parseInt(getElementCSS(element, "--y")) + deltaY + "px";
  setElementCSS(element, "--y", y);

  // Log
  // console.log(element.getAttribute("name"), "x =", x);
  // console.log(element.getAttribute("name"), "y =", y);
}

// Resize window
function resizeWindow(element, deltaWidth, deltaHeight) {
  // Resize width:
  // Calculate size
  let width = parseInt(getElementCSS(element, "--width")) + deltaWidth + "px";
  setElementCSS(element, "--width", width);

  // Resize height:
  // Calculate size
  let height =
    parseInt(getElementCSS(element, "--height")) + deltaHeight + "px";
  setElementCSS(element, "--height", height);

  // Log
  // console.log(element.getAttribute("name"), "width =", width);
  // console.log(element.getAttribute("name"), "height =", height);
}

// Key down handler
function keydown(e) {
  // Ignore when inputting text
  if (document.activeElement.matches("input")) return;

  // Get the window and its style for easy access
  let mainWindow = document.getElementsByClassName("mainWindow")[0];
  // If shifting, resize the window
  if (e.shiftKey) {
    // Manage resizing the window
    let deltaWidth = 0;
    let deltaHeight = 0;
    // Left arrow
    if (e.keyCode == 37) {
      deltaWidth -= windowResizeAmount;
    }
    // Up Arrow
    if (e.keyCode == 38) {
      deltaHeight -= windowResizeAmount;
    }
    // Right Arrow
    if (e.keyCode == 39) {
      deltaWidth += windowResizeAmount;
    }
    // Down Arrow
    if (e.keyCode == 40) {
      deltaHeight += windowResizeAmount;
    }
    // Enact resize
    resizeWindow(mainWindow, deltaWidth, deltaHeight);
  } else {
    // Manage moving the window
    let deltaX = 0;
    let deltaY = 0;
    // Left arrow
    if (e.keyCode == 37) {
      deltaX -= windowMoveAmount;
    }
    // Up Arrow
    if (e.keyCode == 38) {
      deltaY -= windowMoveAmount;
    }
    // Right Arrow
    if (e.keyCode == 39) {
      deltaX += windowMoveAmount;
    }
    // Down Arrow
    if (e.keyCode == 40) {
      deltaY += windowMoveAmount;
    }
    // Enact move
    moveWindow(mainWindow, deltaX, deltaY);
  }
}

// ###########################
// #                         #
// #   Settings management   #
// #                         #
// ###########################
// Nicknamed settings, because it can be configured

// For CSS:
// Get the value of a global css variable
function getCSS(setting) {
  // Check if the value exists
  if (localStorage.getItem(setting) == null) {
    // if not, set to the current value as declared in the css
    localStorage.setItem(
      setting,
      getComputedStyle(document.querySelector(":root")).getPropertyValue(
        setting
      )
    );
  }
  // Get the value from local storage
  let value = localStorage.getItem(setting);
  return value;
}

// Set the value of a global css variable
function setCSS(setting, value) {
  let root = document.querySelector(":root");
  root.style.setProperty(setting, value);
  localStorage.setItem(setting, value);
  // console.log(setting, "=", getCSSSetting(setting));
}

// Sync the value of the css to the settings panel
function syncCSS(setting) {
  // Get the value from local storage
  let value = getCSS(setting);
  setCSS(setting, value);
  // Set the value
  let el = document.getElementById("setting" + setting);
  if (el) {
    if (el.type == "number") {
      el.value = parseInt(value);
    } else {
      el.value = value;
    }
  }
}

// For JavaScript:
// Get the value of a variable
function getJSVariable(setting) {
  // Check if the value exists
  if (localStorage.getItem(setting) == null) {
    // if not, set to the current value as declared in the css
    localStorage.setItem(setting, (1, eval)(setting));
  }
  // Get the value from local storage
  let value = localStorage.getItem(setting);
  return value;
}

// Set the value of a variable
function setJSVariable(setting, value) {
  (1, eval)(setting + "=" + value);
  localStorage.setItem(setting, value);
  // console.log(setting, "=", getJSSetting(setting));
}

// Sync the value of the JS variable to the settings panel
function syncJSVariable(setting) {
  // Get the value from local storage
  let value = getJSVariable(setting);
  setJSVariable(setting, value);
  // Set the value
  let el = document.getElementById("setting_" + setting);
  if (el.type == "number") {
    el.value = parseInt(value);
  } else {
    el.value = value;
  }
}

// For individual elements CSS
// Get the value of an element's css variable
function getElementCSS(element, setting) {
  // Get the value from the computed style TODO: change to be the non-computed
  let value = getComputedStyle(element).getPropertyValue(setting);
  return value;
}

// Set the value of an element's css variable
function setElementCSS(element, setting, value) {
  element.style.setProperty(setting, value);
}

// Sync the value of an element's css variable
function syncElementCSS(element, setting) {
  // Get and set the setting to sync
  let value = getElementCSS(element, setting);
  setElementCSS(element, setting, value);
}

// #########################
// #                       #
// #    File Management    #
// #                       #
// #########################
// File system is stored in "IndexedDB"
// Functions to:
//  |- (checking/listing) => Get DBs, Get Stores, Get Objects, Get Complete Index
//  |- (access/modify files) => Read, Write, Create, Delete
//  |- (access/modify stores) => Create Store, Delete Store, Rename Store?
//  |- (access/modify db) => Create DB, Delete DB, Rename DB?
//
// Filenames cannot have the characters `"'\:~
// Example of regular filesystem in home store
//  |- file_in_root                  => |- file_in_root
//  |- folder                        => |- folder
//  |  |- file_in_folder             => |- folder/file_in_folder
//  |- folder_file_with_similar_name => |- folder_file_with_similar_name
//
// only access/modify db when adding/maintaining extra filesystems, because why not
// access/modify stores as part of the filesystem
//
// Each of these functions will depend on some lower-level raw functions,
// added when there is too much boilerplate code, or stuff gets hard to read.

// ##########################################################################
// #                                                                        #
// #  Top level rough folder structure:                                     #
// #   Theses are the objectStores under:                                   #
// #    fileSystem: // The actual database                                  #
// #      |- bin    // Programs that can be run by the Web OS               #
// #      |- dev    // Devices, virtual and network                         #
// #      |- etc    // Configuration files                                  #
// #      |- home   // User home folder                               #
// #      |- lib    // program libraries                                    #
// #      |- run    // Running app state files, and inter app communication #
// #      |- tmp    // Files that can be deleted at any time                #
// #      |- var    // Variable storage for between boot app/game data      #
// #                                                                        #
// ##########################################################################

// ######################
// #                    #
// #   File Functions   #
// #                    #
// ######################
// Reset everything:
function resetFileSystem(dbName) {
  // Resets the database to the default state:

  // Delete the entire database
  indexedDB.deleteDatabase(dbName);
  console.log("Deleted DB", dbName);
}

// Common/Raw functions:
// Open data base fileSystem
async function openDB(dbName) {
  return new Promise(function openDBPromise(resolve) {
    let request = indexedDB.open(dbName);

    request.onsuccess = function openDBSuccess(event) {
      // Success, return the resolve or it won't work
      return resolve(event.target.result);
    };
    request.onerror = function openDBError(event) {
      console.error("Error opening the database:", event.target.error);
      return reject(event.target.error);
    };
  });
}
// Open store from passed in database and store name
async function openStore(db, store, mode) {
  // Opens the DB in mode (i.e. readonly)
  // TODO: discover what else the mode can be
  // TODO: check that the store exists before crashing the terminal
  if (db.objectStoreNames.contains(store)) {
    let tx = db.transaction(store, mode);
    let objectStore = tx.objectStore(store);
    // return the objectStore
    return objectStore;
  } else {
    console.error("Store", store, "doesn't exist in db", db);
  }
}
// Convert a local path to an absolute path
async function getAbsolutePath(path) {
  // Use the env_pwd
  if (env_pwd[1] == "") {
    return (env_pwd[0] + " " + path.join(" ")).split(" ");
  } else {
    return (env_pwd[0] + " " + env_pwd[1] + "/" + path.join(" ")).split(" ");
  }
}

// Listing and indexing operations:
// Get DBs:
async function fsListDBs() {
  // Return an async function to await
  return indexedDB.databases();
}
// Get Stores:
async function fsListStores(dbName) {
  // Get the db
  let db = await openDB(dbName);

  // return a list of the stores
  return db.objectStoreNames;
}
// Get Objects:
async function fsListObjects(dbName, store, path) {
  // Get the db
  let db = await openDB(dbName);

  // Get the object store
  let objectStore = await openStore(db, store, "readonly");

  return new Promise(function fsListObjectsPromise(resolve) {
    // Make the query based on the directory
    let request;
    if (path) {
      request = objectStore.getAllKeys(
        IDBKeyRange.bound(path + "/", path + ":")
      );
    } else {
      request = objectStore.getAllKeys();
    }

    request.onsuccess = function fsListObjectsSuccess(event) {
      // Return the success value
      return resolve(event.target.result);
    };

    request.onerror = function fsListObjectError(event) {
      // Log and return the error
      console.error("Error listing objects", event.target.error);
      return reject(event.target.error);
    };
  });
}

// Key Pair operations:
// Read:
// Reads an object from the IndexedDB.
// Returns as an object variable
async function fsRead(dbName, store, file) {
  // Store is the top level "folder" to look in.
  // File is the key which points to the object.

  // Open the database
  let db = await openDB(dbName);

  // Get the object store for easy access
  // db, store to open, and mode to open with
  let objectStore = await openStore(db, store, "readonly");

  // Get the object at file, ignoring path for now
  let object = await new Promise(function dbGetObjectPromise(resolve) {
    // Get an object from the object store
    let getRequest = objectStore.get(file);

    getRequest.onsuccess = function dbGetObjectSuccess(event) {
      // Success, return the object
      return resolve(event.target.result);
    };

    getRequest.onerror = function dbGetObjectError(event) {
      console.error(
        "Error getting file",
        file,
        "from objectStore",
        objectStore,
        "\nError:",
        event.target.error
      );
      return reject(event.target.error);
    };
  });

  // Return the object
  return object;
}

// Write:
// Modifies the object in the IndexedDB
async function fsWrite(dbName, store, object) {
  // dbName is the database to use as the fileSystem
  // Store is the top level "folder" to look in
  // File is the key which points to the object
  // Type is either directory or file
  // Contents is the new contents of the file

  // Open the database
  let db = await openDB(dbName);

  // Get the object store for easy access
  // db, store to open, and mode to open with
  let objectStore = await openStore(db, store, "readwrite");

  // Will overwrite the file if it exists
  let result = await new Promise(function dbPutObjectPromise(resolve) {
    // Put an object into the objectStore
    let putRequest = objectStore.put(object);

    putRequest.onsuccess = function dbPutObjectSuccess(event) {
      // Success
      return resolve(event.target.result);
    };

    putRequest.onerror = function dbPutObjectError(event) {
      console.error(
        "Error putting object",
        object,
        "into objectStore",
        objectStore,
        "\nError:",
        event.target.error
      );
      return reject(event.target.error);
    };
  });

  // Do stuff with the returned object
  return result;
}
// Temporary Terminal wrapper
async function fsw(args) {
  // Handle args
  args = args.split(" ");
  let store = args[0];
  args.shift();
  let object = JSON.parse(args.join(" "));
  console.log("Running fsWrite with args:", "fileSystem", store, object);
  // execute
  await fsWrite("fileSystem", store, object);
  let result = await fsRead("fileSystem", store, object.file);
  // Output to terminal
  return JSON.stringify(result);
}

// Delete:
// Deletes an object from the IndexedDB
async function fsDelete(dbName, store, file) {
  // dbName is the database to use as the fileSystem
  // Store is the top level "folder" to look in
  // File is the key which points to the object

  // Open the database
  let db = await openDB(dbName);

  // Get the object store for easy access
  // db, store to open, and mode to open with
  let objectStore = await openStore(db, store, "readwrite");

  // Delete the file
  let object = await new Promise(function deleteObjectPromise(resolve) {
    let deleteRequest = objectStore.delete(file);

    deleteRequest.onsuccess = function deleteObjectSuccess(event) {
      // Successfully deleted
      return resolve(event.target.result);
    };

    deleteRequest.onerror = function deleteObjectError(event) {
      console.error(
        "Error deleting file",
        file,
        "from objectStore",
        objectStore,
        "\nError:",
        event.target.error
      );
      return reject(event.target.error);
    };
  });

  // Return
  return object;
}

// ###############################
// #                             #
// #   Terminal implementation   #
// #                             #
// ###############################
let allowed_commands = [
  "help",
  "ls",
  "clear",
  "echo",
  "loop",
  "neofetch",
  "cat",
  "pwd",
  "fsw",
  "rm",
  "cd",
  "open",
];
// Environment variables
let env_pwd = ["home", ""];
// Define the dynamic prompt
function calc_prompt() {
  return [
    `<span style='color: var(--t-blue)' >`,
    env_pwd.join(" "),
    `</span><br /><span style='color: var(--t-green)' >❯</span> <input name='terminal_input' type='text' onchange='runCommand(this.parentElement, this.value)'/>`,
  ].join("");
}
// Run Command
async function runCommand(whichTerminal, input_args) {
  // Duplicate input so that it can be used later
  let raw_input = input_args;

  // Convert into command and args
  input_args = input_args.split(" ");
  let command = input_args[0];
  input_args.shift();
  let args = input_args.join(" ");

  // Handle special case for CLEAR function (removes all text in the terminal)
  if (command == "clear") {
    whichTerminal.innerHTML = calc_prompt();
    // Refocus input
    whichTerminal.children.namedItem("terminal_input").focus();
    // document.getElementById("terminal_input").focus();
    return;
  }

  // Define the output of the command for use later
  let result;

  // Run the command if it exists
  if (allowed_commands.includes(command)) {
    // Log
    console.log("Running", command + "(`" + args + "`)");
    // Run with eval
    result = await (1, eval)(command + "(`" + args + "`)");
  } else {
    // The command isn't available
    result =
      "`" +
      command +
      "` is not available, use `help` to see a list of commands.";
  }

  // Once output is guaranteed, remove the input field
  whichTerminal.children.namedItem("terminal_input").remove();

  // Output the input, the result, and remake the prompt
  whichTerminal.innerHTML =
    whichTerminal.innerHTML +
    raw_input +
    "<br />" +
    result +
    "<br />" +
    calc_prompt();
  // Refocus input
  whichTerminal.children.namedItem("terminal_input").focus();
}

// #####################################################
// #                                                   #
// #                Terminal  Functions                #
// #                                                   #
// #   Make a function for each command implemented.   #
// #                                                   #
// #####################################################

// HELP function (lists all available commands)
async function help(_args) {
  return allowed_commands.join("<br />");
}

// LS function (lists directories in current directory)
async function ls(_args) {
  return (await fsListObjects("fileSystem", env_pwd[0], env_pwd[1])).join(
    "<br />"
  );
}

// ECHO function (prints input text)
async function echo(args) {
  return args;
}

// LOOP function (repeats the function contained for the specified number of times)
async function loop(input_args) {
  input_args = input_args.split(" ");
  let number = input_args[0];
  input_args.shift();
  // Convert into command and args
  let command = input_args[0];
  input_args.shift();
  let args = input_args.join(" ");

  // Define output
  let result;

  // Check if the command exists
  if (allowed_commands.includes(command)) {
    // Log
    console.log(
      "Running",
      command + "(`" + args + "`)" + " This many times: " + number
    );
    // Run the command the specified number of times
    for (let i = 0; i < number; i++) {
      // Log
      console.log("Running", command + "(`" + args + "`)" + "Number: " + i);
      // Run with eval
      result += await (1, eval)(command + "(`" + args + "`)");
    }
  } else {
    // The command isn't available
    result =
      "`" +
      command +
      "` is not available, use `help` to see a list of commands.";
  }
  // Return
  return result;
}

// NEO FETCH function (fancy system info display and shows distro)
async function neofetch(_args) {
  return "Your Browser: " + window.navigator.userAgent;
}

// RM function (deletes files from fileSystem)
async function rm(args) {
  // Handle args
  args = args.split(" ");
  if (args.length <= 1) {
    args = await getAbsolutePath(args);
  }
  console.log("Running fsDelete with args:", args);
  // execute
  let result = await fsDelete("fileSystem", args[0], args[1]);
  if (result == undefined) {
    // Output to terminal
    return "Deleted `" + args[0] + " " + args[1] + "` from fileSystem";
  } else {
    // Output to terminal
    return "Failed to delete `" + args[0] + "/" + args[1] + "` from fileSystem";
  }
}

// CAT function (shows the text in a file)
async function cat(args) {
  if (args) {
    // Handle args
    args = args.split(" ");
    console.log("unprocessed args:", args);
    if (args.length <= 1) {
      args = await getAbsolutePath(args);
    }
    console.log("processed args:", args);
    console.log("Running fsRead with args:", "fileSystem", args[0], args[1]);
    // execute
    let result = await fsRead("fileSystem", args[0], args[1]);
    return result.contents;
  } else {
    return "No file selected";
  }
}

// PWD function (shows the current path)
async function pwd(_args) {
  return env_pwd.join(" ");
}

// CD function (changes current directory)
async function cd(args) {
  args = args.split(" ");
  let store = args[0];
  args.shift();
  let path = args.join(" ");
  // Set the path
  env_pwd = [store, path];
  return "";
}

// OPEN function (opens a new window with from the specified content)
async function open(args) {
  if (args) {
    // Handle args
    args = args.split(" ");
    console.log("unprocessed args:", args);
    if (args.length <= 1) {
      args = await getAbsolutePath(args);
    }
    console.log("processed args:", args);
    console.log("Running fsRead with args:", "fileSystem", args[0], args[1]);
    // execute
    let result = await fsRead("fileSystem", args[0], args[1]);
    let title = result.app.title;
    let icon = result.app.icon;
    let size = result.app.size;
    let position = result.app.position;
    let content = result.contents;
    currentID += 1;
    await makeWindow(currentID, size, position, icon, title, content);
    return "Successfully opened", result.file;
  }
}

// RESET TERMINAL function (debug to reset selected terminal from the browser console)
function resetTerminal(element) {
  element.innerHTML = calc_prompt();
}

init();
