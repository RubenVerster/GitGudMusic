import { useState } from "react";
import { FaChartBar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import type { MusicStats } from "../types/music";

interface MobileStatsPanelProps {
  stats: MusicStats;
  isLoading: boolean;
}

const MobileStatsPanel = ({ stats, isLoading }: MobileStatsPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`mobile-stats-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="mobile-stats-toggle" onClick={toggleExpanded}>
        <div className="mobile-stats-header">
          <FaChartBar />
          <span>Collection Stats</span>
          {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mobile-stats-content">
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
      )}
    </div>
  );
};

export default MobileStatsPanel;
