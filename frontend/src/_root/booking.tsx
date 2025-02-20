import { useCart } from "../context/CartContext";

const Booking = () => {
  const { cart, passengerDetails } = useCart();

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-200 rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Booking Confirmation</h2>

      {cart.length === 0 ? (
        <p>No journey selected. Please book a journey first.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold">Journey {index + 1}</h3>
              <p>
                <strong>Outbound:</strong> {item.outbound}
              </p>
              <p>
                <strong>Return:</strong> {item.return}
              </p>
              <p>
                <strong>Total Price:</strong> ${item.totalPrice}
              </p>
            </div>
          ))}

          <h3 className="text-xl font-semibold mt-4">Passenger Details</h3>
          {passengerDetails.map((passenger, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded shadow">
              <h4 className="text-md font-medium">Passenger {index + 1}</h4>
              <p>
                <strong>Name:</strong> {passenger.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {passenger.dob}
              </p>
              <p>
                <strong>Passport Number:</strong> {passenger.passportNumber}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Booking;
