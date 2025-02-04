var buttons = document.querySelectorAll(".call-btn");
var elevators = document.querySelectorAll(".lift");

var queueFloors = [];
var allLiftStatus = [];

for (var i = 0; i < elevators.length; i++) {
  allLiftStatus.push({
    liftIndex: i,
    moving: false,
    floor: 0,
  });
}


window.onload = function () {
  for (var i = 0; i < elevators.length; i++) {
    elevators[i].style.transform = "translateY(0%)";  
    elevators[i].style.filter = "none";  
    allLiftStatus[i].floor = 0;  
  }
};


function findNearestLift(currentFloor) {
  var nearestLift = null;
  var minDistance = Infinity;

  for (var i = 0; i < allLiftStatus.length; i++) {
    var lift = allLiftStatus[i];
    if (!lift.moving) {  
      var distance = Math.abs(currentFloor - lift.floor);
      if (distance < minDistance) {
        minDistance = distance;
        nearestLift = lift;
      }
    }
  }
  return nearestLift;
}


function isLiftAlreadyThere(calledFloor) {
  return allLiftStatus.some((lift) => lift.floor === calledFloor);
}

function areAllLiftsBusy() {
  return allLiftStatus.every((lift) => lift.moving);
}


function updateButtonUI(button, text, bgColor, disabled) {
  button.textContent = text;
  button.style.backgroundColor = bgColor;
  button.disabled = !!disabled;
}

function playSound() {
  var audio = new Audio("./sound/beep-01a.mp3");
  audio.play();
}

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    var clickedFloor = parseInt(this.id.split("-")[1]);

    if (areAllLiftsBusy()) {
      queueFloors.push(clickedFloor);  
      return;
    }

    if (!isLiftAlreadyThere(clickedFloor)) {
      updateButtonUI(this, "Waiting", "red", true);  
      handleLiftRequest(clickedFloor, this); 
    }
  });
});


function handleLiftRequest(clickedFloor, button) {
  var lift = findNearestLift(clickedFloor);
  if (!lift) {
    queueFloors.push(clickedFloor); 
    return;
  }
  moveElevator(lift, clickedFloor, button);  
}


function moveElevator(lift, targetFloor, button) {
  var elevator = elevators[lift.liftIndex];
  var floorHeight = document.querySelector(".floor").offsetHeight;  
  var travelTime = Math.abs(targetFloor - lift.floor) * 0.5; 

  lift.moving = true;
  lift.floor = targetFloor; 

  updateElevatorUI(elevator, "moving");  
  button.textContent = "Waiting (" + travelTime.toFixed(1) + "s)";  

  elevator.style.transition = "transform " + travelTime + "s linear";
  elevator.style.transform = "translateY(-" + targetFloor * floorHeight + "px)";  


  setTimeout(function () {
    playSound();  
    updateElevatorUI(elevator, "arrived"); 
    updateButtonUI(button, "Arrived", "black", false);  
    setTimeout(function () {
      resetElevator(lift, elevator, button); 
    }, 2000);
  }, travelTime * 1000); 
}


function resetElevator(lift, elevator, button) {
  lift.moving = false;
  updateElevatorUI(elevator, "idle");  

  updateButtonUI(button, "Call", "#148e31", false);


  if (queueFloors.length > 0) {
    var nextFloor = queueFloors.shift(); 
    var nextButton = document.getElementById("btn-" + nextFloor);
    handleLiftRequest(nextFloor, nextButton); 
  }
}

function updateElevatorUI(elevator, status) {
  var color;

  if (status === "moving") {
    color = "red";
  } else if (status === "arrived") {
    color = "green";
  } else {
    color = "transparent";
  }

  elevator.style.transition = "background-color 0.5s ease";  
  elevator.style.backgroundColor = color;
}
