import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
interface IWorld {
	changeCurrentPage: (destination: string) => void;
}

export function World({ changeCurrentPage }: IWorld) {
	const [envMap, setEnvMap] = useState<THREE.Texture>();
	const [worldGeometry, setWoldGeometry] = useState<THREE.BufferGeometry>(
		new THREE.BoxGeometry(0, 0, 0)
	);

	const { gl } = useThree();

	useEffect(() => {
		const pmrem = new THREE.PMREMGenerator(gl);
		// [TODO]: Check if I should dispose any textures
		new RGBELoader()
			.setDataType(THREE.FloatType)
			.load('assets/envmap.hdr', dataTexture => {
				setEnvMap(pmrem.fromEquirectangular(dataTexture).texture);
			});
	}, [gl]);

	useEffect(() => {
		createHex({ x: 0, y: 0, h: 3 });

		// [INFO]: Do not include `createHex` in useEffect dependencies, because it will cause infinite re-render
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const createHex = (parameters: IHexagon): void => {
		let geo = makeHexGeometry(parameters);
		setWoldGeometry(mergeBufferGeometries([worldGeometry, geo]));
	};

	return (
		<mesh geometry={worldGeometry} onClick={() => changeCurrentPage('main')}>
			<meshStandardMaterial envMap={envMap} flatShading={true} />
		</mesh>
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
