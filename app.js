import { getMyId, getAllUsers, updateUserData } from "./firebase.js";
import { Entity } from "./entity.js";
import { Joystick } from "./joystick.js";
import { WASD } from "./wasd.js";
import { Environment } from './environment.js'

let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let joystick;
let wasd;
let entities = [];
let myID;
let environment;

//use to check if user is on mobile to swich from keyboard to youch controls
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

window.onload = init;

function init(){
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = 666;
    canvas.height = 333;

    //create new Environment
    environment = new Environment();

    //get input
    wasd = new WASD();
    joystick = new Joystick(canvas);    

    //get my id
    async function setMyID(){
        myID = await getMyId();;
    }
    setMyID();

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    //functions to run each frame
    update(secondsPassed);
    draw(context);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
    updateEntities();

    wasd.update();
    entities.forEach(entity => {
        entity.update(secondsPassed);
        environment.walls.forEach(wall => {
            if(checkCollision(entity, wall)) wall.color = "grey";
            else wall.color = "black";
        });
    });
}

function draw(context) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    
    context.save();
    let myIndex = entities.findIndex((entity) => entity.id === myID);
    //cam follow player
    if(entities.length > 0) context.translate(-entities[myIndex].position.x + canvas.width / 2, -entities[myIndex].position.y + canvas.height / 2);
    
    //draw environment
    environment.draw(context);
    
    //combine arrays, sort objects, draw each in order
    let layeredObjects = [].concat(entities);
    layeredObjects.sort((a, b) => a.position.y - b.position.y);
    layeredObjects.forEach(object => {
        object.draw(context);
    });
    
    context.restore();


    //draw joystick
    joystick.draw(context);

    //draw fps
    context.fillStyle = "#fff";
    context.font = "14px Special Elite";
    context.textAlign = "center";
    context.fillText("FPS: "+ fps, 40, 20);
}

async function updateEntities(){
    const allUsers = await getAllUsers();
    const dbUsersIDs = Object.keys(allUsers);
    const dbUsersValues =  Object.values(allUsers);

    for (let i = 0; i < entities.length; i++ ){
        //remove any existing entities that are not in the db
        if(!dbUsersIDs.some((id) => id === entities[i].id)){
            entities.splice(i, 1);
        }
    }

    for (let i = 0; i < dbUsersIDs.length; i++ ){
        //create new entity for each one in db, if it doesnt already exist
        if(!entities.some((entity) => entity.id === dbUsersIDs[i])){
            const newEntity = new Entity(
                isMobile ? joystick.joystickValue : wasd.inputDirection,
                {x: canvas.width * 0.5, y: canvas.height * 0.5},
                8,
                200
            );
            newEntity.id = dbUsersIDs[i];
            if (newEntity.id === myID) newEntity.isMine = true;
            else newEntity.inputDirection = {x: 0, y: 0};
            entities.push(newEntity);
        }
        //for existing entities update position with data from database
        else{
            const index = entities.findIndex((entity) => entity.id === dbUsersIDs[i]);
            if(entities[index].id !== myID){
                entities[index].position.x = dbUsersValues[i].x;
                entities[index].position.y = dbUsersValues[i].y;
                entities[index].inputDirection.x = dbUsersValues[i].dx;
                entities[index].inputDirection.y = dbUsersValues[i].dy; 
            }
        }
    }
    
    //find my index
    const index = entities.findIndex((entity) => entity.id === myID);
    //update my entity data
    updateUserData(myID, entities[index].position.x, entities[index].position.y, isMobile ? joystick.joystickValue : wasd.inputDirection);    
}

function checkCollision(player, wall){
    return (player.position.x - 20 < wall.x + wall.width/2 &&
      player.position.x + 20 > wall.x - wall.width/2 &&
      player.position.y - 20 < wall.y + wall.height/2 &&
      player.position.y> wall.y - wall.height/2)
}