import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { DatePicker } from "../components/ui/date-picker";
const Home = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [dep_date, setDep_Date] = useState<Date>();
  const [ret_date, setRet_Date] = useState<Date>();
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState("");

  return (
    <Card>
      <CardContent className="grid grid-cols-2 grid-rows-7 grid-flow-row gap-4">
        <div className="flex flex-col">
          <Label>Departure</Label>
          <Select onValueChange={(value) => setDeparture(value)}>
            <SelectTrigger>
              <Label>Departure</Label>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mallaig">Mallaig</SelectItem>
              <SelectItem value="Eigg">Eigg</SelectItem>
              <SelectItem value="Muck">Muck</SelectItem>
              <SelectItem value="Rum">Rum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label>Departure Date</Label>
          <DatePicker date={dep_date} setDate={setDep_Date} />
        </div>
        <div className="flex flex-col">
          <Label>Arrival</Label>
          <Select onValueChange={(value) => setArrival(value)}>
            <SelectTrigger>
              <Label>Arrival</Label>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mallaig">Mallaig</SelectItem>
              <SelectItem value="Eigg">Eigg</SelectItem>
              <SelectItem value="Muck">Muck</SelectItem>
              <SelectItem value="Rum">Rum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label>Return Date</Label>
          <DatePicker date={ret_date} setDate={setRet_Date} />
        </div>
        <div className="flex flex-col">
          <Select onValueChange={(value) => setPassenger(value)}>
            <SelectTrigger>
              <Label>Passenger</Label>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Adult">Adult</SelectItem>
              <SelectItem value="Teen">Teen (11-16)</SelectItem>
              <SelectItem value="Child">Child (2-10)</SelectItem>
              <SelectItem value="Infant">Infant (Under 2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label>Accessibility</Label>
        </div>
        <div className="flex flex-col col-span-2">
          <Button
            onClick={() =>
              navigate("/results", { state: { departure, arrival, dep_date } })
            }
            className="bg-blue-500 text-white p-2 mt-4"
          >
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;
