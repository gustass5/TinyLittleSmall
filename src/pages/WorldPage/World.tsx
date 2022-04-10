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
	seed: string;
	changeCurrentPage: (destination: string) => void;
}

export function World({ changeCurrentPage, seed }: IWorld) {
	const simplex = useRef(new SimplexNoise(seed));
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
			dirt: new TextureLoader().load('../assets/textures_1/dirt.png'),
			dirt2: new TextureLoader().load('../assets/textures_1/dirt2.png'),
			grass: new TextureLoader().load('../assets/textures_1/grass.png'),
			sand: new TextureLoader().load('../assets/textures_1/sand.png'),
			water: new TextureLoader().load('../assets/textures_1/water.png'),
			stone: new TextureLoader().load('../assets/textures_1/stone.png')
		};

		worldGeometry.current = generateWorldGeometry(simplex.current);
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

			{/* Sides mesh */}
			<mesh receiveShadow={true} position={[0, MAX_HEIGHT * 0.125, 0]}>
				<cylinderGeometry args={[17.1, 17.1, MAX_HEIGHT * 0.25, 50, 1, true]} />
				<meshPhysicalMaterial
					envMap={envMap}
					map={(textures.current as any).dirt}
					envMapIntensity={0.2}
					side={THREE.DoubleSide}
				/>
			</mesh>
			{/* Floor mesh */}
			<mesh receiveShadow={true} position={[0, -MAX_HEIGHT * 0.05, 0]}>
				<cylinderGeometry args={[17.1, 17.1, MAX_HEIGHT * 0.1, 50]} />
				<meshPhysicalMaterial
					envMap={envMap}
					map={(textures.current as any).dirt2}
					envMapIntensity={0.1}
					side={THREE.DoubleSide}
				/>
			</mesh>

			<CloudMesh envMap={envMap} />
		</>
	);
}
export interface IHexagon {
	x: number;
	y: number;
	h: number;
}

function makeHexGeometry({ x, y, h }: IHexagon): THREE.CylinderGeometry {
	const geo = new THREE.CylinderGeometry(1, 1, h, 6, 1, false);
	geo.translate(x, h * 0.5, y);
	return geo;
}

function makeStoneGeometry(
	{ x, y, h }: IHexagon,
	simplex: SimplexNoise
): THREE.SphereGeometry {
	const px = Math.abs(simplex.noise2D(x, y)) * 0.4;
	const py = Math.abs(simplex.noise2D(y, x)) * 0.4;

	const geo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
	geo.translate(x + px, h, y + py);

	return geo;
}

function makeTreeGeometry(
	{ x, y, h }: IHexagon,
	simplex: SimplexNoise
): THREE.BufferGeometry {
	const treeHeight = Math.abs(simplex.noise2D(x, y)) * 1 + 1.25;

	const geo = new THREE.CylinderGeometry(0, 1.5, treeHeight, 3);
	geo.translate(x, h + treeHeight * 0 + 1, y);

	const geo2 = new THREE.CylinderGeometry(0, 1.15, treeHeight, 3);
	geo2.translate(x, h + treeHeight * 0.6 + 1, y);

	const geo3 = new THREE.CylinderGeometry(0, 0.8, treeHeight, 3);
	geo3.translate(x, h + treeHeight * 1.25 + 1, y);

	return mergeBufferGeometries([geo, geo2, geo3]);
}

function CloudMesh(
	{ envMap }: { envMap: THREE.Texture | undefined },
	simplex: SimplexNoise
) {
	let geo: THREE.BufferGeometry = new THREE.SphereGeometry(0, 0, 0);
	let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
	// count = Math.random() * 4;

	for (let i = 0; i < count; i++) {
		const puff1 = new THREE.SphereGeometry(1.2, 7, 7);
		const puff2 = new THREE.SphereGeometry(1.5, 7, 7);
		const puff3 = new THREE.SphereGeometry(0.9, 7, 7);

		puff1.translate(-1.85, Math.random() * 0.3, 0);
		puff2.translate(0, Math.random() * 0.3, 0);
		puff3.translate(1.85, Math.random() * 0.3, 0);

		const cloudGeo = mergeBufferGeometries([puff1, puff2, puff3]);
		cloudGeo.translate(
			Math.random() * 20 - 10,
			Math.random() * 7 + 7,
			Math.random() * 20 - 10
		);

		cloudGeo.rotateY(Math.random() * Math.PI * 2);

		geo = mergeBufferGeometries([geo, cloudGeo]);
	}

	return (
		<mesh geometry={geo}>
			<meshStandardMaterial
				envMap={envMap}
				envMapIntensity={0.75}
				flatShading={true}
			/>
		</mesh>
	);
}

function generateWorldGeometry(simplex: SimplexNoise): {
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

	for (let i = -15; i <= 15; i++) {
		for (let j = -15; j <= 15; j++) {
			const position = normalizeHexPosition(i, j);
			if (position.length() > 16) {
				continue;
			}

			let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
			noise = Math.pow(noise, 1.5);

			const hexHeight = noise * MAX_HEIGHT;

			const geometryParameters = {
				x: position.x,
				y: position.y,
				h: hexHeight
			};

			let geometry = makeHexGeometry(geometryParameters);

			if (hexHeight > STONE_HEIGHT) {
				stoneGeometry = mergeBufferGeometries([geometry, stoneGeometry]);

				if (Math.abs(simplex.noise2D(i, j)) > 0.8) {
					stoneGeometry = mergeBufferGeometries([
						stoneGeometry,
						makeStoneGeometry(geometryParameters, simplex)
					]);
				}
			} else if (hexHeight > DIRT_HEIGHT) {
				dirtGeometry = mergeBufferGeometries([geometry, dirtGeometry]);

				if (Math.abs(simplex.noise2D(i, j)) > 0.4) {
					grassGeometry = mergeBufferGeometries([
						grassGeometry,
						makeTreeGeometry(geometryParameters, simplex)
					]);
				}
			} else if (hexHeight > GRASS_HEIGHT) {
				grassGeometry = mergeBufferGeometries([geometry, grassGeometry]);
			} else if (hexHeight > SAND_HEIGHT) {
				sandGeometry = mergeBufferGeometries([geometry, sandGeometry]);

				if (Math.abs(simplex.noise2D(i, j)) > 0.8 && stoneGeometry) {
					stoneGeometry = mergeBufferGeometries([
						stoneGeometry,
						makeStoneGeometry(geometryParameters, simplex)
					]);
				}
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
