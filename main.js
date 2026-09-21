const express = require("express");
const fs = require("node:fs");
const app = express();
let port = 3005;
let users = JSON.parse(fs.readFileSync("./data.json", { encoding: "utf-8" }));
let writing = (data) => {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2), {
    encoding: "utf-8",
  });
};
app.use(express.json());
app.post("/user", (req, res, next) => {
  const { email } = req.body;
  const userFound = users.findIndex((u) => u.email === email);
  if (userFound !== -1) {
    return res.status(409).json({ message: "email is already existed" });
  }

  users.push(req.body);
  writing(users);

  res.json({
    message: "user is added",
    data: req.body,
  });
});
app.patch("/userr/:id", (req, res, next) => {
  let targetIndex = users.findIndex((e) => {
    return e.id == req.params.id;
  });
  if (targetIndex == -1) throw new Error("id not exit", { cause: 404 });
  users[targetIndex].age = req.body.age;
  writing(users);
  res.json({
    message: "user update",
    user: users[targetIndex],
  });
});
app.delete("/user{/:id}", (req, res, next) => {
  const id = req.params.id || req.body.id;
  const userExit = users.findIndex((ele) => {
    return ele.id == id;
  });
  if (userExit == -1) {
    return res.status(404).json({
      message: "user id not found",
    });
  }
  users.splice(userExit, 1);
  writing(users);
  res.json({
    message: "user deleted",
    user: users[userExit],
  });
});
app.get("/user/getByName", (req, res, next) => {
  const { name } = req.query;

  const userfound = users.findIndex((u) => {
    return u.name === name;
  });

  if (userfound == -1) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  return res.json({
    message: "user found",
    data: users[userfound],
  });
});

app.get("/user", (req, res, next) => {
  return res.status(200).json({
    data: users,
  });
});
app.get("/user/filter", (req, res, next) => {
  const { age } = req.query;

  const filteredUsers = users.filter((u) => {
    return u.age >= age;
  });

  if (filteredUsers.length === 0) {
    return res.status(404).json({
      message: "no user found",
    });
  }

  return res.json({
    message: "user found",
    data: filteredUsers,
  });
});
app.get("/user/:id", (req, res, next) => {
  const { id } = req.params;
  let targetIndexx = users.findIndex((e) => {
    return e.id == id;
  });
  if (targetIndexx == -1) throw new Error("id not exit", { cause: 404 });

  res.json({
    message: "user  found",
    data: users[targetIndexx],
  });
});
app.listen(port, () => {
  console.log("server is running");
});
