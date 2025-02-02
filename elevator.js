let liftPositions = Array(5).fill(0); // Elevators start at ground floor
let movingLifts = Array(5).fill(false);
let buttonStatus = Array(10).fill(false);
let callQueue = [];

const playSound = () => {
    const audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    audio.play();
};

const handleButtonClick = (floor) => {
    if (buttonStatus[floor]) return;
    buttonStatus[floor] = true;
    document.getElementById(`btn-${floor}`).textContent = 'Waiting...';
    document.getElementById(`btn-${floor}`).style.backgroundColor = 'red';
    
    callQueue.push(floor);
    processQueue();
};

const processQueue = () => {
    if (callQueue.length === 0) return;
    
    let floorIndex = callQueue.shift();
    let availableLift = findClosestLift(floorIndex);
    
    if (availableLift !== -1) {
        moveLift(availableLift, floorIndex);
    } else {
        callQueue.push(floorIndex); 
    }
};

const findClosestLift = (floorIndex) => {
    let minDistance = Infinity;
    let closestLift = -1;
    
    liftPositions.forEach((pos, i) => {
        if (!movingLifts[i]) {
            let distance = Math.abs(pos - floorIndex);
            if (distance < minDistance) {
                minDistance = distance;
                closestLift = i;
            }
        }
    });
    
    return closestLift;
};

const moveLift = (liftIndex, floorIndex) => {
    movingLifts[liftIndex] = true;
    let currentFloor = liftPositions[liftIndex];
    let travelTime = Math.abs(currentFloor - floorIndex) * 500;
    
    let liftElement = document.querySelector(`#lift-${liftIndex}`);
    liftElement.style.transition = `transform ${travelTime / 1000}s linear`;
    liftElement.style.transform = `translateY(${-floorIndex * 60}px)`;
    liftElement.style.backgroundColor = 'red';
    
    setTimeout(() => {
        playSound();
        liftElement.style.backgroundColor = 'green';
        
        document.getElementById(`btn-${floorIndex}`).textContent = 'Arrived';
        
        setTimeout(() => {
            liftElement.style.backgroundColor = 'black';
            document.getElementById(`btn-${floorIndex}`).textContent = 'Call';
            document.getElementById(`btn-${floorIndex}`).style.backgroundColor = 'green';
            movingLifts[liftIndex] = false;
            liftPositions[liftIndex] = floorIndex;
            processQueue();
        }, 2000);
    }, travelTime);
};
