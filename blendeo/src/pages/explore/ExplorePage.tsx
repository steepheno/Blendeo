import { useRef, useCallback, useEffect, useState } from "react";
import Layout from "@/components/layout/ChatLayout";
import * as THREE from "three";

interface GraphData {
  nodes: Array<{
    id: number;
    title: string;
    thumbnail: string;
    authorNickname: string;
    viewCnt: number;
  }>;
  links: Array<{
    source: number;
    target: number;
  }>;
}

// 타입 정의를 위한 인터페이스
interface Node {
  id: number;
  title: string;
  thumbnail: string;
  authorNickname: string;
  viewCnt: number;
  x?: number;
  y?: number;
  z?: number;
}

const ExplorePage = () => {
  const [Graph3D, setGraph3D] = useState<
    typeof import("react-force-graph-3d").default | null
  >(null);
  const [fullWindowMode, setFullWindowMode] = useState<boolean>(false);

  const fgRef = useRef();
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  // 동적으로 ForceGraph3D 컴포넌트 임포트
  useEffect(() => {
    import("react-force-graph-3d").then((module) => {
      setGraph3D(() => module.default);
    });
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      // @ts-expect-error - 타입 정의가 불완전할 수 있음
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 120 });
      // @ts-expect-error - 타입 정의가 불완전할 수 있음
      fgRef.current.controls().autoRotate = true;
      // @ts-expect-error - 타입 정의가 불완전할 수 있음
      fgRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, [Graph3D]);
  const createNodeThreeObject = useCallback((node: GraphData["nodes"][0]) => {
    // 구체 지오메트리 생성
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);

    // 이미지를 텍스처로 로드
    const texture = new THREE.TextureLoader().load(node.thumbnail);

    // 텍스처 매핑 설정
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // 재질 생성 (이미지를 구의 내부에 매핑)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // 구의 내부에 텍스처를 매핑
    });

    // 메시 생성
    const mesh = new THREE.Mesh(sphereGeometry, material);

    // 추가적인 외부 구체 (반투명 효과)
    const outerSphereGeometry = new THREE.SphereGeometry(5.2, 32, 32);
    const outerMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.FrontSide,
    });
    const outerSphere = new THREE.Mesh(outerSphereGeometry, outerMaterial);

    // 그룹으로 합치기
    const group = new THREE.Group();
    group.add(mesh);
    group.add(outerSphere);

    return group;
  }, []);

  useEffect(() => {
    // 샘플 데이터 설정

    const data = {
      nodes: [
        {
          id: 5,
          title: "장충동 왕족발 보쌈1",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdPAdHVSpSa9Z2jTwlryHZQOdVy4u3jlYXg&s",
          authorNickname: "test1",
          viewCnt: 271,
        },
        {
          id: 6,
          title: "장충동 왕족발 보쌈2",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdPAdHVSpSa9Z2jTwlryHZQOdVy4u3jlYXg&s",
          authorNickname: "test2",
          viewCnt: 221,
        },
        {
          id: 7,
          title: "장충동 왕족발 보쌈2",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdPAdHVSpSa9Z2jTwlryHZQOdVy4u3jlYXg&s",
          authorNickname: "test3",
          viewCnt: 221,
        },
        {
          id: 8,
          title: "장충동 왕족발 보쌈2",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdPAdHVSpSa9Z2jTwlryHZQOdVy4u3jlYXg&s",
          authorNickname: "test3",
          viewCnt: 221,
        },
        {
          id: 9,
          title: "장충동 왕족발 보쌈2",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdPAdHVSpSa9Z2jTwlryHZQOdVy4u3jlYXg&s",
          authorNickname: "test3",
          viewCnt: 221,
        },
        {
          id: 10,
          title: "장충동 왕족발 보쌈2",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdPAdHVSpSa9Z2jTwlryHZQOdVy4u3jlYXg&s",
          authorNickname: "test3",
          viewCnt: 221,
        },
      ],
      links: [
        {
          source: 5,
          target: 6,
        },
        {
          source: 6,
          target: 7,
        },
        {
          source: 6,
          target: 8,
        },
        {
          source: 6,
          target: 9,
        },
        {
          source: 9,
          target: 10,
        },
      ],
    };
    setGraphData(data);
  }, []);

  const handleNodeClick = useCallback(
    (node: Node) => {
      if (!fgRef.current || !node.x || !node.y || !node.z) return;

      // 노드를 클릭했을 때 카메라 포지션 변경
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      // @ts-expect-error - 타입 정의가 불완전할 수 있음
      fgRef.current.cameraPosition(
        {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio,
        },
        node,
        3000
      );
    },
    [fgRef]
  );

  const content = (
    <>
      <button
        onClick={() => setFullWindowMode((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {fullWindowMode ? "축소" : "확대"}
      </button>
      <div className="w-full h-[calc(100vh-130px)] bg-gray-900 absolute overflow-hidden cursor-grab top-0 left-0">
        <div className="w-full h-full">
          {Graph3D && (
            <Graph3D
              ref={fgRef}
              graphData={graphData}
              nodeThreeObject={createNodeThreeObject}
              nodeLabel="title"
              nodeAutoColorBy="id"
              onNodeClick={handleNodeClick}
              backgroundColor="#FFF"
              nodeResolution={8}
              linkWidth={0.2}
              linkOpacity={0.5}
              nodeRelSize={6}
              linkColor={() => "rgb(130, 121, 121)"}
            />
          )}
        </div>
      </div>
    </>
  );

  return fullWindowMode ? content : <Layout>{content}</Layout>;
};

export default ExplorePage;
