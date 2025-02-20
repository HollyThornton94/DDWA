import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/AuthHooks";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (user: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    password: string;
    confirmPassword: string;
  }) => {
    fetch("http://localhost:8080/register", {
      method: "POST",
      body: JSON.stringify({ user }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);

        if (
          data.message === "User already exists." ||
          data.message === "Passwords do not match."
        ) {
          console.log(data.message);
          return;
        }

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

        <div className="flex flex-col items-center min-h-screen mt-[96px] space-y-6 absolute inset-0">
          <div className="bg-blue-200/50 p-6 rounded shadow-md">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              className="p-2 border rounded border-black"
              type="text"
              name="firstName"
              placeholder="John"
              required
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              className="p-2 border rounded border-black"
              type="text"
              name="lastName"
              placeholder="Smith"
              required
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
            <Label htmlFor="email">Email</Label>
            <Input
              className="p-2 border rounded border-black"
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              className="p-2 border rounded border-black"
              type="date"
              name="dob"
              required
              onChange={(e) => setUser({ ...user, dob: e.target.value })}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              className="p-2 border rounded border-black"
              type="password"
              name="password"
              required
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              className="p-2 border rounded border-black"
              type="password"
              name="confirmPassword"
              required
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
            <Button
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-4 mt-3"
              onClick={() => handleRegister(user)}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
