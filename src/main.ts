import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  // BoxGeometry,
  Mesh,
  RawShaderMaterial,
  Vector2,
  FileLoader,
  CustomBlending,
  SrcAlphaFactor,
  // OneMinusDstAlphaFactor,
  SphereGeometry,
  Color,
  Vector3,
  // WireframeGeometry,
  // LineBasicMaterial,
  // LineSegments,
  // AmbientLight,
  // TextureLoader,
  OneMinusSrcAlphaFactor,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'
import { MODELS_PATH, SHADERS_PATH, TEXTURES_PATH } from './constants'

const scene = new Scene()
scene.background = new Color(0xcccccc)
// scene.add(new AmbientLight(0xcccccc))

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 305

const renderCube = async (): Promise<void> => {
  const loader = new FileLoader()
  const vertexShader = (await loader.loadAsync(
    `${SHADERS_PATH}/pass-through.vert`
  )) as string
  const fragmentShader = (await loader.loadAsync(
    `${SHADERS_PATH}/simple.frag`
  )) as string

  const diffuseTex = await new TGALoader().loadAsync(
    `${TEXTURES_PATH}/Robot_Diffuse.tga`
  )
  const normalTex = await new TGALoader().loadAsync(
    `${TEXTURES_PATH}/Robot_Normal.tga`
  )

  const material = new RawShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new Vector2() },
      mainColor: { value: new Vector3(0.5, 0.8, 0.345) },
      diffuseTex: { value: diffuseTex },
      normalTex: { value: normalTex },
    },
    vertexShader,
    fragmentShader,
    // transparent: true,
    blending: CustomBlending,
    blendSrc: SrcAlphaFactor,
    blendDst: OneMinusSrcAlphaFactor,
  })
  const fbxLoader = new FBXLoader()
  const robotModel = await fbxLoader.loadAsync(`${MODELS_PATH}/RobotKyle.fbx`)
  robotModel.traverse(function (child) {
    // // @ts-ignore
    // if (child.material) {
    //   // @ts-ignore
    //   child.material = material
    // }
    // // @ts-ignore
    // if (child.isMesh) {
    //   // @ts-ignore
    //   const wireframeGeomtry = new WireframeGeometry(child.geometry)
    //   // const wireframeMaterial = new LineBasicMaterial({ color: 0x000000 })
    //   const wireframe = new LineSegments(wireframeGeomtry, material)
    //   child.add(wireframe)
    // }
  })
  scene.add(robotModel)

  const geometry = new SphereGeometry(1, 32, 32) // 1, 32, 32

  const robot = new Mesh(geometry, material)
  scene.add(robot)

  renderer.render(scene, camera)

  const animate = (): void => {
    const time = performance.now()

    requestAnimationFrame(animate)

    robot.rotation.x += 0.01
    robot.rotation.y += 0.01

    robot.material.uniforms.time.value = time * 0.005
    renderer.render(scene, camera)
  }

  animate()

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 100, 0)
  controls.update()
}

renderCube()
