import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
  const threeContainer = useRef(null);

  useEffect(() => {
    if (!threeContainer.current) return;

    // Check for WebGL support
    if (!('WebGLRenderingContext' in window)) {
      console.error('This browser does not support WebGL');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, threeContainer.current.clientWidth / threeContainer.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 4);

    // Renderer setup
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(threeContainer.current.clientWidth, threeContainer.current.clientHeight);
      renderer.shadowMap.enabled = false; // Disabled shadows for performance
      threeContainer.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Renderer initialization failed:', error);
      return;
    }

    // Lighting setup
    const sunLight = new THREE.DirectionalLight(0xffeeb1, 1);
    sunLight.position.set(50, 100, 50);
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
    scene.add(hemiLight);

    // Uniforms for the water shader
    const waterUniforms = {
      u_time: { value: 0.0 },
      u_amplitude: { value: 1 },
      u_wavelength: { value: 5 },
      u_color: { value: new THREE.Color(0x0, 0.5, 0.7) },
      u_sunLightDirection: { value: sunLight.position.normalize() },
      u_sunLightColor: { value: sunLight.color },
    };

    // Shader material setup
    const vertexShader = `
      uniform float u_time;
      uniform float u_amplitude;
      uniform float u_wavelength;
      varying vec3 vPos;

      void main() {
        vPos = position;
        float wave = sin(position.y / u_wavelength + u_time) * u_amplitude;
        vec3 newPos = position + vec3(0.0, wave, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 u_color;
      uniform vec3 u_sunLightDirection;
      uniform vec3 u_sunLightColor;
      varying vec3 vPos;

      void main() {
        float intensity = dot(normalize(vPos), u_sunLightDirection) * 0.5 + 0.5;
        vec3 color = u_color * intensity * u_sunLightColor;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: waterUniforms
    });

    // Plane setup
    const planeGeometry = new THREE.PlaneGeometry(20, 20, 64, 64); // Increased segments to make waves smoother
    const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, -0.5, 0); // Lowered the plane slightly to avoid z-fighting
    scene.add(plane);

    // Model loaders
    const forestLoader = new GLTFLoader();
    const mailboxLoader = new GLTFLoader();

    // Forest environment load
    forestLoader.load('models/forest/scene.gltf', (gltf) => {
      const forest = gltf.scene;
      forest.rotation.y = Math.PI / 2;
      forest.scale.set(0.2, 0.2, 0.2);
      forest.position.set(0, -0.28, 0);
      scene.add(forest);

      // Mailbox model load
      mailboxLoader.load('models/mailbox/scene.gltf', (gltf) => {
        const mailbox = gltf.scene;
        mailbox.rotation.y = -Math.PI / 2;
        mailbox.position.set(0, 2, 1);
        forest.add(mailbox);

        camera.lookAt(mailbox.position);
        sunLight.target = mailbox;
      }, (xhr) => console.log(`Mailbox model: ${xhr.loaded / xhr.total * 100}% loaded`), (error) => console.error('Error loading the mailbox model:', error));
    }, (xhr) => console.log(`Forest model: ${xhr.loaded / xhr.total * 100}% loaded`), (error) => console.error('Error loading the forest model:', error));

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Optional: Enable damping (inertia), which can give a smoother control feeling.
    controls.dampingFactor = 0.01; // Optional: Damping factor.
    controls.autoRotate = false; // Optional: Enable if you want the camera to automatically rotate around the target.
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;


    // Create bars function
    const createBar = (position, scale) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, emissive: 0x22ff22 });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(...position);
      bar.scale.set(...scale);
      scene.add(bar);
    };

    // Create cage bars
    const cageSize = 20;
    const barHeight = 5;
    const barThickness = 0.1;
    const spacingBetweenBars = 2;
    // Loop for vertical bars
    for (let i = -cageSize / 2; i <= cageSize / 2; i += spacingBetweenBars) {
      for (let j = 0; j <= barHeight; j += spacingBetweenBars) {
        createBar([i, j, -cageSize / 2], [barThickness, spacingBetweenBars, barThickness]);
        createBar([i, j, cageSize / 2], [barThickness, spacingBetweenBars, barThickness]);
        if (i !== -cageSize / 2 && i !== cageSize / 2) {
          createBar([-cageSize / 2, j, i], [barThickness, spacingBetweenBars, barThickness]);
          createBar([cageSize / 2, j, i], [barThickness, spacingBetweenBars, barThickness]);
        }
      }
    }
    // Loop for horizontal bars
    for (let j = spacingBetweenBars; j <= barHeight; j += spacingBetweenBars) {
      for (let i = -cageSize / 2; i <= cageSize / 2; i += spacingBetweenBars) {
        createBar([i, j, -cageSize / 2], [spacingBetweenBars, barThickness, barThickness]);
        createBar([i, j, cageSize / 2], [spacingBetweenBars, barThickness, barThickness]);
        createBar([-cageSize / 2, j, i], [barThickness, barThickness, spacingBetweenBars]);
        createBar([cageSize / 2, j, i], [barThickness, barThickness, spacingBetweenBars]);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      waterUniforms.u_time.value += 0.05;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Window resize event
    const onWindowResize = () => {
      camera.aspect = threeContainer.current.clientWidth / threeContainer.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeContainer.current.clientWidth, threeContainer.current.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Cleanup function
    const currentContainer = threeContainer.current;

    return () => {
      if (currentContainer && renderer.domElement.parentElement === currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
    };
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      threeContainer.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Component return
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#1a1a1a'
    }}>
      <div ref={threeContainer} style={{ 
        width: '80vw', 
        height: '80vh', 
        border: '1px solid black', 
        borderRadius: '15px',
        boxShadow: '0px 0px 10px 5px white',
        overflow: 'hidden'
      }} />
      <button onClick={toggleFullscreen} style={{ marginTop: '20px' }}>
        Toggle Fullscreen
      </button>
    </div>
  );
};

export default ThreeScene;

