const express = require("express");
const List = require("../models/Listmodels");

const router = express.Router();

router.get("/getlistnames", function (req, res) {
  const username = req.query.name;

  List.find(
    { "listUsers.name": username },
    { listname: 1, _id: 1 },
    (err, list) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(list);
      }
    }
  );
});
router.post("/createlist", async (req, res) => {
  const users = req.body.users;
  // const userid = req.body.userid;
  const listname = req.body.listname;

  // const users = [{ name: name }];

  const newList = new List({ listname: listname, listUsers: users });
  try {
    const addList = await newList.save();
    res.status(200).send("List Created");
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/getlistusers", async (req, res) => {
  const id = req.query.listid;
  List.findOne({ _id: id }, { _id: 1, listUsers: 1 }, (err, users) => {
    if (err) {
      res.send(400).send(err);
    } else {
      res.status(200).send(users);
    }
  });
});
router.patch("/updatelistusers", async (req, res) => {
  const listid = req.body.listid;
  const listusers = req.body.listusers;
  console.log(listid, listusers);
  try {
    const updateUsers = await List.updateOne(
      { _id: listid },
      { listUsers: listusers }
    );
    res.status(200).send("List Users Updated");
  } catch (err) {
    res.status(400).send(err);
  }
});
router.patch("/updatelistname", async (req, res) => {
  const listid = req.body.listid;
  const listname = req.body.listname;
  try {
    const updateUsers = await List.updateOne(
      { _id: listid },
      { listname: listname }
    );
    res.status(200).send("List Name Updated");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/deletelist", async (req, res) => {
  const listid = req.query.listid;
  try {
    const deleteList = await List.deleteOne({ _id: listid });
    res.status(200).send("List Deleted");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
