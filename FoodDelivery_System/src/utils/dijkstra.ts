import { RoutePoint } from '../types';

export class DijkstraAlgorithm {
  private graph: { [key: string]: { [key: string]: number } };
  private points: RoutePoint[];

  constructor(graph: { [key: string]: { [key: string]: number } }, points: RoutePoint[]) {
    this.graph = graph;
    this.points = points;
  }

  findShortestPath(startId: string, endId: string): {
    distance: number;
    path: string[];
    route: RoutePoint[];
  } {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const visited = new Set<string>();
    const unvisited = new Set<string>();

    // Initialize distances
    Object.keys(this.graph).forEach(node => {
      distances[node] = node === startId ? 0 : Infinity;
      previous[node] = null;
      unvisited.add(node);
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = Array.from(unvisited).reduce((min, node) =>
        distances[node] < distances[min] ? node : min
      );

      if (distances[current] === Infinity) break;

      unvisited.delete(current);
      visited.add(current);

      if (current === endId) break;

      // Update distances to neighbors
      Object.keys(this.graph[current] || {}).forEach(neighbor => {
        if (!visited.has(neighbor)) {
          const newDistance = distances[current] + this.graph[current][neighbor];
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = current;
          }
        }
      });
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = endId;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    // Convert to RoutePoints
    const route = path.map(nodeId => 
      this.points.find(point => point.id === nodeId)!
    ).filter(Boolean);

    return {
      distance: distances[endId],
      path,
      route
    };
  }

  calculateDeliveryTime(distance: number, averageSpeed: number = 25): number {
    // Calculate time in minutes (distance in km, speed in km/h)
    return Math.ceil((distance / averageSpeed) * 60);
  }
}