import {Color, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DeviceOrientationControls} from "three/examples/jsm/controls/DeviceOrientationControls";

import * as THREE from 'three';

export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(1, innerWidth / innerHeight, 100, 1000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  // @ts-ignore
  private deviceOrientationControls = new DeviceOrientationControls(this.camera);
  // @ts-ignore
  private carScene: Scene;

  constructor() {
    var loader = new GLTFLoader();
    var that = this;

    var lights = [];
    lights[0] = new PointLight(0xff6842, 1, 0);
    lights[1] = new PointLight(0xffdd00, 1, 0);
    lights[2] = new PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    that.scene.add(lights[0]);
    that.scene.add(lights[1]);
    that.scene.add(lights[2]);

    loader.load(
      "/assets/car.gltf",
      function (gltf: GLTF) {
        console.log(gltf.scene);
        that.carScene = gltf.scene;
        that.scene.add(gltf.scene);
      },
    );

    // var mtlLoader = new MTLLoader();
    // var objLoader = new OBJLoader();
    //
    // mtlLoader.load('assets/car.mtl', function (material) {
    //   objLoader.setMaterials(material);
    //   objLoader.load(
    //     'assets/car.obj',
    //     function (object: any) {
    //       that.scene.add(object);
    //     },
    //     function (xhr) {
    //       console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //     },
    //     function (error) {
    //       console.log('An error happened');
    //     }
    //   );
    // });


    this.camera.position.set(200, 200, 200);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.orbitControls.update();
    window.addEventListener('deviceorientation', this.setDeviceOrientationControls.bind(this), true);

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    this.render();
  }

  setDeviceOrientationControls(e: DeviceOrientationEvent) {
    this.deviceOrientationControls = new DeviceOrientationControls(this.camera);
    this.deviceOrientationControls.connect();
    this.deviceOrientationControls.update();
    var alphaRotation = e.alpha ? THREE.Math.degToRad(e.alpha) : 0;
    var betaRotation = e.beta ? THREE.Math.degToRad(e.beta) : 0;
    var gammaRotation = e.gamma ? THREE.Math.degToRad(e.gamma) : 0;

    this.carScene.rotation.x = betaRotation;
    this.carScene.rotation.y = gammaRotation;
    // this.carScene.rotation.z = alphaRotation;
    window.removeEventListener('deviceorientation', this.setDeviceOrientationControls, true);
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.orbitControls.update();
    // this.deviceOrientationControls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
    // this.brick.rotateY(0.03);
  }
}
