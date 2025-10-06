import type { MusicNode } from "../types/music";

class MusicDataService {
  private musicData: MusicNode | null = null;
  private isLoading = false;

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
      // Try to load the music.txt file - handle both dev and production paths
      const musicPath = import.meta.env.DEV
        ? "/music.txt"
        : "/GitGudMusic/music.txt";
      const response = await fetch(musicPath);
      if (!response.ok) {
        throw new Error(`Failed to load music.txt: ${response.status}`);
      }

      const treeString = await response.text();
      this.musicData = this.parseTreeData(treeString);
    } catch (error) {
      console.warn("Could not load music.txt file:", error);
      console.log("Using fallback sample data...");

      // Fallback to sample data if file can't be loaded
      this.musicData = this.createSampleData();
    } finally {
      this.isLoading = false;
    }

    return this.musicData;
  }

  private parseTreeData(treeString: string): MusicNode {
    const lines = treeString.trim().split("\n");
    const root: MusicNode = {
      name: "Music Collection",
      type: "folder",
      children: [],
      path: "",
    };
    const stack: Array<{ node: MusicNode; level: number }> = [
      { node: root, level: -1 },
    ];

    for (let i = 1; i < lines.length; i++) {
      // Skip the first line (root ".")
      const line = lines[i];
      if (!line.trim()) continue;

      // Calculate indentation level
      const match = line.match(/^(│\s*)*([├└]──\s*)?(.+)$/);
      if (!match) continue;

      const prefix = match[1] || "";
      const connector = match[2] || "";
      const name = match[3];

      // Calculate level based on tree structure
      const level = prefix.length / 4 + (connector ? 1 : 0);

      // Determine if it's a file or folder
      const isFile = name.includes(".") && !name.endsWith("/");
      const fileExtension = isFile
        ? name.split(".").pop()?.toLowerCase()
        : undefined;

      const node: MusicNode = {
        name: name,
        type: isFile ? "file" : "folder",
        extension: fileExtension,
        children: isFile ? undefined : [],
        path: "",
      };

      // Find the correct parent
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length > 0) {
        const parent = stack[stack.length - 1].node;
        parent.children!.push(node);
        node.path = parent.path ? `${parent.path}/${name}` : name;
      }

      if (!isFile) {
        stack.push({ node: node, level: level });
      }
    }

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
