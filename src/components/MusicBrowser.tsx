import { useState, useEffect, useCallback } from "react";
import type {
  MusicNode,
  MusicBrowserState,
  ViewType,
  FilterState,
  MusicStats,
} from "../types/music";
import { musicDataService } from "../services/musicDataService";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import MobileStatsPanel from "./MobileStatsPanel";
import "../styles/MusicBrowser.css";

const MusicBrowser = () => {
  const [state, setState] = useState<MusicBrowserState>({
    currentView: "tree",
    currentData: null,
    filteredData: null,
    isLoading: true,
    error: null,
    filters: {
      searchTerm: "",
    },
  });

  // Load music data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const data = await musicDataService.loadMusicData();
        setState((prev) => ({
          ...prev,
          currentData: data,
          filteredData: data,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load music data",
          isLoading: false,
        }));
      }
    };

    loadData();
  }, []);

  const matchesFilters = useCallback(
    (node: MusicNode, filters: FilterState): boolean => {
      // Only search filter now
      if (
        filters.searchTerm &&
        !node.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        // Check if any children match
        if (node.children && node.children.length > 0) {
          return node.children.some((child) => matchesFilters(child, filters));
        }
        return false;
      }

      return true;
    },
    []
  );

  const filterData = useCallback(
    (node: MusicNode, filters: FilterState): MusicNode => {
      if (!node) return node;

      const filtered: MusicNode = { ...node, children: [] };

      if (node.children) {
        for (const child of node.children) {
          const filteredChild = filterData(child, filters);
          if (filteredChild && matchesFilters(filteredChild, filters)) {
            filtered.children!.push(filteredChild);
          }
        }
      }

      return filtered;
    },
    [matchesFilters]
  );

  // Apply filters whenever filters or data change
  useEffect(() => {
    if (state.currentData && !state.isLoading) {
      const filtered = filterData(state.currentData, state.filters);
      setState((prev) => ({ ...prev, filteredData: filtered }));
    }
  }, [state.currentData, state.filters, state.isLoading, filterData]);

  const calculateStats = useCallback((node: MusicNode): MusicStats => {
    let totalFiles = 0;
    let totalFolders = 0;
    let audioFiles = 0;

    if (node.type === "file") {
      totalFiles++;
      if (["mp3", "m4a", "wav", "flac"].includes(node.extension || "")) {
        audioFiles++;
      }
    } else if (node.type === "folder" && node.name !== "Music Collection") {
      totalFolders++;
    }

    if (node.children) {
      for (const child of node.children) {
        const childStats = calculateStats(child);
        totalFiles += childStats.totalFiles;
        totalFolders += childStats.totalFolders;
        audioFiles += childStats.audioFiles;
      }
    }

    return { totalFiles, totalFolders, audioFiles };
  }, []);

  const handleViewChange = useCallback((view: ViewType) => {
    setState((prev) => ({ ...prev, currentView: view }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, searchTerm: "" },
    }));
  }, []);

  const searchOnYouTubeMusic = useCallback((songName: string) => {
    // Clean up the song name for better search results
    let searchTerm = songName;

    // Remove file extension
    searchTerm = searchTerm.replace(/\.(mp3|m4a|wav|flac)$/i, "");

    // Remove common patterns that might interfere with search, but preserve remix/version info
    searchTerm = searchTerm.replace(
      /\s*\((?:Official|Music|Video|Audio|Lyric|HD|HQ|4K|1080p|720p|480p|360p|240p|144p)\s*(?:Video|Audio|Music|Version)?\)\s*/gi,
      " "
    ); // Remove technical/quality indicators in parentheses
    searchTerm = searchTerm.replace(
      /\s*\[(?:Official|Music|Video|Audio|Lyric|HD|HQ|4K|1080p|720p|480p|360p|240p|144p)\s*(?:Video|Audio|Music|Version)?\]\s*/gi,
      " "
    ); // Remove technical/quality indicators in brackets
    searchTerm = searchTerm.replace(
      /\s*-\s*(Official|Music|Video|Audio|Remix|Extended|Radio|Edit|Version|Mix|Remaster|Remastered).*$/i,
      ""
    ); // Remove common suffixes
    searchTerm = searchTerm.replace(/\s+/g, " ").trim(); // Clean up extra spaces

    // Encode the search term for URL
    const encodedSearchTerm = encodeURIComponent(searchTerm);

    // Create YouTube Music search URL
    const youtubeUrl = `https://music.youtube.com/search?q=${encodedSearchTerm}`;

    // Open in new tab
    window.open(youtubeUrl, "_blank");
  }, []);

  const stats = state.currentData
    ? calculateStats(state.currentData)
    : { totalFiles: 0, totalFolders: 0, audioFiles: 0 };

  return (
    <div className="music-browser-app">
      <Header
        currentView={state.currentView}
        searchTerm={state.filters.searchTerm}
        onViewChange={handleViewChange}
        onSearchChange={(searchTerm: string) =>
          handleFilterChange({ searchTerm })
        }
        onClearSearch={handleClearSearch}
      />

      <div className="main-content">
        <Sidebar stats={stats} isLoading={state.isLoading} />

        <ContentArea
          data={state.filteredData}
          currentView={state.currentView}
          isLoading={state.isLoading}
          error={state.error}
          filters={state.filters}
          onSongClick={searchOnYouTubeMusic}
        />
      </div>

      <MobileStatsPanel stats={stats} isLoading={state.isLoading} />
    </div>
  );
};

export default MusicBrowser;
