import { FaFolder, FaMusic, FaFile } from "react-icons/fa";
import { MdPlaylistPlay } from "react-icons/md";
import type { MusicNode } from "../../types/music";

interface ListViewProps {
  data: MusicNode;
  onSongClick: (songName: string) => void;
}

const ListView = ({ data, onSongClick }: ListViewProps) => {
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

  const renderListItems = (node: MusicNode): React.JSX.Element[] => {
    const items: React.JSX.Element[] = [];

    if (node.name !== "Music Collection") {
      const icon = getFileIcon(node);
      const type =
        node.type === "file"
          ? (node.extension || "file").toUpperCase()
          : "FOLDER";
      const isAudioFile =
        node.type === "file" &&
        ["mp3", "m4a", "wav", "flac"].includes(node.extension || "");

      const handleClick = () => {
        if (isAudioFile) {
          onSongClick(node.name);
        }
      };

      items.push(
        <div key={node.path || node.name} className="list-item">
          <div className="list-item-icon">{icon}</div>
          <div
            className={`list-item-name ${isAudioFile ? "clickable-song" : ""}`}
            onClick={isAudioFile ? handleClick : undefined}
            title={isAudioFile ? "Click to search on YouTube Music" : undefined}
          >
            {node.name}
          </div>
          <div className="list-item-type">{type}</div>
        </div>
      );
    }

    if (node.children) {
      for (const child of node.children) {
        items.push(...renderListItems(child));
      }
    }

    return items;
  };

  return <div className="list-view">{renderListItems(data)}</div>;
};

export default ListView;
