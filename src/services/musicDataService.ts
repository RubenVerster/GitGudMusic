import type { MusicNode } from "../types/music";

class MusicDataService {
  private musicData: MusicNode | null = null;
  private isLoading = false;

  // Method to clear cache and force reload
  clearCache() {
    this.musicData = null;
    // Also clear localStorage cache
    localStorage.removeItem("musicData-json");
    localStorage.removeItem("musicData-timestamp");
    console.log("Music data cache cleared");
  }

  // Method to get cache info for debugging
  getCacheInfo() {
    const cachedJson = localStorage.getItem("musicData-json");
    const cachedTimestamp = localStorage.getItem("musicData-timestamp");

    if (!cachedJson || !cachedTimestamp) {
      return { cached: false, age: 0, size: 0 };
    }

    const age = Date.now() - parseInt(cachedTimestamp);
    const size = new Blob([cachedJson]).size;

    return {
      cached: true,
      age: Math.round(age / 1000), // age in seconds
      size: Math.round(size / 1024), // size in KB
      timestamp: new Date(parseInt(cachedTimestamp)).toLocaleString(),
    };
  }

  async loadMusicData(): Promise<MusicNode> {
    if (this.musicData) {
      return this.musicData;
    }

    if (this.isLoading) {
      // Wait for existing load to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return this.musicData!;
    }

    this.isLoading = true;

    try {
      // First, try to load from localStorage cache
      const cachedJson = localStorage.getItem("musicData-json");
      const cachedTimestamp = localStorage.getItem("musicData-timestamp");

      if (cachedJson && cachedTimestamp) {
        const cacheAge = Date.now() - parseInt(cachedTimestamp);
        // Use cache if it's less than 1 hour old
        if (cacheAge < 60 * 60 * 1000) {
          console.log("Loading music data from cache");
          this.musicData = JSON.parse(cachedJson);
          return this.musicData!;
        }
      }

      // Try to load the music.txt file - handle both dev and production paths
      const musicPath = import.meta.env.DEV
        ? "/music.txt"
        : "/GitGudMusic/music.txt";
      const response = await fetch(musicPath);
      if (!response.ok) {
        throw new Error(`Failed to load music.txt: ${response.status}`);
      }

      const treeString = await response.text();
      console.log("Parsing music.txt to JSON structure...");
      this.musicData = this.parseTreeToJson(treeString);

      // Cache the parsed JSON data
      this.cacheJsonData(this.musicData!);
    } catch (error) {
      console.warn("Could not load music.txt file:", error);
      console.log("Using fallback sample data...");

      // Fallback to sample data if file can't be loaded
      this.musicData = this.createSampleData();
    } finally {
      this.isLoading = false;
    }

    return this.musicData!;
  }

  private cacheJsonData(data: MusicNode) {
    try {
      const jsonString = JSON.stringify(data);
      localStorage.setItem("musicData-json", jsonString);
      localStorage.setItem("musicData-timestamp", Date.now().toString());
      console.log("Music data cached to localStorage");
    } catch (error) {
      console.warn("Failed to cache music data:", error);
    }
  }

  private parseTreeToJson(treeString: string): MusicNode {
    const startTime = performance.now();
    const lines = treeString.split(/\r?\n/).filter((l) => l.trim().length > 0);
    console.log(`Parsing ${lines.length} lines from music.txt...`);

    // Parse each line to extract depth and name
    const parseLine = (line: string) => {
      // Find the last occurrence of a branch symbol to determine depth
      const idx = Math.max(line.lastIndexOf("├"), line.lastIndexOf("└"));
      let depth = 0;
      let name = line.trim();

      if (idx !== -1) {
        const prefix = line.slice(0, idx);
        const pseudo = prefix.replace(/│/g, " ");
        depth = Math.floor(pseudo.length / 4);
        name = line
          .slice(idx)
          .replace(/^[├└]──\s*/, "")
          .trim();
      } else {
        if (name === "." || name === "./") {
          depth = 0;
          name = ".";
        } else {
          depth = 0;
        }
      }
      return { depth, name };
    };

    // Parse all lines and determine if each is a directory
    const items = lines.map(parseLine);
    const nodes = items.map((item, i) => {
      const next = items[i + 1];
      const isDir = !!next && next.depth > item.depth;
      return { ...item, isDir };
    });

    // Audio file extensions to recognize
    const audioExts = new Set([
      ".mp3",
      ".m4a",
      ".flac",
      ".wav",
      ".aac",
      ".ogg",
      ".wma",
    ]);

    // Build the tree structure
    const root: MusicNode = {
      name: "Music Collection",
      type: "folder",
      children: [],
      path: "",
    };

    const stack: Array<{ node: MusicNode; depth: number }> = [
      { node: root, depth: -1 },
    ];

    nodes.forEach((item) => {
      const { depth, name, isDir } = item;

      // Skip root entry
      if (name === "." && depth === 0) return;

      // Adjust stack to current depth
      while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
        stack.pop();
      }

      // Determine if this is a file or folder
      let isFile = false;
      let extension: string | undefined;

      if (!isDir) {
        // Check if it has an audio file extension
        const dot = name.lastIndexOf(".");
        const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
        if (audioExts.has(ext)) {
          isFile = true;
          extension = ext.substring(1); // Remove the dot
        } else {
          // Check for other known file extensions
          const knownFileExtensions = [
            ".txt",
            ".pdf",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".zip",
            ".rar",
            ".7z",
            ".tar",
            ".gz",
            ".exe",
            ".msi",
            ".dmg",
            ".iso",
            ".xspf",
            ".pls",
            ".m3u",
            ".m3u8",
            ".cue",
            ".log",
            ".nfo",
            ".sfv",
            ".md5",
            ".sha1",
          ];
          if (knownFileExtensions.includes(ext)) {
            isFile = true;
            extension = ext.substring(1);
            // Debug XSPF files specifically
            if (ext === ".xspf") {
              console.log("Parsing XSPF file:", name, "extension:", extension);
            }
          }
        }
      }

      // Create the node
      const node: MusicNode = {
        name: name,
        type: isFile ? "file" : "folder",
        extension: extension,
        children: isFile ? undefined : [],
        path: "",
      };

      // Add to parent
      if (stack.length > 0) {
        const parent = stack[stack.length - 1].node;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
        node.path = parent.path ? `${parent.path}/${name}` : name;
      }

      // Add directories to stack for potential children
      if (!isFile) {
        stack.push({ node: node, depth: depth });
      }
    });

    // Debug: count total items parsed
    const countItems = (
      node: MusicNode
    ): { files: number; folders: number } => {
      let files = 0;
      let folders = 0;

      if (node.type === "file") files++;
      if (node.type === "folder") folders++;

      if (node.children) {
        for (const child of node.children) {
          const childCount = countItems(child);
          files += childCount.files;
          folders += childCount.folders;
        }
      }

      return { files, folders };
    };

    const stats = countItems(root);
    const parseTime = performance.now() - startTime;
    console.log(
      `Parsed music data: ${stats.files} files, ${
        stats.folders
      } folders in ${parseTime.toFixed(2)}ms`
    );

    return root;
  }

  private createSampleData(): MusicNode {
    // Fallback sample data in case music.txt can't be loaded
    return {
      name: "Music Collection",
      type: "folder",
      children: [
        {
          name: "0MIXES",
          type: "folder",
          path: "0MIXES",
          children: [
            {
              name: "100 Minutes Of Heavenly Synthwave.mp3",
              type: "file",
              extension: "mp3",
              path: "0MIXES/100 Minutes Of Heavenly Synthwave.mp3",
            },
            {
              name: "Cybercity - A Synthwave Mix.mp3",
              type: "file",
              extension: "mp3",
              path: "0MIXES/Cybercity - A Synthwave Mix.mp3",
            },
            {
              name: "Lofi Hip Hop Mix - Beats To Relax Study To [2018].mp3",
              type: "file",
              extension: "mp3",
              path: "0MIXES/Lofi Hip Hop Mix - Beats To Relax Study To [2018].mp3",
            },
          ],
        },
        {
          name: "4K Downloads",
          type: "folder",
          path: "4K Downloads",
          children: [
            {
              name: "AC DC - T.N.T..mp3",
              type: "file",
              extension: "mp3",
              path: "4K Downloads/AC DC - T.N.T..mp3",
            },
            {
              name: "Beat It (Studio Version).mp3",
              type: "file",
              extension: "mp3",
              path: "4K Downloads/Beat It (Studio Version).mp3",
            },
            {
              name: "Sweet Home Alabama.mp3",
              type: "file",
              extension: "mp3",
              path: "4K Downloads/Sweet Home Alabama.mp3",
            },
          ],
        },
      ],
      path: "",
    };
  }
}

export const musicDataService = new MusicDataService();

// Expose service methods for debugging in development
if (import.meta.env.DEV) {
  (window as unknown as { musicDataService: unknown }).musicDataService = {
    clearCache: () => musicDataService.clearCache(),
    getCacheInfo: () => musicDataService.getCacheInfo(),
  };
}
