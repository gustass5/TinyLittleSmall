import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import SimplexNoise from 'simplex-noise';
import { TextureLoader } from 'three';
import { WorldMesh } from './components/WorldMesh';

// $$ Create a config for this | or this should be coonfigured from state
const MAX_HEIGHT = 10;
const STONE_HEIGHT = MAX_HEIGHT * 0.8;
const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
const SAND_HEIGHT = MAX_HEIGHT * 0.3;
const DIRT2_HEIGHT = MAX_HEIGHT * 0;

interface IWorld {
	changeCurrentPage: (destination: string) => void;
}

export function World({ changeCurrentPage }: IWorld) {
	const [envMap, setEnvMap] = useState<THREE.Texture>();
	// [NOTE]: Not sure what (useRef or useState) is better to use in this case...
	const worldGeometry = useRef<{
		stoneGeometry: THREE.BufferGeometry;
		dirtGeometry: THREE.BufferGeometry;
		dirt2Geometry: THREE.BufferGeometry;
		sandGeometry: THREE.BufferGeometry;
		grassGeometry: THREE.BufferGeometry;
	}>({
		stoneGeometry: new THREE.BoxGeometry(0, 0, 0),
		dirtGeometry: new THREE.BoxGeometry(0, 0, 0),
		dirt2Geometry: new THREE.BoxGeometry(0, 0, 0),
		sandGeometry: new THREE.BoxGeometry(0, 0, 0),
		grassGeometry: new THREE.BoxGeometry(0, 0, 0)
	});
	const textures = useRef({});

	const { gl } = useThree();

	useEffect(() => {
		gl.toneMapping = THREE.ACESFilmicToneMapping;
		gl.outputEncoding = THREE.sRGBEncoding;
		gl.physicallyCorrectLights = true;
		gl.shadowMap.enabled = true;
		gl.shadowMap.type = THREE.PCFSoftShadowMap;
		const pmrem = new THREE.PMREMGenerator(gl);
		// [TODO]: Check if I should dispose any textures
		new RGBELoader()
			.setDataType(THREE.FloatType)
			.load('assets/envmap.hdr', dataTexture => {
				setEnvMap(pmrem.fromEquirectangular(dataTexture).texture);
			});

		textures.current = {
			dirt: new TextureLoader().load('../assets/dirt.png'),
			dirt2: new TextureLoader().load('../assets/dirt2.jpg'),
			grass: new TextureLoader().load('../assets/grass.jpg'),
			sand: new TextureLoader().load('../assets/sand.jpg'),
			water: new TextureLoader().load('../assets/water.jpg'),
			stone: new TextureLoader().load('../assets/stone.png')
		};

		worldGeometry.current = generateWorldGeometry();
	}, [gl]);

	return (
		<>
			<WorldMesh
				envMap={envMap}
				geometry={worldGeometry.current.stoneGeometry}
				map={(textures.current as any).stone}
			/>
			<WorldMesh
				envMap={envMap}
				geometry={worldGeometry.current.grassGeometry}
				map={(textures.current as any).grass}
			/>
			<WorldMesh
				envMap={envMap}
				geometry={worldGeometry.current.dirt2Geometry}
				map={(textures.current as any).dirt2}
			/>
			<WorldMesh
				envMap={envMap}
				geometry={worldGeometry.current.dirtGeometry}
				map={(textures.current as any).dirt}
			/>
			<WorldMesh
				envMap={envMap}
				geometry={worldGeometry.current.sandGeometry}
				map={(textures.current as any).sand}
			/>

			{/* Water mesh */}
			<mesh receiveShadow={true} position={[0, MAX_HEIGHT * 0.1, 0]}>
				<cylinderGeometry args={[17, 17, MAX_HEIGHT * 0.2, 50]} />
				<meshPhysicalMaterial
					envMap={envMap}
					// $$ Water color could alse be varied for different worlds
					color={new THREE.Color('#55aaff')
						.convertSRGBToLinear()
						.multiplyScalar(3)}
					ior={1.4}
					transmission={1}
					transparent={true}
					thickness={1.5}
					envMapIntensity={0.2}
					roughness={1}
					metalness={0.025}
					roughnessMap={(textures.current as any).water}
					metalnessMap={(textures.current as any).water}
				/>
			</mesh>
		</>
	);
}
export interface IHexagon {
	x: number;
	y: number;
	h: number;
}

function makeHexGeometry({ x, y, h }: IHexagon): THREE.CylinderGeometry {
	let geo = new THREE.CylinderGeometry(1, 1, h, 6, 1, false);
	geo.translate(x, h * 0.5, y);
	return geo;
}

function generateWorldGeometry(): {
	stoneGeometry: THREE.BufferGeometry;
	dirtGeometry: THREE.BufferGeometry;
	dirt2Geometry: THREE.BufferGeometry;
	sandGeometry: THREE.BufferGeometry;
	grassGeometry: THREE.BufferGeometry;
} {
	let stoneGeometry: THREE.BufferGeometry = new THREE.BoxGeometry(0, 0, 0);
	let dirtGeometry: THREE.BufferGeometry = new THREE.BoxGeometry(0, 0, 0);
	let dirt2Geometry: THREE.BufferGeometry = new THREE.BoxGeometry(0, 0, 0);
	let sandGeometry: THREE.BufferGeometry = new THREE.BoxGeometry(0, 0, 0);
	let grassGeometry: THREE.BufferGeometry = new THREE.BoxGeometry(0, 0, 0);

	const simplex = new SimplexNoise('seed_here');

	for (let i = -15; i <= 15; i++) {
		for (let j = -15; j <= 15; j++) {
			const position = normalizeHexPosition(i, j);
			if (position.length() > 16) {
				continue;
			}

			let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
			noise = Math.pow(noise, 1.5);

			const hexHeight = noise * MAX_HEIGHT;

			let geometry = makeHexGeometry({
				x: position.x,
				y: position.y,
				h: hexHeight
			});

			if (hexHeight > STONE_HEIGHT) {
				stoneGeometry = mergeBufferGeometries([geometry, stoneGeometry]);
			} else if (hexHeight > DIRT_HEIGHT) {
				dirtGeometry = mergeBufferGeometries([geometry, dirtGeometry]);
			} else if (hexHeight > GRASS_HEIGHT) {
				grassGeometry = mergeBufferGeometries([geometry, grassGeometry]);
			} else if (hexHeight > SAND_HEIGHT) {
				sandGeometry = mergeBufferGeometries([geometry, sandGeometry]);
			} else if (hexHeight > DIRT2_HEIGHT) {
				dirt2Geometry = mergeBufferGeometries([geometry, dirt2Geometry]);
			}
		}
	}

	return { stoneGeometry, dirtGeometry, dirt2Geometry, sandGeometry, grassGeometry };
}

function normalizeHexPosition(x: number, y: number) {
	return new THREE.Vector2((x + (y % 2) * 0.5) * 1.77, y * 1.535);
}
