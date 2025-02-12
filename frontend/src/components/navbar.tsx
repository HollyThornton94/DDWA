import { useEffect } from "react";
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

const Navbar = () => {
  const { user, isAuthenticated, checkAuthUser, setIsAuthenticated } =
    useUserContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
              <DropdownMenuContent>Cart is empty</DropdownMenuContent>
            </DropdownMenu>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
