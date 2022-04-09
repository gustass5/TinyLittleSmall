import * as THREE from 'three';

interface IWorldMesh {
	envMap: THREE.Texture | null | undefined;
	geometry: THREE.BufferGeometry;
	map: THREE.Texture;
}

export function WorldMesh({ envMap, geometry, map }: IWorldMesh) {
	return (
		<mesh geometry={geometry} castShadow={true} receiveShadow={true}>
			<meshStandardMaterial
				envMap={envMap}
				flatShading={true}
				envMapIntensity={0.4}
				map={map}
			/>
		</mesh>
	);
}
