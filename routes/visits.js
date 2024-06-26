require("dotenv").config();
const md5 = require("crypto-js/md5");
const express = require("express"),
  router = express.Router();
const fs = require("fs");
const path = require("path");

const data = path.join(__dirname.split("\\routes")[0], "/users.json");
const mongoose = require("mongoose");
const Visit = require("../models/visit");
const { error } = require("console");
mongoose.set("strictQuery", false);
const db = `mongodb+srv://admin:${process.env.DB_PASSWORD}@medicaldb.nlxa1z5.mongodb.net/MedicalDB`;
mongoose
  .connect(db)
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });
router
  .route("/")
  .get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.query.key === process.env.API_KEY) {
      Visit.find().then((visits) => {
        const arr = [];
        visits.forEach((visit) => {
          if (!req.query.notDone) {
            if (visit.pacient._id === req.query.pacientId) {
              arr.push(visit);
            }
          }

          if (req.query.doctorId && visit.doctor._id === req.query.doctorId) {
            arr.push(visit);
          }

          if (
            visit.pacient._id === req.query.pacientId &&
            req.query.notDone &&
            visit.status == "Не завершён"
          ) {
            arr.push(visit);
          } else if (
            visit.pacient.id === req.query.pacientId &&
            !req.query.notDone
          ) {
            arr.push(visit);
          } else if (!req.query.pacientId) {
            arr.push(visit);
          }
        });
        if (arr.length > 0) {
          res.json(arr).status(200);
        } else {
          res
            .json({
              message: "Ничего не найдено",
              status: 204,
            })
            .status(204);
        }
      });
    } else if (req.query.key && req.query.key !== process.env.API_KEY) {
      res.status(403).send("Invalid Api Key");
    } else if (!req.query.key) {
      res.status(403).send("Api Key is required");
    }
  })
  .post((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { doctor, pacient, date, time } = req.body;
    const diagnose = " ";
    const treatment = " ";
    const status = "Не завершён";
    const referral = [];
    if (
      req.query.key === process.env.API_KEY &&
      doctor &&
      pacient &&
      date &&
      time
    ) {
      Visit.find()
        .then((visits) => {
          const newVisit = new Visit({
            doctor,
            pacient,
            date,
            time,
            diagnose,
            treatment,
            status,
            referral,
          });

          newVisit.save().then((result) => res.send(result));
        })
        .catch((error) => {
          res
            .json({
              message: error.message,
              status: 500,
            })
            .status(500);
        });
    } else if (req.query.key !== process.env.API_KEY) {
      res.status(403).send("Invalid Api Key");
    } else {
      res.status(403).send("Api Key is required");
    }
  })
  .put(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { _id, diagnose, treatment, referral, status } = req.body;
    if (
      (req.query.key === process.env.API_KEY && password && _id,
      diagnose,
      treatment,
      referral,
      status)
    ) {
      try {
        const updated = await Visit.findByIdAndDelete(_id, {
          diagnose: diagnose,
          treatment: treatment,
          referral: referral,
          status: status,
        });
        res
          .json({
            status: 200,
            response: "Приём успешно обновлён",
            data: updated,
          })
          .status(200);
      } catch (err) {
        res
          .json({
            status: 404,
            error: err,
            message: "Не удалось обновить приём",
          })
          .status(404);
      }
    } else if (req.query.key !== process.env.API_KEY) {
      res.status(403).send("Invalid Api Key");
    } else {
      res.status(403).send("Api Key is required");
    }
  });
// .delete(async (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     const {_id} = req.body;
//     if(req.query.key === process.env.API_KEY){

//     } else if(req.query.key !== process.env.API_KEY){
//         res.status(403).send("Invalid Api Key");
//     } else{
//         res.status(403).send("Api Key is required")
//     }
// })

router.route("/referrals").get((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.query.key === process.env.API_KEY) {
    if (req.query.pacientId) {
      const result = [];
      Visit.find().then((visits) => {
        visits.forEach((item) => {
          if (item.referral.length > 0) {
            item.referral.forEach((referr) => {
              if (referr.pacient._id === req.query.pacientId) {
                result.push(referr);
              }
            });
          }
        });
      });
      if (result.length > 0) {
        res
          .json({
            data: result,
            status: 200,
          })
          .status(200);
      } else {
        res
          .json({
            message: "Не найдено направлений",
            status: 204,
          })
          .status(204);
      }
    }
  } else if (req.query.key !== process.env.API_KEY) {
    res.status(403).send("Invalid Api Key");
  } else {
    res.status(403).send("Api Key is required");
  }
});
module.exports = router;
