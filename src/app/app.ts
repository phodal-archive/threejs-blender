import {Color, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer} from 'three';
import {Brick} from './brick';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(1, innerWidth / innerHeight, 100, 1000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

  constructor() {
    var loader = new GLTFLoader();
    var that = this;

    var lights = [];
    var color = '#ff6842';
    lights[0] = new PointLight(0xff6842, 1, 0);
    lights[1] = new PointLight(0xffffff, .3, 0);
    lights[2] = new PointLight(0xffffff, .8, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    that.scene.add(lights[0]);
    that.scene.add(lights[1]);
    that.scene.add(lights[2]);

    loader.load(
        "/assets/car.gltf.glb",
        function ( gltf ) {
          console.log(gltf.scene);
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

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    this.render();
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
    // this.brick.rotateY(0.03);
  }
}
