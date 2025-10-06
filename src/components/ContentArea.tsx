import {
  FaHome,
  FaSpinner,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import type { MusicNode, ViewType, FilterState } from "../types/music";
import TreeView from "./views/TreeView";
import ListView from "./views/ListView";
import GridView from "./views/GridView";

interface ContentAreaProps {
  data: MusicNode | null;
  currentView: ViewType;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  onSongClick: (songName: string) => void;
}

const ContentArea = ({
  data,
  currentView,
  isLoading,
  error,
  filters,
  onSongClick,
}: ContentAreaProps) => {
  const countItems = (
    node: MusicNode | null
  ): { files: number; folders: number } => {
    if (!node) return { files: 0, folders: 0 };

    let files = 0;
    let folders = 0;

    if (node.type === "file") {
      files++;
    } else if (node.type === "folder" && node.name !== "Music Collection") {
      folders++;
    }

    if (node.children) {
      for (const child of node.children) {
        const childCount = countItems(child);
        files += childCount.files;
        folders += childCount.folders;
      }
    }

    return { files, folders };
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <FaSpinner className="fa-spin" />
          <p>Loading your music collection...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error">
          <FaExclamationTriangle />
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            <FaRedo /> Retry
          </button>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="error">
          <FaExclamationTriangle />
          <p>No music data available</p>
        </div>
      );
    }

    switch (currentView) {
      case "tree":
        return <TreeView data={data} onSongClick={onSongClick} />;
      case "list":
        return <ListView data={data} onSongClick={onSongClick} />;
      case "grid":
        return <GridView data={data} onSongClick={onSongClick} />;
      default:
        return <TreeView data={data} onSongClick={onSongClick} />;
    }
  };

  const count = countItems(data);
  const hasFilters = filters.searchTerm;
  const resultsText = hasFilters
    ? `${count.files} files, ${count.folders} folders found`
    : `${count.files} files, ${count.folders} folders total`;

  return (
    <main className="content">
      <div className="content-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item active">
            <FaHome /> Music Collection
          </span>
        </div>
        <div className="results-info">
          {isLoading ? "Loading..." : resultsText}
        </div>
      </div>

      <div className="music-browser">{renderContent()}</div>
    </main>
  );
};

export default ContentArea;
