function init() {
  document.addEventListener("keydown", keydown, false);
  console.log("Init done!");
}

function makeMain(element) {
  console.log("making main: ", element);
  document.querySelectorAll("#mainWindow").forEach((el) => {
    el.id = "";
  });
  element.id = "mainWindow";
}

function keydown(e) {
  // Get the window and its style for easy access
  let mainWindow = document.getElementById("mainWindow");
  let mainWindowStyle = getComputedStyle(mainWindow);
  if (e.shiftKey) {
    // Manage resizing the window
    // Left arrow
    if (e.keyCode == 37) {
      let width = parseInt(mainWindowStyle.getPropertyValue("--width"));
      width -= 10;
      width += "px";
      mainWindow.style.setProperty("--width", width);
      console.log("Shift + left arrow down: width =", width);
    }
    // Up Arrow
    if (e.keyCode == 38) {
      let height = parseInt(mainWindowStyle.getPropertyValue("--height"));
      height -= 10;
      height += "px";
      mainWindow.style.setProperty("--height", height);
      console.log("Shift + up arrow down: height =", height);
    }
    // Right Arrow
    if (e.keyCode == 39) {
      let width = parseInt(mainWindowStyle.getPropertyValue("--width"));
      width += 10;
      width += "px";
      mainWindow.style.setProperty("--width", width);
      console.log("Shift + right arrow down: width =", width);
    }
    // Down Arrow
    if (e.keyCode == 40) {
      let height = parseInt(mainWindowStyle.getPropertyValue("--height"));
      height += 10;
      height += "px";
      mainWindow.style.setProperty("--height", height);
      console.log("Shift + down arrow down: height =", height);
    }
  } else {
    // Manage moving the window
    // Left arrow
    if (e.keyCode == 37) {
      let x = parseInt(mainWindowStyle.getPropertyValue("--x"));
      x -= 10;
      x += "px";
      mainWindow.style.setProperty("--x", x);
      console.log("left arrow down: x =", x);
    }
    // Up Arrow
    if (e.keyCode == 38) {
      let y = parseInt(mainWindowStyle.getPropertyValue("--y"));
      y -= 10;
      y += "px";
      mainWindow.style.setProperty("--y", y);
      console.log("up arrow down: y =", y);
    }
    // Right Arrow
    if (e.keyCode == 39) {
      let x = parseInt(mainWindowStyle.getPropertyValue("--x"));
      x += 10;
      x += "px";
      mainWindow.style.setProperty("--x", x);
      console.log("right arrow down: x =", x);
    }
    // Down Arrow
    if (e.keyCode == 40) {
      let y = parseInt(mainWindowStyle.getPropertyValue("--y"));
      y += 10;
      y += "px";
      mainWindow.style.setProperty("--y", y);
      console.log("down arrow down: y =", y);
    }
  }
}

// Get the value of a global css variable
// Nicknamed settings, so that it can be configured
function getSetting(setting) {
  let rootStyle = getComputedStyle(document.querySelector(":root"));
  let value = rootStyle.getPropertyValue(setting);
  return value;
}

// Set the value of a global css variable
function setSetting(setting, value) {
  let root = document.querySelector(":root");
  root.style.setProperty(setting, value);
  console.log(setting, "=", getSetting(setting))
}
