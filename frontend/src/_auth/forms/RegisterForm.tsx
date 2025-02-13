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
    <div>
      <Label htmlFor="email">First Name</Label>
      <Input
        type="text"
        name="firstName"
        placeholder="John"
        required
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
      />
      <Label htmlFor="email">Last Name</Label>
      <Input
        type="text"
        name="lastName"
        placeholder="Smith"
        required
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
      />
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <Label htmlFor="email">Date of Birth</Label>
      <Input
        type="date"
        name="dob"
        required
        onChange={(e) => setUser({ ...user, dob: e.target.value })}
      />
      <Label htmlFor="email">Password</Label>
      <Input
        type="password"
        name="password"
        required
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Label htmlFor="email">Confirm Password</Label>
      <Input
        type="password"
        name="confirmpassword"
        required
        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
      />
      <Button variant="outline" onClick={() => handleRegister(user)}>
        Register
      </Button>
    </div>
  );
};

export default RegisterForm;
