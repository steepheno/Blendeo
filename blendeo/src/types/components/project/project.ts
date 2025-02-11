export interface ProjectTreeData {
  nodes: ProjectTreeNode[];
  links: ProjectTreeLink[];
}

export interface ProjectTreeNode {
  projectId: number;
  title: string;
  thumbnail: string | null;
  authorNickname: string;
  viewCnt: number;
}

export interface ProjectTreeLink {
  source: number;
  target: number;
}
