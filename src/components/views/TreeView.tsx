import { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaMusic,
  FaFile,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { MdPlaylistPlay } from "react-icons/md";
import type { MusicNode } from "../../types/music";

interface TreeViewProps {
  data: MusicNode;
  onSongClick: (songName: string) => void;
}

const TreeView = ({ data, onSongClick }: TreeViewProps) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const getFileIcon = (node: MusicNode, isCollapsed?: boolean) => {
    if (node.type === "folder") {
      return isCollapsed ? <FaFolder /> : <FaFolderOpen />;
    }

    switch (node.extension) {
      case "mp3":
      case "m4a":
      case "wav":
      case "flac":
        return <FaMusic />;
      case "xspf":
        return <MdPlaylistPlay />;
      default:
        return <FaFile />;
    }
  };

  const removeFileExtension = (filename: string): string => {
    // Remove common audio file extensions
    return filename.replace(/\.(mp3|m4a|wav|flac|aac|ogg|wma)$/i, "");
  };

  const renderTreeNode = (
    node: MusicNode,
    level: number = 0
  ): React.JSX.Element[] => {
    const items: React.JSX.Element[] = [];

    if (node.name !== "Music Collection") {
      const isCollapsed = collapsedFolders.has(node.path);
      const icon = getFileIcon(node, isCollapsed);

      const isAudioFile =
        node.type === "file" &&
        ["mp3", "m4a", "wav", "flac"].includes(node.extension || "");
      const isPlaylistFile = node.type === "file" && node.extension === "xspf";
      const isFolder = node.type === "folder";

      let className = `tree-item ${node.type}`;
      if (isAudioFile) className += " audio-file";
      if (isPlaylistFile) className += " playlist-file";
      if (isFolder) className += " folder";

      const handleClick = () => {
        if (isAudioFile) {
          // Remove extension before searching
          const cleanName = removeFileExtension(node.name);
          onSongClick(cleanName);
        } else if (isFolder) {
          toggleFolder(node.path);
        }
      };

      // Display name without extension for audio files
      const displayName = isAudioFile
        ? removeFileExtension(node.name)
        : node.name;

      items.push(
        <div
          key={node.path || node.name}
          className={className}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {isFolder && (
            <span className="folder-toggle">
              {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
            </span>
          )}
          <span className="tree-icon">{icon}</span>
          <span
            className={
              isAudioFile
                ? "clickable-song"
                : isFolder
                ? "clickable-folder"
                : ""
            }
            onClick={handleClick}
            title={
              isAudioFile
                ? "Click to search on YouTube Music"
                : isFolder
                ? "Click to collapse/expand folder"
                : undefined
            }
          >
            {displayName}
          </span>
        </div>
      );
    }

    // Only render children if folder is not collapsed
    if (node.children && !collapsedFolders.has(node.path)) {
      for (const child of node.children) {
        items.push(
          ...renderTreeNode(
            child,
            node.name === "Music Collection" ? 0 : level + 1
          )
        );
      }
    }

    return items;
  };

  return <div className="tree-view">{renderTreeNode(data)}</div>;
};

export default TreeView;
