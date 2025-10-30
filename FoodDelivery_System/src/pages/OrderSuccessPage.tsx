import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, MapPin, Clock, Truck, ChefHat as Chef, Home } from 'lucide-react';
import { Order } from '../types';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order as Order;
  const [currentStatus, setCurrentStatus] = useState<Order['status']>('confirmed');
  const [timeRemaining, setTimeRemaining] = useState(order?.estimatedDeliveryTime || 30);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    // Simulate order progress
    const statusProgression: Order['status'][] = ['confirmed', 'preparing', 'on-the-way', 'delivered'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
      }
    }, 10000); // Change status every 10 seconds for demo

    // Update timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircle, text: 'Order Confirmed', color: 'text-green-500', bgColor: 'bg-green-100' };
      case 'preparing':
        return { icon: Chef, text: 'Preparing Your Order', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
      case 'on-the-way':
        return { icon: Truck, text: 'On The Way', color: 'text-blue-500', bgColor: 'bg-blue-100' };
      case 'delivered':
        return { icon: CheckCircle, text: 'Delivered', color: 'text-green-500', bgColor: 'bg-green-100' };
      default:
        return { icon: Clock, text: 'Processing', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-xl opacity-90">
            Thank you for your order. We're preparing your delicious meal!
          </p>
          <p className="text-lg opacity-80 mt-2">
            Order #{order.id}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Tracking */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Tracking</h2>
            
            {/* Current Status */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusInfo.bgColor} mb-4`}>
                <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{statusInfo.text}</h3>
              <p className="text-gray-600">Your order is being processed</p>
            </div>

            {/* Estimated Time */}
            <div className="bg-orange-50 p-4 rounded-lg mb-6 text-center">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-orange-900 font-medium">
                {currentStatus === 'delivered' 
                  ? 'Order Delivered!' 
                  : `Estimated arrival: ${timeRemaining} minutes`
                }
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {['confirmed', 'preparing', 'on-the-way', 'delivered'].map((status, index) => {
                const isCompleted = ['confirmed', 'preparing', 'on-the-way', 'delivered'].indexOf(currentStatus) >= index;
                const isCurrent = currentStatus === status;
                const stepInfo = getStatusInfo(status as Order['status']);
                const StepIcon = stepInfo.icon;

                return (
                  <div key={status} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <StepIcon className={`w-5 h-5 ${
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
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="mb-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(order.total - 2.99 - (order.total - 2.99) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">$2.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${((order.total - 2.99) * 0.08).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Delivery Address</div>
                    <div className="text-gray-600">{order.deliveryAddress}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Estimated Delivery</div>
                    <div className="text-gray-600">{order.estimatedDeliveryTime} minutes</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-xs">💳</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Payment Method</div>
                    <div className="text-gray-600">
                      {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Continue Shopping</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;