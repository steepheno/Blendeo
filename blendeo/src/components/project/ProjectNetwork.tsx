import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import type { Edge, Node, Options } from 'vis-network/declarations/network/Network';
import type { ProjectTreeData } from '@/types/components/project/project';

interface ProjectTreeProps {
  data: ProjectTreeData;
  onNodeClick?: (nodeId: number) => void;
  initialFocusNode?: number;
}

interface CustomNode extends Node {
  id: number;
  label: string;
  level: number;
  shape: string;
  image: string;
  size: number;
  color: {
    border: string;
    background: string;
  };
  title: string;
}

function isCustomNode(
  node: CustomNode | CustomNode[] | null | undefined
): node is CustomNode {
  return Boolean(
    node &&
    !Array.isArray(node) &&
    'level' in node &&
    typeof node.level === 'number'
  );
}

const ProjectNetwork: React.FC<ProjectTreeProps> = ({ data, onNodeClick, initialFocusNode }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);
  const focusedNodeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    const colorPalettes = {
      core: [
        '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
        '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
      ]
    } as const;

    const BASE_NODE_SIZE = 100;
    const SIZE_REDUCTION_FACTOR = 0.7;
    const TARGET_DISPLAY_SIZE = 240;

    const calculateNodeSize = (level: number): number => {
      return Math.max(40, BASE_NODE_SIZE * Math.pow(SIZE_REDUCTION_FACTOR, level));
    };

    const calculateZoomScale = (level: number): number => {
      const currentNodeSize = calculateNodeSize(level);
      return TARGET_DISPLAY_SIZE / currentNodeSize;
    };

    // Calculate node levels
    const nodeLevels = new Map<number, number>();
    const visited = new Set<number>();

    const calculateLevels = (nodeId: number, level: number): void => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      nodeLevels.set(nodeId, Math.min(level, nodeLevels.get(nodeId) ?? Infinity));

      data.links
        .filter(link => link.source === nodeId)
        .forEach(link => calculateLevels(link.target, level + 1));
    };

    // Find root nodes
    const targetNodes = new Set(data.links.map(link => link.target));
    const rootNodes = data.nodes
      .map(node => node.projectId)
      .filter(id => !targetNodes.has(id));

    // Calculate levels starting from root nodes
    rootNodes.forEach(rootId => calculateLevels(rootId, 0));

    // Create nodes dataset with explicit typing
    const nodes = new DataSet<CustomNode, 'id'>(
      data.nodes.map(node => {
        const level = nodeLevels.get(node.projectId) ?? 0;
        return {
          id: node.projectId,
          label: node.title,
          shape: 'circularImage',
          image: node.thumbnail || '/api/placeholder/400/320',
          size: calculateNodeSize(level),
          level,
          color: {
            border: colorPalettes.core[node.projectId % colorPalettes.core.length],
            background: colorPalettes.core[node.projectId % colorPalettes.core.length],
          },
          title: `${node.title}\n작성자: ${node.authorNickname}\n조회수: ${node.viewCnt}`
        };
      })
    );

    // Create edges dataset with explicit typing
    const edges = new DataSet<Edge, 'id'>(
      data.links.map((link, index) => ({
        id: index,
        from: link.source,
        to: link.target,
        color: {
          color: colorPalettes.core[0],
          opacity: 0.6
        },
        width: 2,
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          roundness: 0.5
        }
      }))
    );

    // Network options with strict typing
    const options: Options = {
      height: '800px',
      width: '100%',
      nodes: {
        font: { size: 12, color: '#000000', face: 'arial' },
        scaling: { label: { enabled: true, min: 8, max: 20 } }
      },
      interaction: {
        hover: true,
        hoverConnectedEdges: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        selectable: true
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'LR',
          sortMethod: 'directed',
          nodeSpacing: 200,
          levelSeparation: 300,
          treeSpacing: 200
        }
      },
      physics: { enabled: false },
      edges: {
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'horizontal',
          roundness: 0.5
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.1)',
          size: 5,
          x: 3,
          y: 3
        }
      }
    };

    // Create network
    const network = new Network(networkRef.current, { nodes, edges }, options);
    networkInstanceRef.current = network;

    // Event handlers with improved type safety
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeData = nodes.get(nodeId);
        if (isCustomNode(nodeData)) {
          const zoomScale = calculateZoomScale(nodeData.level);
          network.focus(nodeId, {
            scale: zoomScale,
            animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
          });
          focusedNodeRef.current = nodeId;
          onNodeClick?.(nodeId);
        }
      } else {
        network.fit({
          animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
        });
        focusedNodeRef.current = null;
      }
    });

    // Handle initial focus with improved type safety
    if (initialFocusNode) {
      setTimeout(() => {
        const nodeData = nodes.get(initialFocusNode);
        if (isCustomNode(nodeData)) {
          const zoomScale = calculateZoomScale(nodeData.level);
          network.focus(initialFocusNode, {
            scale: zoomScale,
            animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
          });
          focusedNodeRef.current = initialFocusNode;
          onNodeClick?.(initialFocusNode);
        }
      }, 1000);
    }

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [data, onNodeClick, initialFocusNode]);

  return (
    <div ref={networkRef} className="w-full h-full border rounded bg-white" />
  );
};

export default ProjectNetwork;