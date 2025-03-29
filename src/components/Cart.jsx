// import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { cartState } from '../store/atoms/cartAtom';
import { cartTotalSelector } from '../store/selectors/cartSelectors';
import Navbar from './Navbar';

const Cart = () => {
  const cart = useRecoilValue(cartState);
  const setCart = useSetRecoilState(cartState);
  const total = useRecoilValue(cartTotalSelector);

  const removeFromCart = (id) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-gray-500 hover:text-indigo-600 transition duration-300"
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2 font-semibold">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-gray-500 hover:text-indigo-600 transition duration-300"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <p className="font-bold mr-4">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 transition duration-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-xl">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

