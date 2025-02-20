import { Routes, Route } from "react-router-dom";
import Home from "./_root/home";
import Results from "./_root/results";
import Navbar from "./components/navbar";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignInForm from "./_auth/forms/SignInForm";
import RegisterForm from "./_auth/forms/RegisterForm";
import Checkout from "./_root/Checkout";
import { CartProvider } from "./context/CartContext";
import Booking from "./_root/booking";

function App() {
  return (
    <CartProvider>
      {" "}
      <Navbar />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<SignInForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking" element={<Booking />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
