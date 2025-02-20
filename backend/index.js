const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
var cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

const secretKey = "ABCXYZ123098";

const db = mysql.createPool({
  host: "comp-server.uhi.ac.uk",
  user: "mo19002823",
  password: "mo19002823",
  database: "mo19002823",
});

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Routes
app.post("/routes", async (req, res) => {
  const { departure, arrival, dep_date } = req.body;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [rows] = await connection.query(
        "SELECT * FROM Routes WHERE Departure = ? AND Arrival = ?",
        [departure, arrival]
      );

      if (rows.length === 0) {
        res.status(404).json({ message: "No routes found." });
        return;
      }

      res.status(200).send(rows);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      res.status(500).json({ message: "Database query error." });
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/price", async (req, res) => {
  const { RouteID, adults, teens, children, infants } = req.body;

  try {
    const connection = await db.getConnection(); // Get the database connection
    await connection.beginTransaction(); // Begin a transaction
    try {
      let sql = "SELECT * FROM Pricing WHERE RouteID = ?"; // SQL query to get the pricing information
      const queryParams = [RouteID]; // Parameters for the query

      if (adults > 0 || teens > 0 || children > 0 || infants > 0) {
        let conditions = [];

        if (adults > 0) {
          conditions.push("AgeCategory = 'adult' ");
          queryParams.push(adults);
        }

        if (teens > 0) {
          conditions.push("AgeCategory = '11-16' ");
          queryParams.push(teens);
        }

        if (children > 0) {
          conditions.push("AgeCategory = '3-10' ");
          queryParams.push(children);
        }

        if (infants > 0) {
          conditions.push("AgeCategory = '0-2' ");
          queryParams.push(infants);
        }

        sql += " AND (" + conditions.join(" OR ") + ")";
      }

      console.log(sql);
      console.log(queryParams);

      const [result] = await connection.query(sql, queryParams); // Use async/await for the query

      console.log(result);

      if (result.length === 0) {
        return res.status(404).json({
          message: "No pricing information found for the given RouteID.",
        });
      }

      let total = 0;
      result.forEach((row) => {
        total += row.PriceAmount * queryParams[queryParams.length - 1];
      });

      res.json({ total }); // Send back the result
    } catch (err) {
      console.error(err); // Log the error
      res.status(500).json({ message: "Database query error." }); // Send error response
    } finally {
      connection.release(); // Ensure the connection is released
    } // Release the connection
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ message: "Internal server error." }); // Send error response
  }
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, dob, password, confirmPassword } =
    req.body.user;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [rows] = await connection.query(
        "SELECT * FROM Customers WHERE Email = ?",
        [email]
      );

      if (rows.length > 0) {
        res.status(401).json({ message: "User already exists." });
        return;
      }

      const verifyPassword = password === confirmPassword;
      if (!verifyPassword) {
        res.status(401).json({ message: "Passwords do not match." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.query(
        "INSERT INTO Customers (Forename, Surname, Email, pword, DOB) VALUES (?, ?, ?, ?, ?)",
        [firstName, lastName, email, hashedPassword, dob]
      );

      res.status(200).json({ message: "User registered successfully." });

      await connection.commit();
    } catch (error) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body.user;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [rows] = await connection.query(
        "SELECT * FROM Customers WHERE Email = ?",
        [email]
      );

      if (rows.length === 0) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.pword);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Incorrect password." });
        return;
      }

      const token = jwt.sign(
        {
          id: user.CustomerID,
          name: user.Forename + " " + user.Surname,
          email: user.Email,
          isAdmin: user.Admins === 1 ? true : false,
        },
        secretKey,
        {
          expiresIn: "24h",
        }
      );

      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({
        token: token,
        id: user.CustomerID,
        message: "Authentication successful",
      });

      await connection.commit();
    } catch (error) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/currentUser", authenticate, async (req, res) => {
  try {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(" ");
    const decoded = jwt.verify(token[1], secretKey);
    const { id, email, name, isAdmin } = decoded;
    res
      .status(200)
      .json({ id: id, email: email, name: name, isAdmin: isAdmin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/booking", authenticate, async (req, res) => {
  const { outboundID, returnID, outboundDate, returnDate, total, passengers } =
    req.body;

  if (!outboundID || !passengers) {
    res.status(400).json({ message: "Missing Required Fields." });
    return;
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();
  try {
    const query =
      "INSERT INTO Bookings (CustomerID, RouteId, TotalCost, BookingDate) VALUES (?, ?, ?, ?)";
    const queryParams = [req.user.id, outboundID, total, outboundDate];

    const oubountBookingResult = await connection.query(query, queryParams);

    await connection.commit();

    const oubountBookingId = oubountBookingResult[0].insertId;

    const bookingPassengerQuery =
      "INSERT INTO Passengers (BookingID, PassportNo, Forename, Surname, DOB, Assistance) VALUES (?, ?, ?, ?, ?, ?)";

    await Promise.all(
      passengers.map(async (passenger) => {
        const passengerParams = [
          oubountBookingId,
          passenger.passport,
          passenger.firstName,
          passenger.lastName,
          passenger.dob,
          passenger.assistance,
        ];

        await connection.query(bookingPassengerQuery, passengerParams);
      })
    );

    await connection.commit();

    if (returnID) {
      const returnBookingParams = [req.user.id, returnID, total, returnDate];

      const returnBookingResult = await connection.query(
        query,
        returnBookingParams
      );

      const returnBookingId = returnBookingResult[0].insertId;

      await Promise.all(
        passengers.map(async (passenger) => {
          const passengerParams = [
            returnBookingId,
            passenger.passport,
            passenger.firstName,
            passenger.lastName,
            passenger.dob,
            passenger.assistance,
          ];

          await connection.query(bookingPassengerQuery, passengerParams);
        })
      );

      await connection.commit();

      res.status(200).json({
        message: "Booking successful.",
        oubountBookingId,
        returnBookingId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    await connection.rollback();
  } finally {
    connection.release();
  }
});

app.listen(8080, () => {
  console.log(`Server is running`);
});
