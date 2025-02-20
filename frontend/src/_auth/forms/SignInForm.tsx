import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/AuthHooks";
import { useState } from "react";

const SignInForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSignin = async (user: { email: string; password: string }) => {
    fetch("http://localhost:8080/login", {
      method: "POST",
      body: JSON.stringify({ user }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Handle specific error messages from the server
        if (
          data.message === "Incorrect password." ||
          data.message === "User not found."
        ) {
          //   toast({ title: data.message });
          return;
        }
        // Save token to local storage and check authentication
        localStorage.setItem("token", data.token);

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
          navigate("/"); // Navigate to home page upon successful login
        } else {
          //   toast({ title: "Login failed. Please try again." });
        }
      })
      .catch((error) => {
        // Log and handle any errors
        console.error(error);
      });
  };

  return (
    <div className="h-[600px]">
      <div className="relative">
        <img
          src="../rum.jpg"
          alt="Rum"
          className="w-full  object-cover z-0 absolute -mt-4"
        />
        <div className="flex flex-col items-center min-h-screen mt-[96px] space-y-6 absolute inset-0 ">
          <div className="bg-blue-300/50 p-6 rounded shadow-md">
            <input
              className="p-2 border rounded mx-4"
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              className="p-2 border rounded mx-4"
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 mx-4 mt-3"
              onClick={() => handleSignin(user)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
