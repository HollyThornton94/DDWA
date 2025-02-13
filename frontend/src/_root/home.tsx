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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { cn } from "../lib/utils";
import { Input } from "../components/ui/input";

const Home = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [dep_date, setDep_Date] = useState<Date>();
  const [ret_date, setRet_Date] = useState<Date>();
  const [isReturn, setIsReturn] = useState(false);
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState({
    adult: 0,
    teen: 0,
    child: 0,
    infant: 0,
  });
  const [accessibility, setAccessibility] = useState({
    wheelchair: false,
    pram: false,
  });

  return (
    <>
      <div className="h-[600px]">
        <div className="relative">
          <img
            src="../rum.jpg"
            alt="Rum"
            className="w-full h-[600px] object-cover z-0 absolute -mt-4"
          />
          <Card className="w-10/12 lg:w-6/12 mx-auto relative mt-4 z-10 bg-white/75">
            <CardContent className="grid grid-cols-2 grid-rows-5 grid-flow-row gap-4">
              <div className="flex flex-row col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="return"
                    onClick={() => setIsReturn(!isReturn)}
                  />
                  <label
                    htmlFor="return"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {isReturn ? "Return" : "One Way"}
                  </label>
                </div>
              </div>
              <div className="flex flex-col">
                <Label>Departure</Label>
                <Select onValueChange={(value) => setDeparture(value)}>
                  <SelectTrigger className="bg-gray-100">
                    <Label>{departure ? departure : "Departure"}</Label>
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
                  <SelectTrigger className="bg-gray-100">
                    <Label>{arrival ? arrival : "Arrival"}</Label>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mallaig">Mallaig</SelectItem>
                    <SelectItem value="Eigg">Eigg</SelectItem>
                    <SelectItem value="Muck">Muck</SelectItem>
                    <SelectItem value="Rum">Rum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className={cn(`${isReturn ? "flex flex-col" : "invisible"}`)}
              >
                <Label>Return Date</Label>
                <DatePicker date={ret_date} setDate={setRet_Date} />
              </div>
              <div className="flex flex-col">
                <Label>Passenger</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="border p-2  text-left h-9 rounded-md mt-0.5 bg-gray-100">
                    <div className="flex flex-row justify-between items-center">
                      <Label className="truncate">{`Adults: ${passenger.adult}, Teens: ${passenger.teen}, Children: ${passenger.child}, Infants: ${passenger.infant}`}</Label>
                      <ChevronDownIcon className="size-4 mr-1 text-neutral-400" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="grid grid-cols-2 grid-rows-4 grid-flow-row gap-4 items-center">
                      <Label>Adult</Label>
                      <Input
                        type="number"
                        value={passenger.adult}
                        onChange={(e) =>
                          setPassenger({
                            ...passenger,
                            adult: Number(e.target.value),
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <Label>Teens</Label>
                      <Input
                        type="number"
                        value={passenger.teen}
                        onChange={(e) =>
                          setPassenger({
                            ...passenger,
                            teen: Number(e.target.value),
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <Label>Kids</Label>
                      <Input
                        type="number"
                        value={passenger.child}
                        onChange={(e) =>
                          setPassenger({
                            ...passenger,
                            child: Number(e.target.value),
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <Label>Babies</Label>
                      <Input
                        type="number"
                        value={passenger.infant}
                        onChange={(e) =>
                          setPassenger({
                            ...passenger,
                            infant: Number(e.target.value),
                          })
                        }
                        className="border p-2 rounded"
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Accessibility</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wheelchair"
                    onClick={() =>
                      setAccessibility({
                        ...accessibility,
                        wheelchair: !accessibility.wheelchair,
                      })
                    }
                  />
                  <label
                    htmlFor="wheelchair"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Wheelchair
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pram"
                    onClick={() =>
                      setAccessibility({
                        ...accessibility,
                        pram: !accessibility.pram,
                      })
                    }
                  />
                  <label
                    htmlFor="pram"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Pram
                  </label>
                </div>
              </div>
              <div className="flex flex-col col-span-2">
                <Button
                  onClick={() =>
                    navigate("/results", {
                      state: {
                        departure,
                        dep_date,
                        arrival,
                        ret_date,
                        passenger,
                        accessibility,
                      },
                    })
                  }
                  className="bg-blue-500 text-white p-2 mt-4"
                >
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="relative">Hello</p>
    </>
  );
};

export default Home;
