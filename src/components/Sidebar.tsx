import { FaChartBar } from "react-icons/fa";
import type { MusicStats } from "../types/music";

interface SidebarProps {
  stats: MusicStats;
  isLoading: boolean;
}

const Sidebar = ({ stats, isLoading }: SidebarProps) => {
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
    </aside>
  );
};

export default Sidebar;
