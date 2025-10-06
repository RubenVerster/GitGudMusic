import { FaFolder, FaMusic, FaFile } from "react-icons/fa";
import { MdPlaylistPlay } from "react-icons/md";
import type { MusicNode } from "../../types/music";

interface TreeViewProps {
  data: MusicNode;
  onSongClick: (songName: string) => void;
}

const TreeView = ({ data, onSongClick }: TreeViewProps) => {
  const getFileIcon = (node: MusicNode) => {
    if (node.type === "folder") {
      return <FaFolder />;
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

  const renderTreeNode = (
    node: MusicNode,
    level: number = 0
  ): React.JSX.Element[] => {
    const items: React.JSX.Element[] = [];

    if (node.name !== "Music Collection") {
      const indent = "│   ".repeat(level);
      const connector = level > 0 ? "├── " : "";
      const icon = getFileIcon(node);

      const isAudioFile =
        node.type === "file" &&
        ["mp3", "m4a", "wav", "flac"].includes(node.extension || "");
      const isPlaylistFile = node.type === "file" && node.extension === "xspf";

      let className = `tree-item ${node.type}`;
      if (isAudioFile) className += " audio-file";
      if (isPlaylistFile) className += " playlist-file";

      const handleClick = () => {
        if (isAudioFile) {
          onSongClick(node.name);
        }
      };

      items.push(
        <div key={node.path || node.name} className={className}>
          <span className="tree-structure">
            {indent}
            {connector}
          </span>
          <span className="tree-icon">{icon}</span>
          {isAudioFile ? (
            <span
              className="clickable-song"
              onClick={handleClick}
              title="Click to search on YouTube Music"
            >
              {node.name}
            </span>
          ) : (
            <span>{node.name}</span>
          )}
        </div>
      );
    }

    if (node.children) {
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
