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

const Results = () => {
  const { state } = useLocation();
  const { departure, arrival, dep_date } = state;
  interface Route {
    RouteID: string;
    Day: string;
    Departure: string;
    Arrival: string;
    DepartTime: string;
    ArrivalTime: string;
    StopAt?: string;
    DepartureTime2?: string;
    ArrivalTime2?: string;
    TimeAshore?: string;
  }

  const [routes, setRoutes] = useState<Route[]>([]);
  interface Price {
    PriceID: string;
    AgeCategory: string;
    PriceAmount: number;
  }
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [price, setPrice] = useState<Price[]>([]);
  const [total, setTotal] = useState<number>(0);

  console.log(selectedRoute);
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
        setRoutes(data);
      })
      .catch((error) => console.error("Error fetching routes:", error));
  };

  const handleSelectRoute = (routeID: string) => {
    setSelectedRoute(routeID);
    fetch("http://localhost:8080/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ RouteID: routeID }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPrice(data); // Ensure data is set as an array if possible
        console.log(data);
      })
      .catch((error) => console.error("Error fetching prices:", error));

    setTotal(total);
  };

  return (
    <div>
      {routes.map((route) => (
        <>
          <Card className="w-[350px]" key={route.RouteID} id={route.RouteID}>
            <CardHeader>
              <CardTitle>{route.Day}</CardTitle>
              <CardDescription>
                {" "}
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
              <Button onClick={() => handleSelectRoute(route.RouteID)}>
                Select Route
              </Button>
            </CardContent>
          </Card>
          {/* <div key={route.RouteID} id={route.RouteID}> */}
          {/* <h1>{route.Day}</h1>
            <h2>
              Departing From {route.Departure} - Arriving At {route.Arrival}
            </h2>
            <p>
              Departing At {route.DepartureTime} - Arriving At{" "}
              {route.ArrivalTime}
            </p>
            {route.StopAt && (
              <div>
                <h3>Stop at: {route.StopAt}</h3>
                <p>
                  Departing At {route.DepartureTime2} - Arriving At{" "}
                  {route.ArrivalTime2}
                </p>
                <p>Time Ashore: {route.TimeAshore}</p>
              </div>
            )}
            <button onClick={() => handleFetchPrice(route)}>Price</button> */}
          {/* Check if prices are correctly filtered by routeID */}
          {/* {routeID === route.RouteID && price && (
              <div>
                {price.map((p) => (
                  <div key={p.PriceID}>
                    <h4>{p.AgeCategory}</h4>
                    <p>£{p.PriceAmount}</p>
                  </div>
                ))}
              </div>
            )} */}
          {/* </div> */}
        </>
      ))}
      Total Price: £{total}
    </div>
  );
};

export default Results;
