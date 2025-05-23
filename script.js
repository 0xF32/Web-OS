let windowMoveAmount = 10;
let windowResizeAmount = 10;

function init() {
  // Resets the terminal using the necessary JS vars
  reset_terminal();
  // Global key listener
  document.addEventListener("keydown", keydown, false);
  // Sync all the css settings to the settings panel
  syncCSSSetting("--theme-main");
  syncCSSSetting("--theme-main-mono");
  syncCSSSetting("--theme-bg");
  syncCSSSetting("--theme-bg-alt");
  syncCSSSetting("--theme-bg-alt2");
  syncCSSSetting("--border");
  syncCSSSetting("--border-width");
  syncCSSSetting("--shadow");
  syncCSSSetting("--shadow-distance");
  syncCSSSetting("--shadow-blur");
  syncCSSSetting("--inner-shadow");
  syncCSSSetting("--inner-shadow-distance");
  syncCSSSetting("--inner-shadow-blur");
  syncCSSSetting("--rounding");
  syncCSSSetting("--padding");
  syncCSSSetting("--bg-blur");
  // Sync all the JS settings to the settings panel
  syncJSSetting("windowMoveAmount");
  syncJSSetting("windowResizeAmount");
  // Sync Window states:
  document.querySelectorAll("window").forEach((el) => {
    syncElementCSSSetting(el, "--x");
    syncElementCSSSetting(el, "--y");
    syncElementCSSSetting(el, "--width");
    syncElementCSSSetting(el, "--height");
    syncElementCSSSetting(el, "--z-index");
  });
  // Done
  console.log("Init done!");
}

// ########################
// #                      #
// #   Helper Functions   #
// #                      #
// ########################

// Called when a window is clicked
function makeMain(element) {
  document.querySelectorAll("window").forEach((el) => {
    el.id = "subWindow";
    setElementCSSSetting(
      el,
      "--z-index",
      parseInt(getElementCSSSetting(el, "--z-index")) - 1 + "px"
    );
  });
  element.id = "mainWindow";
  setElementCSSSetting(element, "--z-index", 4); // Set to the number of windows when adding a new window #TODO make automatic
  console.log(element.getAttribute("name"), "is main");
}

// Move window
function moveWindow(element, deltaX, deltaY) {
  // Move in X:
  // Calculate position
  let x = parseInt(getElementCSSSetting(element, "--x")) + deltaX + "px";
  setElementCSSSetting(element, "--x", x);

  // Move in Y:
  // Calculate position
  let y = parseInt(getElementCSSSetting(element, "--y")) + deltaY + "px";
  setElementCSSSetting(element, "--y", y);

  // Log
  console.log(element.getAttribute("name"), "x =", x);
  console.log(element.getAttribute("name"), "y =", y);
}

// Resize window
function resizeWindow(element, deltaWidth, deltaHeight) {
  // Resize width:
  // Calculate size
  let width =
    parseInt(getElementCSSSetting(element, "--width")) + deltaWidth + "px";
  setElementCSSSetting(element, "--width", width);

  // Resize height:
  // Calculate size
  let height =
    parseInt(getElementCSSSetting(element, "--height")) + deltaHeight + "px";
  setElementCSSSetting(element, "--height", height);

  // Log
  console.log(element.getAttribute("name"), "width =", width);
  console.log(element.getAttribute("name"), "height =", height);
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
function getCSSSetting(setting) {
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
function setCSSSetting(setting, value) {
  let root = document.querySelector(":root");
  root.style.setProperty(setting, value);
  localStorage.setItem(setting, value);
  console.log(setting, "=", getCSSSetting(setting));
}

// Sync the value of the css to the settings panel
function syncCSSSetting(setting) {
  // Get the value from local storage
  let value = getCSSSetting(setting);
  setCSSSetting(setting, value);
  // Set the value
  let el = document.getElementById("setting" + setting);
  if (el.type == "number") {
    el.value = parseInt(value);
  } else {
    el.value = value;
  }
}

// For JavaScript:
// Get the value of a variable
function getJSSetting(setting) {
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
function setJSSetting(setting, value) {
  (1, eval)(setting + "=" + value);
  localStorage.setItem(setting, value);
  console.log(setting, "=", getJSSetting(setting));
}

// Sync the value of the JS variable to the settings panel
function syncJSSetting(setting) {
  // Get the value from local storage
  let value = getJSSetting(setting);
  setJSSetting(setting, value);
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
function getElementCSSSetting(element, setting) {
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
function setElementCSSSetting(element, setting, value) {
  element.style.setProperty(setting, value);
  localStorage.setItem(element.getAttribute("name") + setting, value);
  console.log(
    element.getAttribute("name") + setting,
    "=",
    getElementCSSSetting(element, setting)
  );
}

// Sync the value of an element's css variable to and from local storage
function syncElementCSSSetting(element, setting) {
  // Get the value from local storage
  let value = getElementCSSSetting(element, setting);
  setElementCSSSetting(element, setting, value);
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

  // Recreate default stores
  return new Promise(function recreateDBPromise(resolve) {
    // Open the database
    let openDB = indexedDB.open(dbName);
    console.log("Reopened DB", dbName);

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
      // "etc"
      let etcStore = db.createObjectStore("etc", {
        keyPath: "file",
      });
      // "home"
      let homeStore = db.createObjectStore("home", {
        keyPath: "file",
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

      console.log(db);
    };
  });
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
  }
}

// Listing and indexing operations:
//

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
// Temporary Terminal wrapper
async function fsr(args) {
  // Handle args
  args = args.split(" ");
  console.log("Running fsRead with args:", args);
  // execute
  let result = await fsRead("fileSystem", args[0], args[1]);
  console.log("Result is:", result);
  // Output to terminal
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    JSON.stringify(result) +
    "<br />";
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
  console.log("Put object", object);
  let result = await fsRead("fileSystem", store, file);
  // Output to terminal
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    JSON.stringify(result) +
    "<br />";
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
// Terminal wrapper
async function rm(args) {
  // Handle args
  args = args.split(" ");
  console.log("Running fsDelete with args:", args);
  // execute
  let result = await fsDelete("fileSystem", args[0], args[1]);
  if (result == undefined) {
    // Output to terminal
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "Deleted `" +
      args[0] +
      "/" +
      args[1] +
      "` from fileSystem" +
      "<br />";
  } else {
    // Output to terminal
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "Failed to delete `" +
      args[0] +
      "/" +
      args[1] +
      "` from fileSystem" +
      "<br />";
  }
}

// ###############################
// #                             #
// #   Terminal implementation   #
// #                             #
// ###############################
// TODO: make async, so as to not cause massive lag
const prompt =
  "<span style='color: var(--t-blue)' >~</span><br /><span style='color: var(--t-green)' >❯</span> <input id='terminal_input' type='text' onchange='runCommand(this.value)'/>";
let available_commands = [
  "help",
  "ls",
  "clear",
  "echo",
  "loop",
  "neofetch",
  "image",
  "cat",
  "pwd",
  "fsr",
  "fsw",
  "rm",
];
// Run Command
async function runCommand(value) {
  // Handle enter
  document.getElementById("terminal_input").remove();
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML + value + "<br />";
  // Convert into command and args
  value = value.split(" ");
  let command = value[0];
  value.shift();
  let args = value.join(" ");
  // Check if the command exists
  if (available_commands.includes(command)) {
    // Log
    console.log("Running", command + "(`" + args + "`)");
    // Run with eval
    await (1, eval)(command + "(`" + args + "`)");
  } else {
    // The command isn't available
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "`" +
      command +
      "` is not available, use `help` to see a list of commands.<br />";
  }
  // Once the command is finished, show the prompt again
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML + prompt;
  // Refocus input
  document.getElementById("terminal_input").focus();
}

// Make a function for each command implemented.

// HELP function (lists all available commands)
async function help(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    available_commands.join("<br />") +
    "<br />";
}

// LS function (lists directories in current directory)
async function ls(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML;
}

// CLEAR function (removes all text in the terminal)
async function clear(_args) {
  document.getElementById("active_terminal").innerHTML = "";
}

// ECHO function (prints input text)
async function echo(args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML + args + "<br />";
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
  // Check if the command exists
  if (available_commands.includes(command)) {
    // Log
    console.log("Running", command + "(`" + args + "`)");
    // Run the command the specified number of times
    for (let i = 0; i < number; i++) {
      // Log
      console.log("Running", command + "(`" + args + "`)");
      // Run with eval
      await (1, eval)(command + "(`" + args + "`)");
    }
  } else {
    // The command isn't available
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "`" +
      command +
      "` is not available, use `help` to see a list of commands.<br />";
  }
}

// NEO FETCH function (fancy system info display and shows distro)
async function neofetch(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    "Your Browser: " +
    window.navigator.userAgent +
    "<br />";
}

// IMAGE function (shows an image in the terminal)
async function image(args) {
  if (args == "") {
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "No Image Path specified.<br />";
  } else {
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "<img src='" +
      args +
      "' style='max-width: 100%;'/><br />";
  }
}

// CAT function (shows the text in a file)
async function cat(args) {
  if (args == "") {
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "No file selected<br />";
  } else {
    document.getElementById("active_terminal").innerHTML =
      document.getElementById("active_terminal").innerHTML +
      "<pre>" +
      args +
      "</pre><br />";
  }
}

// PWD function (shows the current path)
async function pwd(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML + "~<br />";
}

// RESET TERMINAL function (debug to reset the terminal from the browser console)
function reset_terminal() {
  document.getElementById("active_terminal").innerHTML = prompt;
}
