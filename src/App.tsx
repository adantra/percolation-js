import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';

interface Cell {
  occupied: boolean;
  cluster: number;
}

const App: React.FC = () => {
  const [size, setSize] = useState<number>(20);
  const [probability, setProbability] = useState<number>(0.5);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [clusters, setClusters] = useState<number>(0);

  useEffect(() => {
    generateGrid();
  }, [size, probability]);

  const generateGrid = () => {
    const newGrid: Cell[][] = [];
    for (let i = 0; i < size; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < size; j++) {
        row.push({ occupied: Math.random() < probability, cluster: 0 });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    labelClusters(newGrid);
  };

  const labelClusters = (grid: Cell[][]) => {
    let clusterCount = 0;
    const visited: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    const dfs = (i: number, j: number, cluster: number) => {
      if (i < 0 || i >= size || j < 0 || j >= size || visited[i][j] || !grid[i][j].occupied) return;
      visited[i][j] = true;
      grid[i][j].cluster = cluster;
      dfs(i - 1, j, cluster);
      dfs(i + 1, j, cluster);
      dfs(i, j - 1, cluster);
      dfs(i, j + 1, cluster);
    };

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!visited[i][j] && grid[i][j].occupied) {
          clusterCount++;
          dfs(i, j, clusterCount);
        }
      }
    }

    setGrid([...grid]);
    setClusters(clusterCount);
  };

  const getColor = (cluster: number) => {
    const hue = (cluster * 137.5) % 360;
    return `hsl(${hue}, 50%, 50%)`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Percolation Theory Visualization</h1>
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">Grid Size:</label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(Math.max(5, Math.min(50, parseInt(e.target.value))))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="probability" className="block text-sm font-medium text-gray-700">Occupation Probability:</label>
          <input
            type="number"
            id="probability"
            value={probability}
            onChange={(e) => setProbability(Math.max(0, Math.min(1, parseFloat(e.target.value))))}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <button
        onClick={generateGrid}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <RefreshCw className="mr-2" size={18} />
        Regenerate Grid
      </button>
      <div className="mb-4">Number of Clusters: {clusters}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: '1px',
          background: '#000',
          padding: '1px',
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: cell.occupied ? getColor(cell.cluster) : '#fff',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;