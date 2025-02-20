import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import CartModal from "../components/ui/CartModal";
import { useCart } from "../context/CartContext"; // Import useCart hook
import { getEarliestDateForDay } from "../lib/utils";

const Results = () => {
  const { state } = useLocation();
  const {
    departure,
    dep_date,
    arrival,
    ret_date,
    passenger,
    accessibility,
    isReturn,
  } = state;
  interface Route {
    RouteID: string;
    Days: string;
    Departure: string;
    Arrival: string;
    DepartTime: string;
    ArrivalTime: string;
    StopAt?: string;
    DepartureTime2?: string;
    ArrivalTime2?: string;
    TimeAshore?: string;
    AvailableFrom: string;
    AvailableTo: string;
    earliestDate: string | null;
  }

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedReturnRoute, setSelectedReturnRoute] = useState<string>("");
  const [total, setTotal] = useState<number>(0); // Stores total cost

  // Cart state
  const { cart, setCart } = useCart(); // Access cart state from context
  const [isCartOpen, setIsCartOpen] = useState(false); // Controls cart modal visibility

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    fetch("http://localhost:8080/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ departure, arrival, dep_date }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Map routes to include their earliest available date
        const mappedRoutes = data
          .map((route) => {
            const earliestDate = getEarliestDateForDay(
              dep_date,
              route.Days,
              route.AvailableFrom,
              route.AvailableTo
            );

            console.log(
              `Route ${route.RouteID} - Earliest Date:`,
              earliestDate
            ); // DEBUG LOG

            return {
              ...route,
              earliestDate,
              earliestDateObj: earliestDate
                ? new Date(earliestDate.split(" (")[1].slice(0, -1))
                : null,
            };
          })
          .filter((route) => route.earliestDateObj !== null); // Remove routes with no available date

        console.log(
          "Before Sorting:",
          mappedRoutes.map((r) => ({ id: r.RouteID, date: r.earliestDateObj }))
        ); // DEBUG LOG

        // Sort routes by the actual earliest date
        const sortedRoutes = mappedRoutes.sort(
          (a, b) => a.earliestDateObj.getTime() - b.earliestDateObj.getTime()
        );

        console.log(
          "After Sorting:",
          sortedRoutes.map((r) => ({ id: r.RouteID, date: r.earliestDateObj }))
        ); // DEBUG LOG

        setRoutes(sortedRoutes);
      })
      .catch((error) => console.error("Error fetching routes:", error));
  };

  const handleSelectRoute = (routeID: string, isOutbound: boolean) => {
    if (isOutbound) {
      setSelectedRoute(routeID);
    } else {
      setSelectedReturnRoute(routeID);
    }

    fetch("http://localhost:8080/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RouteID: routeID,
        adults: passenger.adult,
        teens: passenger.teen,
        children: passenger.child,
        infants: passenger.infant,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isReturn) {
          setTotal(data.total);
        } else {
          setTotal(data.total * 0.7);
        }
      })
      .catch((error) => console.error("Error fetching prices:", error));
  };

  const handleAddToCart = () => {
    if (!selectedRoute) {
      alert("Please select a route before adding to cart.");
      return;
    }

    // Find selected outbound & return journey
    const selectedOutbound = routes.find(
      (route) => route.RouteID === selectedRoute
    );
    const selectedReturn = selectedReturnRoute
      ? routes.find((route) => route.RouteID === selectedReturnRoute)
      : null;

    // Check if the trip is already in the cart to prevent duplicates
    const isDuplicate = cart.some(
      (item) =>
        item.outbound?.RouteID === selectedRoute &&
        item.return?.RouteID === selectedReturnRoute
    );

    if (isDuplicate) {
      alert("This trip is already in your cart.");
      return;
    }

    // Create a new cart item
    const newCartItem = {
      outbound: selectedOutbound,
      return: selectedReturn,
      passengers: passenger,
      accessibility,
      totalPrice: total,
    };

    // Add the new trip to the existing cart array
    setCart((prevCart) => [...prevCart, newCartItem]);
  };

  console.log(routes);

  return (
    <>
      <div className="flex flex-col mt-4">
        <div className="flex flex-row gap-4">
          <h2 className=" text-lg font-semibold ">Select Outbound Journey</h2>
          {routes.map((route) => (
            <Card className="w-[350px]" key={route.RouteID} id={route.RouteID}>
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-col gap-2">
                    <span>{route.earliestDate}</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Departing From {route.Departure} at {route.DepartTime} -
                  Arriving At {route.Arrival} at {route.ArrivalTime}
                  {route.StopAt && (
                    <div>
                      <Separator />
                      <h3>Stop at: {route.StopAt}</h3>
                      <p>
                        Departing At {route.DepartureTime2} - Arriving At{" "}
                        {route.ArrivalTime2}
                      </p>
                      <p>Time Ashore: {route.TimeAshore}</p>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleSelectRoute(route.RouteID, true)}
                  disabled={selectedRoute === route.RouteID}
                >
                  {selectedRoute === route.RouteID ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {isReturn && (
        <div className="flex flex-col mt-4">
          <div className="flex flex-row gap-4">
            <h2 className=" text-lg font-semibold ">Select Return Journey</h2>
            {routes.map((route) => (
              <Card className="w-[350px]" key={`return-${route.RouteID}`}>
                <CardHeader>
                  <CardTitle>{route.Days}</CardTitle>
                  <CardDescription>
                    Departing From {route.Arrival} at {route.DepartTime} -
                    Arriving At {route.Departure} at {route.ArrivalTime}
                    {route.StopAt && (
                      <div>
                        <Separator />
                        <h3>Stop at: {route.StopAt}</h3>
                        <p>
                          Departing At {route.DepartureTime2} - Arriving At{" "}
                          {route.ArrivalTime2}
                        </p>
                        <p>Time Ashore: {route.TimeAshore}</p>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleSelectRoute(route.RouteID, false)}
                    disabled={selectedReturnRoute === route.RouteID}
                  >
                    {selectedReturnRoute === route.RouteID
                      ? "Selected"
                      : "Select"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Summary Section */}

      <div className="mt-6 p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Passengers</h2>
        <p>Adults: {passenger.adult}</p>
        <p>Teens: {passenger.teen}</p>
        <p>Children: {passenger.child}</p>
        <p>Infants: {passenger.infant}</p>

        <Separator className="my-4" />
        <h2 className="text-lg font-semibold">Accessibility Requirements</h2>
        <p>Wheelchair: {accessibility.wheelchair ? "Yes" : "No"}</p>
        <p>Pram: {accessibility.pram ? "Yes" : "No"}</p>
        <Separator className="my-4" />
        <div>
          <h3 className="text-md font-semibold">Price Details</h3>
          <div>
            <p>Adults: £18</p>
            <p>Teens: £10</p>
            <p>Children: £7</p>
            <p>Infants: £0</p>
          </div>
          <Separator className="my-4" />
          <h4 className="text-lg font-bold mt-2">Total Price: £{total}</h4>
        </div>
        {/* Add to Cart Button */}
        <div className="mt-4">
          {/* Add to Cart Button (Does NOT open modal) */}
          <Button onClick={handleAddToCart}>Add to Cart</Button>

          {/* View Cart Button (Opens modal) */}
          <Button className="ml-2" onClick={() => setIsCartOpen(true)}>
            View Cart
          </Button>

          {/* Cart Modal */}
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
          />

          {/* <Button onClick={() => "/checkout"}>Proceed to Checkout</Button> */}
        </div>
      </div>
    </>
  );
};

export default Results;
