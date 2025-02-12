import { Routes, Route } from "react-router-dom";
import Home from "./_root/home";
import Results from "./_root/results";
import Navbar from "./components/navbar";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignInForm from "./_auth/forms/SignInForm";
import RegisterForm from "./_auth/forms/RegisterForm";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<SignInForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="results" element={<Results />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
