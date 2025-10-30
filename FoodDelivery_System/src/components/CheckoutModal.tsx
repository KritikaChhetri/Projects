import React, { useState } from 'react';
import { X, CreditCard, Banknote, MapPin, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { mockRestaurants, deliveryPoints, createDeliveryGraph } from '../data/mockData';
import { DijkstraAlgorithm } from '../utils/dijkstra';
import DeliveryTracker from './DeliveryTracker';

interface CheckoutModalProps {
  onClose: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onBack, onSuccess }) => {
  const { items, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const calculateDeliveryRoute = () => {
    // Get the restaurant from the first item (assuming single restaurant order)
    const restaurantId = items[0]?.restaurantId;
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    
    if (!restaurant || !user) return null;

    const graph = createDeliveryGraph();
    const dijkstra = new DijkstraAlgorithm(graph, deliveryPoints);
    
    // Find closest delivery point to user's address
    const deliveryPointId = 'delivery-1'; // Simplified for demo
    const restaurantPointId = `restaurant-${restaurant.id}`;
    
    const result = dijkstra.findShortestPath(restaurantPointId, deliveryPointId);
    const deliveryTime = dijkstra.calculateDeliveryTime(result.distance);
    
    return {
      route: result.route,
      distance: result.distance,
      estimatedTime: deliveryTime
    };
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const deliveryInfo = calculateDeliveryRoute();
    const order = {
      id: Date.now().toString(),
      userId: user.id,
      restaurantId: items[0]?.restaurantId,
      items,
      total: getTotalPrice(),
      status: 'confirmed' as const,
      paymentMethod,
      deliveryAddress: user.address,
      estimatedDeliveryTime: deliveryInfo?.estimatedTime || 30,
      route: deliveryInfo?.route || [],
      createdAt: new Date()
    };
    
    setOrderDetails(order);
    setOrderPlaced(true);
    setLoading(false);
  };

  if (orderPlaced && orderDetails) {
    return (
      <DeliveryTracker
        order={orderDetails}
        onClose={onClose}
      />
    );
  }

  const deliveryFee = 2.99;
  const total = getTotalPrice() + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <div className="flex space-x-2">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ←
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              Delivery Address
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-600">{user?.address}</p>
              <p className="text-gray-600">{user?.phone}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <CreditCard className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="font-medium">Online Payment</div>
                  <div className="text-sm text-gray-600">Pay with credit/debit card</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <Banknote className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when your order arrives</div>
                </div>
              </label>
            </div>
          </div>

          {/* Estimated Delivery Time */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-orange-900">
                Estimated Delivery: 25-35 minutes
              </span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;