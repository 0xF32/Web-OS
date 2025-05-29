let windowMoveAmount = 10;
let windowResizeAmount = 10;
window.indexedDB;

async function init() {
  // Init the IndexedDB
  await initFS("fileSystem");
  // Resets the terminal using the necessary JS vars
  reset_terminal();
  // Global key listener
  document.addEventListener("keydown", keydown, false);
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
  // Sync Window states:
  document.querySelectorAll("window").forEach((el) => {
    syncElementCSS(el, "--x");
    syncElementCSS(el, "--y");
    syncElementCSS(el, "--width");
    syncElementCSS(el, "--height");
    syncElementCSS(el, "--z-index");
    syncElementCSS(el, "--maximised");
    syncElementCSS(el, "display");
    syncElementCSS(el, "translate");
    syncElementCSS(el, "width");
    syncElementCSS(el, "height");
    syncElementCSS(el, "border-radius");
    syncElementCSS(el, "border");
  });
  // Set the wallpaper
  await setWallpaper(getCSS("--wallpaper"));

  // Add window control elements to the inside of the tag
  document.querySelectorAll(".windowControl").forEach((el) => {
    el.innerHTML = `<button class="window-button min-button" onclick="minimiseWindow(this)">
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
      <button class="window-button close-button">
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
  });

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
        file: "terminal_help.txt",
        type: "file",
        contents:
          "<br />Welcome to the terminal help, a quick guide that lists the syntax of the available commands.<br /><br />help :: no args :: shows a list of commands<br />ls :: no args :: lists the files in the current path <br />clear :: no args :: clears the output of the terminal<br />echo :: dumbly prints all of the text following 'echo '<br />loop {amount} {command} :: dumbly loops the command for the amount specified, can be nested<br />neofetch :: no args :: prints browser info<br />cat {store} {file} :: outputs the contents of the file<br />pwd :: outputs the current path<br />fsw {store} {file} {type} {contents} :: writes the file to the store with the type and contents provided<br />rm {store} {file} :: deletes the file from the store<br /><br />More to be added soon!<br />",
      });
      homeStore.add({
        file: "welcome.txt",
        type: "file",
        contents:
          "<br />Hello World!<br /><br />Welcome to Web OS, read the Hello World window for more information.<br />To learn how to use the terminal, run the command: <code>`cat home terminal_help.txt`</code><br />",
      });
      homeStore.add({
        file: "wall1.jpg",
        type: "file",
        contents: "assets/images/wall1.jpg",
      });
      homeStore.add({
        file: "Leaves.jpg",
        type: "file",
        contents:
          "https://cdn.prod.website-files.com/5ecba1656554083399a29f0b/5f0ef22c2aa9f8f4fe075a55_daniel-hjalmarsson-567159-unsplash.jpg",
      });
      homeStore.add({
        file: "Malefor.jpg",
        type: "file",
        contents:
          "https://gitlab.com/garuda-linux/themes-and-settings/artwork/garuda-wallpapers/-/raw/9982951df13614bf9aa1471adcde9e811d34ce94/src/garuda-wallpapers/Malefor.jpg",
      });
      homeStore.add({
        file: "abstract-swirls.jpg",
        type: "file",
        contents:
          "https://raw.githubusercontent.com/orangci/walls-catppuccin-mocha/master/abstract-swirls.jpg",
      });
      homeStore.add({
        file: "dark-star.jpg",
        type: "file",
        contents:
          "https://raw.githubusercontent.com/orangci/walls-catppuccin-mocha/master/dark-star.jpg",
      });
      homeStore.add({
        file: "wall1.svg",
        type: "file",
        contents: "assets/images/wall1.svg",
      });
      homeStore.add({
        file: "wall2.svg",
        type: "file",
        contents: "assets/images/wall2.svg",
      });
      homeStore.add({
        file: "wall3.svg",
        type: "file",
        contents: "assets/images/wall3.svg",
      });
      homeStore.add({
        file: "wall4.svg",
        type: "file",
        contents: "assets/images/wall4.svg",
      });
      homeStore.add({
        file: "wall5.svg",
        type: "file",
        contents: "assets/images/wall5.svg",
      });
      homeStore.add({
        file: "wall6.svg",
        type: "file",
        contents: "assets/images/wall6.svg",
      });
      homeStore.add({
        file: "wall7.svg",
        type: "file",
        contents: "assets/images/wall7.svg",
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
  if (confirm("Are you sure you want to continue")) {
    // Confirmed
    resetFileSystem("fileSystem");
    localStorage.clear();
    console.log("Cleared all data, and reset everything");
    location.reload();
  } else {
    // Cancelled
    console.log("Cancelled the deletion of all data");
  }
}

// Called when a window is clicked
function makeMain(element) {
  document.querySelectorAll("window").forEach((el) => {
    el.id = "subWindow";
    setElementCSS(el, "--z-index", getElementCSS(el, "--z-index") - 1);
  });
  element.id = "mainWindow";
  setElementCSS(element, "--z-index", 5); // Set to the number of windows when adding a new window #TODO make automatic
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
  let mainWindow = document.getElementById("mainWindow");
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
  // Check if the value exists
  if (localStorage.getItem(element.getAttribute("name") + setting) == null) {
    // if not, set to the current value as declared in the css
    localStorage.setItem(
      element.getAttribute("name") + setting,
      getComputedStyle(element).getPropertyValue(setting)
    );
  }
  // Get the value from local storage
  let value = localStorage.getItem(element.getAttribute("name") + setting);
  return value;
}

// Set the value of an element's css variable
function setElementCSS(element, setting, value) {
  element.style.setProperty(setting, value);
  localStorage.setItem(element.getAttribute("name") + setting, value);
  // console.log(
  //   element.getAttribute("name") + setting,
  //   "=",
  //   getElementCSSSetting(element, setting)
  // );
}

// Sync the value of an element's css variable to and from local storage
function syncElementCSS(element, setting) {
  // Get the value from local storage
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
async function resetFileSystem(dbName) {
  // Resets the database to the default state:

  // Delete the entire database
  indexedDB.deleteDatabase(dbName);
  console.log("Deleted DB", dbName);

  // Re-initialise the DB
  await initFS();
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
async function fsWrite(dbName, store, file, type, contents) {
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
  let object = await new Promise(function dbPutObjectPromise(resolve) {
    // Put an object into the objectStore
    let putRequest = objectStore.put({
      file: file,
      type: type,
      contents: contents,
    });

    putRequest.onsuccess = function dbPutObjectSuccess(event) {
      // Success
      return resolve(event.target.result);
    };

    putRequest.onerror = function dbPutObjectError(event) {
      console.error(
        "Error putting file",
        file,
        "to objectStore",
        objectStore,
        "\nError:",
        event.target.error
      );
      return reject(event.target.error);
    };
  });

  // Do stuff with the returned object
  return object;
}
// Temporary Terminal wrapper
async function fsw(args) {
  // Handle args
  args = args.split(" ");
  let store = args[0];
  let file = args[1];
  let type = args[2];
  args.shift();
  args.shift();
  args.shift();
  let contents = args.join(" ");
  console.log(
    "Running fsWrite with args:",
    "fileSystem",
    store,
    file,
    type,
    contents
  );
  // execute
  let object = await fsWrite("fileSystem", store, file, type, contents);
  let result = await fsRead("fileSystem", store, file);
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
  "image",
  "cat",
  "pwd",
  "fsw",
  "rm",
  "cd",
];
// Environment variables
let env_pwd = ["home", ""];
// Define the dynamic prompt
function calc_prompt() {
  return [
    `<span style='color: var(--t-blue)' >`,
    env_pwd.join(" "),
    `</span><br /><span style='color: var(--t-green)' >❯</span> <input id='terminal_input' type='text' onchange='runCommand(this.value)'/>`,
  ].join("");
}
// Run Command
async function runCommand(input_args) {
  // Duplicate input so that it can be used later
  let raw_input = input_args;

  // Convert into command and args
  input_args = input_args.split(" ");
  let command = input_args[0];
  input_args.shift();
  let args = input_args.join(" ");

  // Handle special case for CLEAR function (removes all text in the terminal)
  if (command == "clear") {
    document.getElementById("active_terminal").innerHTML = calc_prompt();
    // Refocus input
    document.getElementById("terminal_input").focus();
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
  document.getElementById("terminal_input").remove();

  // Output the input, the result, and remake the prompt
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    raw_input +
    "<br />" +
    result +
    "<br />" +
    calc_prompt();
  // Refocus input
  document.getElementById("terminal_input").focus();
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

// RESET TERMINAL function (debug to reset the terminal from the browser console)
function reset_terminal() {
  document.getElementById("active_terminal").innerHTML = calc_prompt();
}
