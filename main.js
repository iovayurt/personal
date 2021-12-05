import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { BufferGeometryUtils } from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/utils/BufferGeometryUtils.js";

import { GUI } from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/libs/dat.gui.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera );

const torusTexture = new THREE.TextureLoader().load('buoy.png');

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial({ map: torusTexture } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus)

const tireTexture = new THREE.TextureLoader().load('tire.jpeg');

const tonos = new THREE.TorusGeometry(10, 3, 16, 100)
const teker = new THREE.MeshStandardMaterial({ map: tireTexture });
const tire = new THREE.Mesh(tonos, teker);

scene.add(tire)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)


const spaceTexture = new THREE.TextureLoader().load('sea1.jpeg');
scene.background = spaceTexture;

const ilyasTexture = new THREE.TextureLoader().load('tio1.jpeg');

const ilyas = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: ilyasTexture })
);

scene.add(ilyas);

const moonTexture = new THREE.TextureLoader().load('tennis.png');
//const normalTexture = new THREE.TextureLoader().load('normal.jpeg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    //normalMap: normalTexture,
  } )
);

scene.add(moon);

moon.position.z = 20;
moon.position.setX(-10);

ilyas.position.z = -5;
ilyas.position.x = 2;

tire.position.z = -20;
tire.position.setX(-20);

const marsTexture = new THREE.TextureLoader().load('soccer.jpeg');
//const mrsTexture = new THREE.TextureLoader().load('normal.jpeg');

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(6, 52, 52),
  new THREE.MeshStandardMaterial( {
    map: marsTexture,
    //normalMap: mrsTexture,
  })
);

scene.add(mars);

mars.position.z = -25;
mars.position.setX(30);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  mars.rotation.x += 0.1;
  mars.rotation.y += 0.07;
  mars.rotation.z += 0.02;

  ilyas.rotation.y += 0.01;
  ilyas.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();


function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  tire.rotation.x += -0.01;
  tire.rotation.y += -0.001;
  tire.rotation.z += -0.01;

  controls.update();

  renderer.render( scene, camera );
}


let grids = [
  new THREE.GridHelper(40, 40, "aqua", "aqua"),
  new THREE.GridHelper(40, 40, "yellow", "yellow")
];
grids.forEach(g => { g.visible = false; scene.add(g); });
grids[1].geometry.rotateX(Math.PI * 0.5);

let curves = new THREE.Group();
scene.add(curves);

const divisions = 200;
// shaping curves
// top
let topCurve = new THREE.CatmullRomCurve3(
  [
    [0, 0],
    [0.1, 0.15],
    [1, 0.75],
    [3.5, 1.5],
    [9, 0.5],
    [9.5, 0.45],
    [10, 0.5]
  ].map(p => { return new THREE.Vector3(p[0], p[1], 0) })
);
let topPoints = topCurve.getSpacedPoints(100);
showCurve(topPoints, "aqua");
// bottom
let bottomCurve = new THREE.CatmullRomCurve3(
  [
    [0, 0],
    [0.1, -0.15],
    [0.5, -0.35],
    [4.5, -1],
    [8, -0.6],
    [9.5, -0.45],
    [10, -0.5]
  ].map(p => { return new THREE.Vector3(p[0], p[1], 0) })
);
let bottomPoints = bottomCurve.getSpacedPoints(100);
showCurve(bottomPoints, "white");
// side
let sideCurve = new THREE.CatmullRomCurve3(
  [
    [0, 0, 0],
    [0.1, 0, 0.125],
    [1, 0, 0.375],
    [4, -0.25, 0.6],
    [8, 0, 0.25],
    [10, 0, 0.05]
  ].map(p => { return new THREE.Vector3(p[0], p[1], p[2]) })
);
let sidePoints = sideCurve.getSpacedPoints(100);
showCurve(sidePoints, "yellow");

// frames
let frames = computeFrames();
//console.log(frames);
//frames.forEach(f => {showCurve(f, 0x7f7f7f)});
// frames to geometry
let pts = [];
frames.forEach(f => {
  f.forEach(p => {
    pts.push(p.x, p.y, p.z);
  })
})

let mapTex = new THREE.TextureLoader().load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');

// FINS
// tail fin
let tailCurve = new THREE.CatmullRomCurve3(
  [
    [11, -1.],
    [12.5, -1.5],
    [12., 0],
    [12.5, 1.5],
    [11, 1.],
  ].map(p => { return new THREE.Vector3(p[0], p[1], p[2]) })
);
let tailPoints = tailCurve.getPoints(divisions / 2);
showCurve(tailPoints, "magenta");
let tailPointsRev = tailPoints.map(p => { return p }).reverse();
tailPointsRev.shift();
let fullTailPoints = tailPoints.concat(tailPointsRev);
console.log(fullTailPoints);

let tailfinSlices = 5;
let tailRatioStep = 1 / tailfinSlices;
let vTemp = new THREE.Vector3();
for (let i = 1; i <= tailfinSlices; i++) {
  let ratio = i * tailRatioStep;
  frames[frames.length - 1].forEach((p, idx) => {
    vTemp.lerpVectors(p, fullTailPoints[idx], ratio);
    pts.push(vTemp.x, vTemp.y, vTemp.z);
  })
}

// dorsal
let dorsalCurve = new THREE.CatmullRomCurve3(
  [
    [3, 1.45],
    [3.25, 2.25],
    [3.75, 3],
    [6, 2],
    [7, 1]
  ].map(p => { return new THREE.Vector3(p[0], p[1], 0) })
);
let dorsalPoints = dorsalCurve.getSpacedPoints(100);
showCurve(dorsalPoints, 0x00ff00);
let gDorsal = createFin(topPoints, dorsalPoints, true);

// rect
let rectCurve = new THREE.CatmullRomCurve3(
  [
    [6, -0.9],
    [7.25, -1.5],
    [7.5, -0.75]
  ].map(p => { return new THREE.Vector3(p[0], p[1], 0) })
);
let rectPoints = rectCurve.getSpacedPoints(40);
showCurve(rectPoints, 0x00ff00);
let gRect = createFin(bottomPoints, rectPoints, false);

// pelvic
let pelvicCurve = new THREE.CatmullRomCurve3(
  [
    [2.25, -0.7],
    [3.75, -2],
    [4, -1]
  ].map(p => { return new THREE.Vector3(p[0], p[1], 0) })
);
let pelvicPoints = pelvicCurve.getSpacedPoints(40);
showCurve(pelvicPoints, 0x00ff00);
let gPelvic = createFin(bottomPoints, pelvicPoints, false);
gPelvic.translate(0, 0.6, 0);
let gPelvicL = gPelvic.clone();
gPelvicL.rotateX(THREE.MathUtils.degToRad(-20));
gPelvicL.translate(0, -0.6, 0);
let gPelvicR = gPelvic.clone();
gPelvicR.rotateX(THREE.MathUtils.degToRad(20));
gPelvicR.translate(0, -0.6, 0);

let planeGeom = new THREE.PlaneGeometry(1, 1, divisions, frames.length + tailfinSlices - 1);
planeGeom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
planeGeom.computeVertexNormals();

let mainGeom = BufferGeometryUtils.mergeBufferGeometries([planeGeom, gDorsal, gRect, gPelvicL, gPelvicR]);

let planeMat = new THREE.MeshBasicMaterial({ wireframe: false, side: THREE.DoubleSide, map: mapTex });
let mesh = new THREE.Mesh(mainGeom, planeMat)
scene.add(mesh);

let gui = new GUI();
gui.add(mesh, "visible").name("mesh");
gui.add(mesh.material, "wireframe");
gui.add(curves, "visible").name("curves");
gui.add(grids[0], "visible").name("XZ grid");
gui.add(grids[1], "visible").name("XY grid");

window.onresize = function () {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
};

// RENDER /////////////////////////////////////////////////////////////////////////////////////////////////////////
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createFin(basePoints, contourPoints, isTop) {
  let basePts = [];
  let shift = 0.05;
  let shiftSign = isTop ? 1 : -1;
  let vAdd = new THREE.Vector3(0, -shift * shiftSign, 0);

  contourPoints.forEach((p, idx) => {
    basePts.push(getPoint(basePoints, p.x).add(vAdd));
  });

  let basePtsRev = basePts.map(p => { return p.clone() }).reverse();
  basePtsRev.shift();

  let contourPointsRev = contourPoints.map(p => { return p.clone() }).reverse();
  contourPointsRev.shift();

  basePts.forEach((p, idx, arr) => {
    if (idx > 0 && idx < arr.length - 1) p.setZ(shift * shiftSign)
  });
  basePtsRev.forEach((p, idx, arr) => {
    if (idx < arr.length - 1) p.setZ(-shift * shiftSign)
  });

  console.log(contourPoints.length, contourPointsRev.length, basePts.length, basePtsRev.length);

  let fullPoints = [];
  fullPoints = fullPoints.concat(contourPoints, contourPointsRev, basePts, basePtsRev);

  let ps = [];
  fullPoints.forEach(p => { ps.push(p.x, p.y, p.z) });

  let plane = new THREE.PlaneGeometry(1, 1, (contourPoints.length - 1) * 2, 1);
  plane.setAttribute("position", new THREE.Float32BufferAttribute(ps, 3));
  plane.computeVertexNormals();
  return plane;
}

function computeFrames() {
  let frames = [];
  let step = 0.05;
  frames.push(new Array(divisions + 1).fill(0).map(p => { return new THREE.Vector3() })); // first frame all 0
  for (let i = step; i < 10; i += step) {
    frames.push(getFrame(i));
  }
  frames.push(getFramePoints(topPoints[100], bottomPoints[100], sidePoints[100])); // last frame at tail
  //console.log(frames[frames.length - 1]);
  return frames;
}

function getFrame(x) {
  let top = getPoint(topPoints, x);
  let bottom = getPoint(bottomPoints, x);
  let side = getPoint(sidePoints, x);
  return getFramePoints(top, bottom, side);
}

function getFramePoints(top, bottom, side) {
  let sideR = side;
  let sideL = sideR.clone().setZ(sideR.z * -1);
  let baseCurve = new THREE.CatmullRomCurve3([
    bottom,
    sideR,
    top,
    sideL
  ], true);

  let framePoints = baseCurve.getSpacedPoints(divisions);
  return framePoints;
}

function getPoint(curvePoints, x) {
  let v = new THREE.Vector3();
  for (let i = 0; i < curvePoints.length - 1; i++) {
    let i1 = curvePoints[i];
    let i2 = curvePoints[i + 1];
    if (x >= i1.x && x <= i2.x) {
      let a = (x - i1.x) / (i2.x - i1.x);
      return v.lerpVectors(i1, i2, a);
    }
  }
}

function showCurve(points, color) {
  let g = new THREE.BufferGeometry().setFromPoints(points);
  let m = new THREE.LineBasicMaterial({ color: color });
  let l = new THREE.Line(g, m);
  curves.add(l);
}

function addPartIndex(geometry, index) {
  let counter = geometry.attributes.position.count;
}

animate()
