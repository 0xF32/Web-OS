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
  // Done
  console.log("Init done!");
}

function makeMain(element) {
  document.querySelectorAll("window").forEach((el) => {
    el.id = "subWindow";
    el.style.setProperty(
      "--z-index",
      parseInt(getComputedStyle(el).getPropertyValue("--z-index")) - 1
    );
  });
  element.id = "mainWindow";
  element.style.setProperty("--z-index", 4); // Set to the number of windows when adding a new window #TODO make automatic
  console.log(element.getAttribute("name"), "is main");
}

function keydown(e) {
  if (document.getElementById("terminal_input") == document.activeElement)
    return;
  // Get the window and its style for easy access
  let mainWindow = document.getElementById("mainWindow");
  let mainWindowStyle = getComputedStyle(mainWindow);
  if (e.shiftKey) {
    // Manage resizing the window
    // Left arrow
    if (e.keyCode == 37) {
      let width = parseInt(mainWindowStyle.getPropertyValue("--width"));
      width -= windowResizeAmount;
      width += "px";
      mainWindow.style.setProperty("--width", width);
      console.log(mainWindow.getAttribute("name"), "width =", width);
    }
    // Up Arrow
    if (e.keyCode == 38) {
      let height = parseInt(mainWindowStyle.getPropertyValue("--height"));
      height -= windowResizeAmount;
      height += "px";
      mainWindow.style.setProperty("--height", height);
      console.log(mainWindow.getAttribute("name"), "height =", height);
    }
    // Right Arrow
    if (e.keyCode == 39) {
      let width = parseInt(mainWindowStyle.getPropertyValue("--width"));
      width += windowResizeAmount;
      width += "px";
      mainWindow.style.setProperty("--width", width);
      console.log(mainWindow.getAttribute("name"), "width =", width);
    }
    // Down Arrow
    if (e.keyCode == 40) {
      let height = parseInt(mainWindowStyle.getPropertyValue("--height"));
      height += windowResizeAmount;
      height += "px";
      mainWindow.style.setProperty("--height", height);
      console.log(mainWindow.getAttribute("name"), "height =", height);
    }
  } else {
    // Manage moving the window
    // Left arrow
    if (e.keyCode == 37) {
      let x = parseInt(mainWindowStyle.getPropertyValue("--x"));
      x -= windowMoveAmount;
      x += "px";
      mainWindow.style.setProperty("--x", x);
      console.log(mainWindow.getAttribute("name"), "x =", x);
    }
    // Up Arrow
    if (e.keyCode == 38) {
      let y = parseInt(mainWindowStyle.getPropertyValue("--y"));
      y -= windowMoveAmount;
      y += "px";
      mainWindow.style.setProperty("--y", y);
      console.log(mainWindow.getAttribute("name"), "y =", y);
    }
    // Right Arrow
    if (e.keyCode == 39) {
      let x = parseInt(mainWindowStyle.getPropertyValue("--x"));
      x += windowMoveAmount;
      x += "px";
      mainWindow.style.setProperty("--x", x);
      console.log(mainWindow.getAttribute("name"), "x =", x);
    }
    // Down Arrow
    if (e.keyCode == 40) {
      let y = parseInt(mainWindowStyle.getPropertyValue("--y"));
      y += windowMoveAmount;
      y += "px";
      mainWindow.style.setProperty("--y", y);
      console.log(mainWindow.getAttribute("name"), "y =", y);
    }
  }
}

// ###########################
// #                         #
// #   Settings management   #
// #                         #
// ###########################

// Get the value of a global css variable
// Nicknamed settings, so that it can be configured
function getCSSSetting(setting) {
  let value = getComputedStyle(
    document.querySelector(":root")
  ).getPropertyValue(setting);
  return value;
}

// Set the value of a global css variable
function setCSSSetting(setting, value) {
  let root = document.querySelector(":root");
  root.style.setProperty(setting, value);
  console.log(setting, "=", getCSSSetting(setting));
}

// Sync the value of the css to the settings panel
function syncCSSSetting(setting) {
  let value = getComputedStyle(
    document.querySelector(":root")
  ).getPropertyValue(setting);
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
  return (1, eval)(setting);
}

// Set the value of a variable
function setJSSetting(setting, value) {
  (1, eval)(setting + "=" + value);
  console.log(setting, "=", getJSSetting(setting));
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
// #      |- {usr}  // User {usr} home folder                               #
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

  // Recreate
  // Open the database
  let db = await openDB(dbName);

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
}
// Raw:
// Open data base fileSystem
async function openDB(dbName) {
  return new Promise(function (resolve) {
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
  let tx = db.transaction(store, mode);
  let objectStore = tx.objectStore(store);
  // return the objectStore
  return objectStore;
}
// Get an object from the object store
async function dbGetObject(objectStore, object) {
  return new Promise(function dbGetObjectPromise(resolve) {
    let getRequest = objectStore.get(object);

    getRequest.onsuccess = function dbGetObjectSuccess(event) {
      // Success, return the object
      return resolve(event.target.result);
    };

    getRequest.onerror = function dbGetObjectError(event) {
      console.error(
        "Error getting object",
        object,
        "from objectStore",
        objectStore,
        "\nError:",
        event.target.error
      );
      return reject(event.target.error);
    };
  });
}
// Put an object into the objectStore
async function dbPutObject(objectStore, object) {
  return new Promise(function dbPutObjectPromise(resolve) {
    let putRequest = objectStore.put(object);

    putRequest.onsuccess = function dbPutObjectSuccess(event) {
      // Success
      console.log("Put succeeded:", event.target.result);
      return resolve(event.target.result);
    };

    putRequest.onerror = function dbPutObjectError(event) {
      console.error(
        "Error putting object",
        object,
        "to objectStore",
        objectStore,
        "\nError:",
        event.target.error
      );
      return reject(event.target.error);
    };
  });
}

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
  let object = await dbGetObject(objectStore, file);

  // Return the object
  return object;
}
// Terminal wrapper
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
  let object = await dbPutObject(objectStore, {
    file: file,
    type: type,
    contents: contents,
  });

  // Do stuff with the returned object
  return object;
}
// Terminal wrapper
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
  let result = await fsWrite("fileSystem", store, file, type, contents);
  console.log("Result is:", result);
  // Output to terminal
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    JSON.stringify(result) +
    "<br />";
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
