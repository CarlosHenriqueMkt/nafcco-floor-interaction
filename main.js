import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const aspectRatio = sizes.width / sizes.height;

let renderer, scene, camera, canvas, environment, pmremGenerator, controls, raycaster, mouse;
let lastIntersectedObject = null;
const clock = new THREE.Clock();

experience();
animate();

function experience() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(65, aspectRatio, 1, 1000);
  camera.position.z = 5;
  scene.add(camera);

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
  });

  canvas = document.getElementById('app');
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMappingExposure = -2
  canvas.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  document.addEventListener('DOMContentLoaded', function () {
    model();
  });

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('click', onMouseClick, false);
}

function model() {
  environment = new RoomEnvironment(renderer);
  pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0x000000);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  const loader = new GLTFLoader();
  loader.load('./3f.glb', function (gltf) {
    const blenderModel = gltf.scene;
    blenderModel.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material.map) node.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
    });
    scene.add(blenderModel);
    console.log(blenderModel);
  }, undefined, function (error) {
    console.error(error);
  });
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    // Reset the color of the last intersected object
    if (lastIntersectedObject && lastIntersectedObject !== intersectedObject) {
      lastIntersectedObject.material.color.setHex(0xFFFFFF); // Change to white
    }

    // Set the color of the new intersected object
    switch (intersectedObject.name) {
      case 'area01':
        console.log('area01 clicked');
        intersectedObject.material.color.setHex(0xB01C12);
        showDrawer('area01')
        break;
      case 'area02':
        console.log('area02 clicked');
        intersectedObject.material.color.setHex(0xB01C12);
        showDrawer('area02')
        break;
      case 'area03':
        console.log('area03 clicked');
        intersectedObject.material.color.setHex(0xB01C12);
        showDrawer('area03')
        break;
      case 'createdArea':
        console.log('createdArea clicked');
        intersectedObject.material.color.setHex(0xB01C12);
        showDrawer('createdArea')
        break;
      default:
        console.log('Unknown area clicked');
        break;
    }

    // Update the last intersected object
    lastIntersectedObject = intersectedObject;
  }
}

function showDrawer(areaId) {
  document.querySelectorAll('.drawer').forEach(content => {
    content.classList.remove('open');
  });
  const drawerContent = document.getElementById(areaId);
  if (drawerContent) {
    drawerContent.classList.add('open');
  }
}

const close = document.getElementById('close');

close.addEventListener('click', closeDrawer);

function closeDrawer() {
  document.querySelectorAll('.drawer').forEach(content => {
    content.classList.remove('open');
  });
}


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
