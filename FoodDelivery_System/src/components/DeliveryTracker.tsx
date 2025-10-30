import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, CheckCircle, Truck, ChefHat as Chef } from 'lucide-react';
import { Order } from '../types';

interface DeliveryTrackerProps {
  order: Order;
  onClose: () => void;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ order, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState<Order['status']>('confirmed');
  const [timeRemaining, setTimeRemaining] = useState(order.estimatedDeliveryTime);

  useEffect(() => {
    // Simulate order progress
    const statusProgression: Order['status'][] = ['confirmed', 'preparing', 'on-the-way', 'delivered'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
      }
    }, 8000); // Change status every 8 seconds for demo

    // Update timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircle, text: 'Order Confirmed', color: 'text-green-500' };
      case 'preparing':
        return { icon: Chef, text: 'Preparing Your Order', color: 'text-yellow-500' };
      case 'on-the-way':
        return { icon: Truck, text: 'On The Way', color: 'text-blue-500' };
      case 'delivered':
        return { icon: CheckCircle, text: 'Delivered', color: 'text-green-500' };
      default:
        return { icon: Clock, text: 'Processing', color: 'text-gray-500' };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Status */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
              <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{statusInfo.text}</h3>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>

          {/* Estimated Time */}
          <div className="bg-orange-50 p-4 rounded-lg mb-6 text-center">
            <Clock className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <p className="text-orange-900 font-medium">
              {currentStatus === 'delivered' 
                ? 'Order Delivered!' 
                : `Estimated arrival: ${timeRemaining} minutes`
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 mb-6">
            {['confirmed', 'preparing', 'on-the-way', 'delivered'].map((status, index) => {
              const isCompleted = ['confirmed', 'preparing', 'on-the-way', 'delivered'].indexOf(currentStatus) >= index;
              const isCurrent = currentStatus === status;
              const stepInfo = getStatusInfo(status as Order['status']);
              const StepIcon = stepInfo.icon;

              return (
                <div key={status} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <StepIcon className={`w-4 h-4 ${
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isCurrent ? 'text-orange-500' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {stepInfo.text}
                    </div>
                    <div className="text-sm text-gray-600">
                      {status === 'confirmed' && 'We received your order'}
                      {status === 'preparing' && 'The restaurant is preparing your food'}
                      {status === 'on-the-way' && 'Your order is on the way'}
                      {status === 'delivered' && 'Your order has been delivered'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Route Map Placeholder */}
          <div className="bg-gray-100 p-6 rounded-lg mb-6 text-center">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Delivery Route Map</p>
            <p className="text-sm text-gray-500 mt-1">
              Distance: {order.route.length > 0 ? '2.5 km' : 'Calculating...'}
            </p>
            {/* This would integrate with a real map service */}
            <div className="mt-4 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map visualization would appear here</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Order Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Payment: {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</div>
              <div>Total: ${order.total.toFixed(2)}</div>
              <div>Delivery to: {order.deliveryAddress}</div>
            </div>
          </div>
        </div>

        {currentStatus === 'delivered' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <button
              onClick={onClose}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Order Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTracker;