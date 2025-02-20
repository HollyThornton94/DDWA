import React from "react";
import { Button } from "./button";

interface CartItem {
  outbound: any;
  return: any;
  totalPrice: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="border-b pb-3 mb-3">
              <h3 className="text-lg font-semibold">Trip {index + 1}</h3>

              {/* Outbound Trip */}
              {item.outbound && (
                <div>
                  <h4 className="font-medium">Outbound Trip</h4>
                  <p>Departure: {item.outbound.Departure}</p>
                  <p>Arrival: {item.outbound.Arrival}</p>
                  <p>Depart Time: {item.outbound.DepartTime}</p>
                  <p>Arrival Time: {item.outbound.ArrivalTime}</p>
                </div>
              )}

              {/* Return Trip */}
              {item.return && (
                <div className="mt-2">
                  <h4 className="font-medium">Return Trip</h4>
                  <p>Departure: {item.return.Departure}</p>
                  <p>Arrival: {item.return.Arrival}</p>
                  <p>Depart Time: {item.return.DepartTime}</p>
                  <p>Arrival Time: {item.return.ArrivalTime}</p>
                </div>
              )}

              {/* Price Breakdown */}
              <h4 className="font-medium mt-2">Price Breakdown</h4>

              <h4 className="font-medium mt-2">Total Price</h4>
              <p className="text-lg font-bold">£{item.totalPrice.toFixed(2)}</p>
            </div>
          ))
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
