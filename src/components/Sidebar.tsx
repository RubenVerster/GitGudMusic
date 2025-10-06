import { FaChartBar, FaFilter } from "react-icons/fa";
import type { MusicStats } from "../types/music";

interface SidebarProps {
  stats: MusicStats;
  folders: string[];
  fileTypeFilter: string;
  folderFilter: string;
  onFileTypeChange: (fileType: string) => void;
  onFolderChange: (folder: string) => void;
  isLoading: boolean;
}

const Sidebar = ({
  stats,
  folders,
  fileTypeFilter,
  folderFilter,
  onFileTypeChange,
  onFolderChange,
  isLoading,
}: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="stats-panel">
        <h3>
          <FaChartBar /> Collection Stats
        </h3>
        <div className="stat-item">
          <span className="stat-label">Total Files:</span>
          <span className="stat-value">
            {isLoading ? "..." : stats.totalFiles}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Folders:</span>
          <span className="stat-value">
            {isLoading ? "..." : stats.totalFolders}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Audio Files:</span>
          <span className="stat-value">
            {isLoading ? "..." : stats.audioFiles}
          </span>
        </div>
      </div>

      <div className="filter-panel">
        <h3>
          <FaFilter /> Filters
        </h3>
        <div className="filter-group">
          <label>File Type:</label>
          <select
            value={fileTypeFilter}
            onChange={(e) => onFileTypeChange(e.target.value)}
          >
            <option value="">All Files</option>
            <option value="mp3">MP3</option>
            <option value="m4a">M4A</option>
            <option value="xspf">Playlists</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Folder:</label>
          <select
            value={folderFilter}
            onChange={(e) => onFolderChange(e.target.value)}
          >
            <option value="">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
