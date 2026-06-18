// Importeert de basis van Three.js (renderer, scene, camera, lights, etc.).
import * as THREE from 'three';
// Importeert de GLTFLoader die .glb/.gltf bestanden kan inladen.
//stond op: import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";, maar dit was onbetrouwbaar en wou niet werken bij mij, daarom heb ik het lokaal opgeslagen en zo geïmporteerd.
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';


function revealPage() {
	document.body.classList.add("is-loaded");
}

//--------------------------------------------------------
// Zoekt het canvas-element op dat in index.html staat.
const canvas = document.getElementById("bg3d");
// Stopt met een duidelijke foutmelding als het canvas niet bestaat.
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas #bg3d niet gevonden");


// Maakt de WebGL-renderer aan en laat die op ons eigen canvas tekenen.
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
// Zet de renderer op de grootte van het browservenster.
renderer.setSize(window.innerWidth, window.innerHeight);
// Beperkt de pixelratio voor betere performance op zware schermen.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));

//--------------------------------------------------------
//exit button
const exitButton = document.getElementById('exit-btn');
if (exitButton instanceof HTMLButtonElement) {
	exitButton.addEventListener('click', () => {
		windAudio.pause();
		window.close();

		if (!window.closed) {
			window.location.replace('about:blank');
		}
	});
}

//--------------------------------------------------------

// Scene aanmaak.
const scene = new THREE.Scene();

new RGBELoader().load("./assets/sky.hdr", (texture) => {

	texture.mapping = THREE.EquirectangularReflectionMapping;

	scene.background = texture;
	scene.environment = texture;
	revealPage();
}, undefined, (error) => {
	console.error("Kon assets/sky.hdr niet laden:", error);
	revealPage();
});

//--------------------------------------------------------
// Camera aanmaak.
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
// Positioneert de camera. x, z en y assen
camera.position.set(-1, 0, 12);


// Licht kan niet worden geïmporteerd van blender, dus het moet via code worden toegevoegd.

// Licht toevoegen
scene.add(new THREE.AmbientLight(0xffffff, 1.0));
// richtinglicht.
const sun = new THREE.DirectionalLight(0xffffff, 3.1);
// schuine positie.
sun.position.set(4, 6, 3);
// lich in scene.
scene.add(sun);

//--------------------------------------------------------
// loader.
const loader = new GLTFLoader();
//  Laadt het model.
let model = null;


// Laadt woestijn.glb uit assets.
loader.load("./assets/woestijn.glb",
	(gltf) => {
		// Pakt de root-scene uit het gltf-resultaat.
		model = gltf.scene;
		model.position.set(0, -1.0, 0);
		// hoogtevan camera.
		model.scale.setScalar(1);
		// voeg model toe aan scene.
		scene.add(model);
	},
	undefined,
	// callback draait als laden mislukt.
	(error) => console.error("Kon assets/woestijn.glb niet laden:", error)
);

//--------------------------------------------------------
// opniew schalen wanneer scherm verandert.
function onResize() {
	// opnieuw schalen voor camera.
	camera.aspect = window.innerWidth / window.innerHeight;
	// Als de projectiematrix niet wordt aangepast bij een resolutie verandering, dan worden de visuals niet geupdate. Deze regel update de projectiematrix.
	camera.updateProjectionMatrix();
	// Past de rendergrootte aan op het nieuwe venster.
	renderer.setSize(window.innerWidth, window.innerHeight);
}

//---------------------------------------------------------
// resize-events van het browservenster.
window.addEventListener("resize", onResize);

// Start een loop voor de animatie.
function animate() {
	// Vraagt de browser om deze functie op het volgende frame opnieuw te draaien.
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();

// Achtergrond sound: Ik heb geen idee hoe ik de audio gelijk laat afspelen zonder een gebruikersactie.
const windAudio = new Audio('./assets/wind.mp3');
windAudio.loop = true;
windAudio.volume = 0.3;


function startWindAudio() {
	windAudio.play().catch(() => {});
		document.removeEventListener('click', startWindAudio);
		document.removeEventListener('keydown', startWindAudio);
}

	windAudio.play().catch(() => {
		document.addEventListener('click', startWindAudio, { once: true });
		ocument.addEventListener('keydown', startWindAudio, { once: true });
});




