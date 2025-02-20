import { useRef, useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { getAllNodes, getNodeInfo } from "@/api/explore";
import type ForceGraph3D from "react-force-graph-3d";
import { format } from "date-fns";
import { Maximize2, Eye, Users, X, Clock, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface Link {
  source: number;
  target: number;
}

interface DataItem {
  nodes: Node[];
  links: Link[];
}

interface Node {
  x?: number;
  y?: number;
  z?: number;
  projectId: number;
  title?: string;
  thumbnail?: string;
  authorNickname?: string;
  viewCnt?: number;
}

interface ProjectInstrument {
  instrument_id: number;
  instrument_name: string;
}

interface Project {
  projectId: number;
  forkId: number;
  title: string;
  contents: string;
  contributorCnt: number;
  authorId: number;
  authorNickname: string;
  authorProfileImage: string;
  commentCnt: number;
  likeCnt: number;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  viewCnt: number;
  projectInstruments: Array<ProjectInstrument>;
  etcInstruments: Array<ProjectInstrument>;
  createdAt: string;
  state: boolean;
  instrumentCnt: number;
}

const initialData: GraphData = {
  nodes: [],
  links: [],
};

const ExplorePage = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const [Graph3D, setGraph3D] = useState<typeof ForceGraph3D | null>(null);
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<Project | null>(null);
  const [graphData, setGraphData] = useState<GraphData>(initialData);

  useEffect(() => {
    void import("react-force-graph-3d").then((module) => {
      setGraph3D(() => module.default);
    });
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data: DataItem[] = await getAllNodes();

        const nodeMap = new Map();
        const allNodes = data.flatMap((item: DataItem) => {
          item.nodes.forEach((node) => {
            if (node.projectId) {
              // projectId가 있는 경우만 맵에 추가
              nodeMap.set(node.projectId, node);
            }
          });
          return item.nodes;
        });

        // 유효한 링크만 필터링
        const allLinks = data.flatMap((item: DataItem) =>
          item.links
            .filter((link) => {
              // source와 target이 모두 nodeMap에 존재하는 경우만 포함
              const sourceNode = nodeMap.get(link.source);
              const targetNode = nodeMap.get(link.target);
              return sourceNode && targetNode;
            })
            .map((link) => ({
              source: nodeMap.get(link.source),
              target: nodeMap.get(link.target),
            }))
        );

        console.log("Nodes:", allNodes);
        console.log("Links:", allLinks);
        console.log("NodeMap size:", nodeMap.size);

        setGraphData({ nodes: allNodes, links: allLinks });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchData();
  }, []);

  const createNodeThreeObject = useCallback((node: any) => {
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const texture = new THREE.TextureLoader().load(node.thumbnail);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(sphereGeometry, material);
    const outerSphereGeometry = new THREE.SphereGeometry(5.2, 32, 32);
    const outerMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.FrontSide,
    });
    const outerSphere = new THREE.Mesh(outerSphereGeometry, outerMaterial);

    const group = new THREE.Group();
    group.add(mesh);
    group.add(outerSphere);

    return group;
  }, []);

  const initStarField = useCallback(() => {
    if (!fgRef.current) return;

    const scene = fgRef.current.scene();
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starPositions.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
    });

    const starField = new THREE.Points(starsGeometry, starMaterial);
    scene.add(starField);
  }, []);

  const handleNodeClick = useCallback(
    async (node: Node) => {
      if (!fgRef.current) return;

      try {
        const response = await getNodeInfo(node.projectId);
        setSelectedNode(response as Project);

        if (
          typeof node.x === "undefined" ||
          typeof node.y === "undefined" ||
          typeof node.z === "undefined"
        ) {
          console.warn("Node position coordinates are undefined");
          return;
        }

        const distance = 40;
        const xOffset = -10;

        const newPosition = {
          x: node.x + xOffset,
          y: node.y,
          z: node.z + distance,
        };

        fgRef.current.cameraPosition(newPosition, node, 3000);
      } catch (error) {
        console.error("Error in handleNodeClick:", error);
      }
    },
    [fgRef]
  );

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 200 });
      fgRef.current.controls().autoRotate = true;
      fgRef.current.controls().autoRotateSpeed = 0.3;
      fgRef.current.camera().near = 1;
      fgRef.current.camera().far = 2000;
      fgRef.current.camera().updateProjectionMatrix();

      initStarField();
    }
  }, [Graph3D, initStarField]);

  const handleClick = useCallback(() => {
    navigate("/explore/full");
  }, [navigate]);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 200 });
    }
  }, []);

  return (
    <Layout showRightSidebar={false}>
      <div
        className="relative w-full h-[calc(100vh-82px)] bg-black/95"
        ref={containerRef}
      >
        <button
          onClick={handleClick}
          className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm"
          aria-label="전체화면"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {selectedNode && (
          <div className="absolute left-6 top-6 z-10 max-w-xs rounded-3xl bg-black/90 shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 ease-in-out">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute right-4 top-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative w-full aspect-video bg-black/60">
              <video
                src={selectedNode.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={selectedNode.thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {selectedNode.title}
              </h3>

              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-white/20">
                  <img
                    src={
                      selectedNode.authorProfileImage ||
                      "/api/placeholder/56/56"
                    }
                    alt={`${selectedNode.authorNickname}'s profile`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-small text-white/90">
                    {selectedNode.authorNickname}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(selectedNode.createdAt), "yyyy.MM.dd")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-2xl text-xs text-white/80 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{selectedNode.viewCnt}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-2xl text-xs text-white/80 transition-colors">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedNode.contributorCnt}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-2xl text-xs text-white/80 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="font-medium">{selectedNode.likeCnt}</span>
                </div>
              </div>

              {selectedNode.projectInstruments &&
                selectedNode.projectInstruments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.projectInstruments.map((instrument) => (
                      <div
                        key={instrument.instrument_id}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-white/80 transition-colors"
                      >
                        <span>{instrument.instrument_name}</span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Content */}
              {selectedNode.contents && (
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs leading-relaxed text-white/70">
                    {selectedNode.contents}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3D Graph */}
        {Graph3D && (
          <Graph3D
            ref={fgRef}
            graphData={graphData}
            nodeThreeObject={createNodeThreeObject}
            nodeLabel="title"
            nodeAutoColorBy="projectId"
            onNodeClick={handleNodeClick}
            backgroundColor="#000011"
            nodeResolution={12}
            nodeRelSize={8}
            linkColor={() => "rgba(255, 255, 255, 0.2)"}
            linkWidth={0.3}
            linkOpacity={0.4}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={1}
            linkDirectionalParticleSpeed={0.005}
            nodeId="projectId"
            width={window.innerWidth - 240}
            height={window.innerHeight - 82}
            showNavInfo={false}
          />
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
