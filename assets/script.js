let windowMoveAmount = 10;
let windowResizeAmount = 10;

function init() {
  document.addEventListener("keydown", keydown, false);
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

// Get the value of a global css variable
// Nicknamed settings, so that it can be configured
function getCSSSetting(setting) {
  let rootStyle = getComputedStyle(document.querySelector(":root"));
  let value = rootStyle.getPropertyValue(setting);
  return value;
}

// Set the value of a global css variable
function setCSSSetting(setting, value) {
  let root = document.querySelector(":root");
  root.style.setProperty(setting, value);
  console.log(setting, "=", getCSSSetting(setting));
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

// Terminal implementation
const prompt =
  "~ ||> <input id='terminal_input' type='text' onchange='runCommand(this.value)'/>";
let available_commands = ["help", "ls", "clear", "echo", "loop", "neofetch"];
// Run Command
function runCommand(value) {
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
    console.log("Running", command + "('" + args + "')");
    // Run with eval
    (1, eval)(command + "('" + args + "')");
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
function help(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML +
    available_commands.join("<br />") +
    "<br />";
}

// LS function (lists directories in current directory)
function ls(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML;
}

// CLEAR function (removes all text in the terminal)
function clear(_args) {
  document.getElementById("active_terminal").innerHTML = "";
}

// ECHO function (prints input text)
function echo(args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML + args + "<br />";
}

// LOOP function (repeats the function contained for the specified number of times)
function loop(input_args) {
  input_args = input_args.split(" ");
  let number = input_args[0];
  input_args.shift();
  // Convert into command and args
  let command = input_args[0];
  input_args.shift();
  let args = input_args.join(" ");
  // Run the command the specified number of times
  for (let i = 0; i < number; i++) {
    // Log
    console.log("Running", command + "('" + args + "')");
    // Run with eval
    (1, eval)(command + "('" + args + "')");
  }
}

// NEO FETCH function (fancy system info display and shows distro)
function neofetch(_args) {
  document.getElementById("active_terminal").innerHTML =
    document.getElementById("active_terminal").innerHTML + "Your Browser: " + window.navigator.userAgent + "<br />";
}

// RESET TERMINAL function (debug to reset the terminal from the browser console)
function reset_terminal() {
  document.getElementById("active_terminal").innerHTML = prompt;
}
