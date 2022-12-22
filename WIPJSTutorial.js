//https://www.freecodecamp.org/news/three-js-tutorial/ WIP following this tutorial

import * as THREE from "https://cdn.skypack.dev/three@0.147.0";


////SCENE/////
const scene = new THREE.Scene();

const playerCar = Car();
scene.add(playerCar);

//Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set = (100,-300, 400);
scene.add(dirLight);

//Camera Setup
const aspectRatio = window.innerWidth/window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth/aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth/-2,
  cameraWidth/2,
  cameraHeight/2,
  cameraHeight/-2,
  0,
  1000
);
camera.position.set(0,0,300);

camera.lookAt(0,0,0);
renderMap(cameraWidth, cameraHeight * 2);

//Renderer Setup
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

////TRACK////
function getArcCenterx()
{

  const trackRadius = 255;
  const trackWidth = 45;
  const innerTrackRadius = trackRadius - trackWidth;
  const outerTrackRadius = trackRadius + trackWidth;

  const arcAngle1 = (1/3)*Math.PI;
  const deltaY = Math.sin(arcAngle1)*innerTrackRadius;
  const arcAngle2 = Math.asin(deltaY/outerTrackRadius);

  const arcCenterX = (Math.cos(arcAngle1)*innerTrackRadius + Math.cos(arcAngle2)*outerTrackRadius )/2;

  const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

  const arcAngle4 = Math.acos(arcCenterX/outerTrackRadius);
  return arcCenterX;
}
function renderMap(mapWidth, mapHeight)
{
  const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);
  const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
  const planeMaterial = new THREE.MeshLambertMaterial({map: lineMarkingsTexture,});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  
  //Extruded Geometry 
  const islandLeft = getLeftIsland();
  
  
  const fieldGeometry = new THREE.ExtrudeBufferGeometry(
  [islandLeft], {depth: 6, bevelEnabled: false});
  
  const fieldMesh = new THREE.Mesh(fieldGeometry, [
    new THREE.MeshLambertMaterial({color: 0x67c240}),
    new THREE.MeshLambertMaterial({color: 0x23311c}),
  ]);
  scene.add (fieldMesh);
}

function getLeftIsland()
{
  const islandLeft = new THREE.Shape();
  
  return islandLeft;
}
////CAR/////

function Car()
{
  const vehicleColors =[0xa52523, 0xbdb638, 0x78b14b]; 
  const car = new THREE.Group();
  
  const backWheel = Wheel();
  backWheel.position.x = -18;
  car.add(backWheel);
  
  const frontWheel = Wheel();
  frontWheel.position.x =18;
  car.add(frontWheel);
  
  
  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60,30,15),
    new THREE.MeshLambertMaterial({color: pickRandom(vehicleColors)})
  );
  main.position.z = 12;
  car.add(main);
  
  const carFrontTexture = getCarFrontTexture();
  carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  carFrontTexture.rotation = Math.PI/2;
  
  const carBackTexture = getCarFrontTexture();
  carBackTexture.center = new THREE.Vector2(0.5,0.5);
  carBackTexture.rotation = -Math.PI/2; 
  
  const carRightSideTexture = getCarSideTexture();
  
  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.flipY = false;
  
  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(33,24,12),
    [new THREE.MeshLambertMaterial({map: carFrontTexture}),
    new THREE.MeshLambertMaterial({map: carBackTexture}),
    new THREE.MeshLambertMaterial({map: carLeftSideTexture}),
    new THREE.MeshLambertMaterial({map: carRightSideTexture}),
    new THREE.MeshLambertMaterial({color: 0xffffff}), // top
    new THREE.MeshLambertMaterial({color: 0xffffff})] // bottom
  );
  cabin.position.x = -6;
  cabin.position.z = 25.5;
  car.add(cabin);
  return car;
}

function pickRandom(array) 
{
  return array[Math.floor(Math.random()*array.length)];
}

/////MAP/////

function getLineMarkings(mapWidth, mapHeight)
{
  

  const canvas = document.createElement("canvas");
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  const context = canvas.getContext("2d");
  
  context.fillStyle = "#546E90";
  context.fillRect(0,0,mapWidth,mapHeight);
  
  context.lineWidth = 2;
  context.strokeStyle = "#E0FFFF";
  context.setLineDash([10,14]);
  
  //Left Circle
  const arcCenter = getArcCenterx();
  context.beginPath();
  context.arc
  (   
    mapWidth/2 - arcCenter,
    mapHeight/2,
    trackRadius,
    0,
    Math.PI*2
  );
  context.stroke();
  
  //RightCircle
  context.beginPath();
  context.arc
  (
    mapWidth/2 + arcCenter,
    mapHeight/2,
    trackRadius,
    0,
    Math.PI*2
  );
  context.stroke();
  
  return new THREE.CanvasTexture(canvas);
}


/////CAR////

function Wheel()
{
  const wheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12,33,12),
    new THREE.MeshLambertMaterial({color: 0x333333})
  );
  wheel.position.z = 6;
  return wheel; 
}


function getCarFrontTexture()
{
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  
  const context = canvas.getContext("2d");
  
  context.fillStyle = "#ffffff";
  context.fillRect(0,0,64,32);
  
  context.fillStyle= "#666666";
  context.fillRect(8,8,48,24);
  
  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture(){
  const canvas = document.createElement("canvas");
  canvas.width =128;
  canvas.height = 32;
  
  const context = canvas.getContext("2d");
  
  context.fillStyle = "#ffffff";
  context.fillRect(0,0,128,32);
  
  context.fillStyle = "#666666";
  context.fillRect(10,8,38,24);
  context.fillRect(58,8,60,24);
  
  return new THREE.CanvasTexture(canvas);
}
