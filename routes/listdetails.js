const mongoose = require("mongoose");
const express = require("express");
const List = require("../models/Listmodels");
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
// router.get("/getlist", function (req, res) {
//   const listId = req.query.listid;
//   const name = req.query.listname;

//   List.findOne({ listname: name, _id: listId }, (err, list) => {
//     if (err) {
//       res.status(400).send(err);
//     } else {
//       res.status(200).send(list);
//     }
//   });
// });

router.get("/getlist", function (req, res) {
  const listId = req.query.listid;
  const listType = req.query.listtype;

  List.aggregate(
    [
      { $match: { _id: ObjectId(listId) } },
      {
        $project: {
          items: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.listtype", listType] },
            },
          },
        },
      },
    ],
    (err, items) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(items);
      }
    }
  );
});

router.post("/additem", (req, res) => {
  const today = new Date();

  const listId = req.body.listid;
  const listtype = "To Order";
  const name = req.body.username.name;
  const item = req.body.itemname;

  /// List items
  const itemObj = {
    item: item,
    addedby: name,
    listtype: listtype,
    addedon: `${
      today.getMonth() + 1
    }-${today.getDate()}-${today.getFullYear()}`,
  };

  List.findOne({ _id: listId }, (err, list) => {
    if (err) {
      res.status(400).send(err);
    } else {
      list.items.push(itemObj);

      list.save();
      res.status(200).send("Item Added");
    }
  });
});

router.put("/deleteitem", (req, res) => {
  lid = req.body.listid;
  itemid = req.body.itemid;

  List.updateOne(
    { _id: lid },
    { $pull: { items: { _id: itemid } } },
    (err, response) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send("Deleted");
      }
    }
  );
});
router.patch("/checkeditem", (req, res) => {
  listId = req.body.listid;
  listItem = req.body.items;
  listType = req.body.listtype;

  

  List.findOne({ _id: listId }, (err, list) => {
    if (err) {
      res.status(400).send(err);
    } else {
      list.items.forEach((item) => {
        for (let i = 0; i < listItem.length; i++) {
          // console.log(listItem[i]._id === item._id.toString());
          if (listItem[i]._id === item._id.toString()) {
            console.log("reached")
            item.listtype = listType;
          }
        }
      });
      // console.log(list)
      list.save();
      if (listType === "To Order") {
        res.status(200).send("Item Unchecked Successfully");
      } else if (listType === "Added to Cart") {
        res.status(200).send("Item Checked Successfully");
      } else {
        res.status(200).send("Item Added to Ordered List Successfully");
      }
    }
  });
});

router.patch("/ordered", (req, res) => {
  const listid = req.body.listid;
  const user = req.body.user;
  const today = new Date();

  List.updateOne(
    { _id: listid },
    {
      $set: {
        "items.$[elem].listtype": "Ordered",
        "items.$[elem].addedon": `${
          today.getMonth() + 1
        }-${today.getDate()}-${today.getFullYear()}`,
      },
    },
    { arrayFilters: [{ "elem.listtype": "Added to Cart" }], multi: true },
    (err, response) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send("Updated");
      }
    }
  );
});

router.get("/orderedlist", (req, res) => {
  const listid = req.query.listid;
  List.findOne({ _id: listid }, { items: 1, _id: 0 }, (err, data) => {
    if (err) {
      res.status(400).send(err);
    } else {
      const newData = data.items.filter((item) => item.listtype == "Ordered");
      // console.log("Reached load Ordered");
      res.status(200).send(newData);
    }
  });
});
module.exports = router;
