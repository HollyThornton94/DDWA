import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  outbound: any;
  return: any;
  passengers: any;
  totalPrice: number;
}
interface Passenger {
  name: string;
  dob: string;
  passportNumber: string;
}

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  passengerDetails: Passenger[];
  setPassengerDetails: React.Dispatch<React.SetStateAction<Passenger[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, passengerDetails, setPassengerDetails }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
