var robot = require("robotjs");


// Speed up the mouse.
putMovie("https://openload.co/embed/grifEKvDE_o/M.0.N%2FG.4.R.C.0.N.mp4");
function putMovie (url) {
  robot.setMouseDelay(2);
  robot.moveMouse(250, 80);
  robot.mouseClick();

  robot.keyToggle("command", "down");
  robot.keyToggle("a", "up");
  robot.keyToggle("command", "up");

  robot.typeString(url);
  robot.keyTap("i", ["command", "alt"]);
  robot.keyTap("enter");
  setTimeout(function(){
    robot.moveMouse(250, 250);
    robot.mouseClick();
    setTimeout(function(){
      robot.keyTap("w", ["command"]);
      //robot.keyToggle('w', 'down', ['command']);
      //robot.keyToggle('w', 'up', ['command']);
      setTimeout(function() {
        openDEB();
      }, 1000);
    }, 1000);
  }, 5500);
}
function openDEB() {
    robot.moveMouse(640, 764);
    robot.mouseClick();
    robot.mouseClick('right');
    robot.moveMouse(650, 764);
    robot.moveMouse(650, 700);
    robot.moveMouse(750, 700);
    robot.mouseClick();

/*
    robot.mouseClick("left", "double");
    robot.moveMouse(400, 80);
    robot.mouseClick();
    robot.keyTap("a", ["command"]);
    robot.keyToggle('a', 'down', ['command']);
    robot.keyToggle('a', 'up', ['command']);
*/

    //robot.keyTap("c", ["command"]);

}


//robot.keyTap("a")
//robot.typeString("Hello  POLLOS increible");

// Press enter.
//robot.keyTap("enter");

//}
