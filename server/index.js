const express = require("express");
const app = express();
var cors = require("cors");
const data = require("./sample.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const port = 5000;
app.use(express.json());
app.use(
  cors({
    orgin: "http://localhost:5173/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
//DISPLAY ALL USERS
app.get("/users", (req, res) => {
  return res.json(data);
});
//DELETE THE USER
app.delete("/users/:id", (req, res) => {
  let id = req.params.id;
  let filteredUsers = data.filter((user) => user.id != id);
  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err, data) => {
    return res.json(filteredUsers);
  });
});
//ADD NEW USER
app.post("/users", (req, res) => {
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "all Fields Required" });
  }
  let id = uuidv4().substring(0,4);
  data.push({ id, name, age, city });
  fs.writeFile("./sample.json", JSON.stringify(data), (err, data) => {
    return res.json({ message: "added succesfully" });
  });
 
});
app.patch("/users/:id", (req, res) => {
  let id=req.params.id
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "all Fields Required" });
  }
let index =data.findIndex((user)=>user.id ==id)
data.splice(index,1,{...req.body})
  fs.writeFile("./sample.json", JSON.stringify(data), (err, data) => {
    return res.json({ message: "added succesfully" });
  });
 
});
app.listen(port, (err) => {
  console.log(` your server is running on ${port}`);
});
