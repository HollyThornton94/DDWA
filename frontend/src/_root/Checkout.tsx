import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";

const Checkout = () => {
  const { cart, passengerDetails, setPassengerDetails } = useCart();
  const navigate = useNavigate();

  // Calculate total number of passengers from cart
  const passengerCount = cart.reduce(
    (total, item) =>
      total +
      (item.passengers.adult || 0) +
      (item.passengers.child || 0) +
      (item.passengers.infant || 0) +
      (item.passengers.teen || 0),
    0
  );

  console.log(cart);

  // Initialize passengers state dynamically
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      name: "",
      dob: "",
      passportNumber: "",
    }))
  );

  // Ensure state updates if cart changes
  useEffect(() => {
    setPassengers(
      Array.from({ length: passengerCount }, () => ({
        name: "",
        dob: "",
        passportNumber: "",
      }))
    );
  }, [passengerCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingDetails = {
      outboundID: cart[0].outbound[0].RouteID,
      returnID: cart[0].return[0].RouteID,
      outboundDate: cart[0].outbound[0].RouteID,
    };

    console.log("Submitted Passenger Details:", passengers);
    navigate("/booking");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-blue-200 rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Passenger Details</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add items before proceeding.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-md font-medium">Passenger {index + 1}</h4>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={passenger.name}
                onChange={(e) =>
                  setPassengers(
                    passengers.map((p, i) =>
                      i === index ? { ...p, name: e.target.value } : p
                    )
                  )
                }
                required
                className="mt-1 p-2 w-full border rounded"
              />
              <label className="block text-sm font-medium mt-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={passenger.dob}
                onChange={(e) =>
                  setPassengers(
                    passengers.map((p, i) =>
                      i === index ? { ...p, dob: e.target.value } : p
                    )
                  )
                }
                required
                className="mt-1 p-2 w-full border rounded"
              />
              <label className="block text-sm font-medium mt-2">
                Passport Number
              </label>
              <input
                type="text"
                value={passenger.passportNumber}
                onChange={(e) =>
                  setPassengers(
                    passengers.map((p, i) =>
                      i === index ? { ...p, passportNumber: e.target.value } : p
                    )
                  )
                }
                required
                className="mt-1 p-2 w-full border rounded"
              />
              <hr className="my-4 " />
            </div>
          ))}

          <div className="mt-6">
            <Button type="submit">Submit Details</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
