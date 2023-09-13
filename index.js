const express = require("express");
require("dotenv").config();
const fs = require("fs");
const app = express();
app.use(express.json());
const AdminData = {
  email: process.env.ADMIN_EMAIL,
  pswd: process.env.ADMIN_PSWD
};
const AddUser = (userData) => {
  // Specify the file path you want to modify
  const filePath = "example.txt";
  // Data you want to write to the file
  const newContent = userData;
  // Read the existing content of the file
  fs.readFile(filePath, "utf8", (err, existingContent) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Append the new content with a comma and the existing content
    const updatedContent = existingContent
      ? `${existingContent},${newContent}`
      : newContent;

    // Write the updated content back to the file
    fs.writeFile(filePath, updatedContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return;
      }

      console.log("Content added and file updated successfully.");
    });
  });
};

const showUser = (callback) => {
  fs.readFile("example.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      callback(err, null);
      return;
    }
    callback(null, data);
  });
};

app.post("/submit", (req, res) => {
  const { email, pswd } = req.body;
  console.log(email);
  if (email === AdminData.email && pswd === AdminData.pswd) {
    showUser((err, usersData) => {
      if (err) {
        // Handle the error, e.g., send an error response
        res.status(500).send("Error reading user data");
        return;
      }

      console.log(usersData);
      // You can send the data as a response to the client here if needed
      res.send(usersData);
    });
  } else {
    AddUser(`Email: ${email.toLowerCase()} Password: ${pswd}`);
    res.send("Added Sucessfully");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080, () => {
  console.log("server is running");
});
