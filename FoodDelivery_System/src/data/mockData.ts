import { Restaurant, RoutePoint } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    coordinates: [40.7589, -73.9851],
    menu: [
      {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, and basil',
        price: 14.99,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Pizza'
      },
      {
        id: '2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with cheese',
        price: 16.99,
        image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Pizza'
      }
    ]
  },
  {
    id: '2',
    name: 'Burger Junction',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'American',
    rating: 4.3,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    coordinates: [40.7614, -73.9776],
    menu: [
      {
        id: '3',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and cheese',
        price: 12.99,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Burgers'
      },
      {
        id: '4',
        name: 'Chicken Deluxe',
        description: 'Grilled chicken with special sauce',
        price: 13.99,
        image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Burgers'
      }
    ]
  },
  {
    id: '3',
    name: 'Sushi Express',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    coordinates: [40.7505, -73.9934],
    menu: [
      {
        id: '5',
        name: 'Salmon Roll',
        description: 'Fresh salmon with avocado and cucumber',
        price: 18.99,
        image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Sushi'
      },
      {
        id: '6',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber',
        price: 15.99,
        image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Sushi'
      }
    ]
  }
];

export const deliveryPoints: RoutePoint[] = [
  { id: 'restaurant-1', name: 'Pizza Palace', coordinates: [40.7589, -73.9851] },
  { id: 'restaurant-2', name: 'Burger Junction', coordinates: [40.7614, -73.9776] },
  { id: 'restaurant-3', name: 'Sushi Express', coordinates: [40.7505, -73.9934] },
  { id: 'intersection-1', name: 'Main St & 1st Ave', coordinates: [40.7580, -73.9800] },
  { id: 'intersection-2', name: 'Broadway & 42nd', coordinates: [40.7570, -73.9850] },
  { id: 'intersection-3', name: 'Park Ave & 59th', coordinates: [40.7550, -73.9750] },
  { id: 'delivery-1', name: 'Downtown Area', coordinates: [40.7530, -73.9900] },
  { id: 'delivery-2', name: 'Midtown West', coordinates: [40.7600, -73.9850] },
  { id: 'delivery-3', name: 'Upper East Side', coordinates: [40.7700, -73.9650] }
];

// Create adjacency graph for Dijkstra's algorithm
export const createDeliveryGraph = (): { [key: string]: { [key: string]: number } } => {
  const graph: { [key: string]: { [key: string]: number } } = {};
  
  // Initialize all nodes
  deliveryPoints.forEach(point => {
    graph[point.id] = {};
  });

  // Add connections with distances (simplified for demo)
  // Restaurant connections
  graph['restaurant-1']['intersection-1'] = 2.5;
  graph['restaurant-1']['intersection-2'] = 1.8;
  graph['restaurant-2']['intersection-1'] = 1.2;
  graph['restaurant-2']['intersection-3'] = 2.0;
  graph['restaurant-3']['intersection-2'] = 2.8;
  graph['restaurant-3']['delivery-1'] = 1.5;

  // Intersection connections
  graph['intersection-1']['intersection-2'] = 1.5;
  graph['intersection-1']['intersection-3'] = 2.2;
  graph['intersection-1']['delivery-2'] = 1.8;
  graph['intersection-2']['intersection-3'] = 2.0;
  graph['intersection-2']['delivery-1'] = 1.3;
  graph['intersection-2']['delivery-2'] = 1.0;
  graph['intersection-3']['delivery-2'] = 1.7;
  graph['intersection-3']['delivery-3'] = 1.9;

  // Make graph bidirectional
  Object.keys(graph).forEach(from => {
    Object.keys(graph[from]).forEach(to => {
      if (!graph[to]) graph[to] = {};
      graph[to][from] = graph[from][to];
    });
  });

  return graph;
};