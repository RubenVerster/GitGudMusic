import {
  FaMusic,
  FaSearch,
  FaTimes,
  FaSitemap,
  FaList,
  FaTh,
} from "react-icons/fa";
import type { ViewType } from "../types/music";

interface HeaderProps {
  currentView: ViewType;
  searchTerm: string;
  onViewChange: (view: ViewType) => void;
  onSearchChange: (searchTerm: string) => void;
  onClearSearch: () => void;
}

const Header = ({
  currentView,
  searchTerm,
  onViewChange,
  onSearchChange,
  onClearSearch,
}: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <FaMusic /> GitGudMusic Browser
        </h1>
        <div className="header-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              id="searchInput"
              placeholder="Search your music collection..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-btn"
                onClick={onClearSearch}
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="view-controls">
            <button
              className={`view-btn ${currentView === "tree" ? "active" : ""}`}
              onClick={() => onViewChange("tree")}
              title="Tree View"
            >
              <FaSitemap />
            </button>
            <button
              className={`view-btn ${currentView === "list" ? "active" : ""}`}
              onClick={() => onViewChange("list")}
              title="List View"
            >
              <FaList />
            </button>
            <button
              className={`view-btn ${currentView === "grid" ? "active" : ""}`}
              onClick={() => onViewChange("grid")}
              title="Grid View"
            >
              <FaTh />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
