export interface MusicNode {
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: MusicNode[];
  path: string;
}

export interface MusicStats {
  totalFiles: number;
  totalFolders: number;
  audioFiles: number;
}

export interface FilterState {
  searchTerm: string;
  fileTypeFilter: string;
  folderFilter: string;
}

export type ViewType = 'tree' | 'list' | 'grid';

export interface MusicBrowserState {
  currentView: ViewType;
  currentData: MusicNode | null;
  filteredData: MusicNode | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
}
