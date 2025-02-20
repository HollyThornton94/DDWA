import { useEffect, useState } from "react";
import { useUserContext } from "../context/AuthHooks";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "../context/CartContext"; // Import useCart hook
import CartModal from "../components/ui/CartModal";
import { Button } from "./ui/button";

interface CartItem {
  outbound: any;
  return: any;
  priceDetails: any[];
  totalPrice: number;
}

const Navbar = () => {
  const { user, isAuthenticated, checkAuthUser, setIsAuthenticated } =
    useUserContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart(); // Access cart state from context
  const [isCartOpen, setIsCartOpen] = useState(false);
  // UseEffect to verify user on initial load
  useEffect(() => {
    checkAuthUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Set global authentication status to false
    navigate("/");
  };

  return (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-12" alt="Logo" />
        </a>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>{user?.name}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Bookings</DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                    {user?.isAdmin ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Admin</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Admin Panel</DropdownMenuItem>
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className={
                    pathname === "/login"
                      ? "block py-2 px-3 md:p-0 text-blue-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      : "block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }
                >
                  Login
                </a>

                <a
                  href="/register"
                  className={
                    pathname === "/register"
                      ? "block py-2 px-3 md:p-0 text-blue-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      : "block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }
                >
                  Register
                </a>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center">
                <ShoppingCartIcon className="size-4 mr-2" />
                Cart
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {cart.length === 0 ? (
                  <p>Cart is empty</p>
                ) : (
                  <div className="fixed top-12 flex justify-center items-center w-96 h-96 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-full">
                      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

                      {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                      ) : (
                        cart.map((item, index) => (
                          <div key={index} className="border-b pb-3 mb-3">
                            <h3 className="text-lg font-semibold">
                              Trip {index + 1}
                            </h3>

                            {/* Outbound Trip */}
                            {item.outbound && (
                              <div>
                                <h4 className="font-medium underline">
                                  Outbound Trip
                                </h4>
                                <p>Departure: {item.outbound.Departure}</p>
                                <p>Arrival: {item.outbound.Arrival}</p>
                                <p>Depart Time: {item.outbound.DepartTime}</p>
                                <p>Arrival Time: {item.outbound.ArrivalTime}</p>
                              </div>
                            )}

                            {/* Return Trip */}
                            {item.return && (
                              <div className="mt-2">
                                <h4 className="font-medium underline">
                                  Return Trip
                                </h4>
                                <p>Departure: {item.return.Departure}</p>
                                <p>Arrival: {item.return.Arrival}</p>
                                <p>Depart Time: {item.return.DepartTime}</p>
                                <p>Arrival Time: {item.return.ArrivalTime}</p>
                              </div>
                            )}

                            <h4 className="font-medium mt-2 underline">
                              Total Price
                            </h4>
                            <p className="text-lg font-bold">
                              £{item.totalPrice.toFixed(2)}
                            </p>

                            <Button onClick={() => navigate("/checkout")}>
                              Checkout
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
