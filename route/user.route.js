const express = require("express");
const con = require("../db/db_connection");
const uploadObj = require("../upload/fileConfig");
// const checkAuth = require("../middleware/checkAuth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRoute = express.Router();
// here is the code for deleting the file when user delete the their profile also
const fs = require("fs");
const path = require("path");
const deleteFile = (filename, callback) => {
  const filePath = path.join(
    __dirname,
    "../public/uploads/users",
    filename.replace(/^.*[\\\/]/, "")
  );
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`The ${filename} is deleted successfully !!!!`);
        callback();
      }
    });
  } else {
    console.log(`The ${filename} does not exists`);
    callback();
  }
};
// user signup
userRoute.post("/user-signup", uploadObj.single("avatar"), (req, res) => {
  let { first_name, last_name, email, phone, pass1 } = req.body;
  let avatar = req.file.filename;
  let image_url = "http://localhost:3000/uploads/users";
  let salt = bcrypt.genSaltSync(10);
  let hashPass = bcrypt.hashSync(pass1, salt);
  let sql = `INSERT INTO users (first_name, last_name, email, phone, avatar, pass1) VALUES('${first_name}','${last_name}','${email}','${phone}','${image_url}/${avatar}','${hashPass}')`;
  // now execute the query
  con.query(sql, (error, result) => {
    if (error) {
      res.status(500).json({
        message: `Something went wrong !!!`,
        err: error,
        msg: error.sqlMessage,
      });
    } else {
      if (result.affectedRows) {
        res.status(200).json({
          message: `User sign up successfully !!!!`,
        });
      } else {
        res.status(500).json({
          message: `Wrong credentials !!!!!`,
        });
      }
    }
  });
});
// user login
userRoute.post("/user-login",(req, res) => {
  // res.status(200).json({
  //     message: `User login success`
  // })
  let { email, pass1 } = req.body;
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  con.query(sql, (error, result) => {
    if (error) {
      res.status(500).json({
        err: error,
      });
    }
    if (result.length === 0) {
      return res.status(401).json({
        message: `User does not exists. Please sign up the form`,
      });
    }
    let dbPas = result[0].pass1;
    console.log(dbPas);
    let passMatch = bcrypt.compareSync(pass1, dbPas);
    if (passMatch) {
      // res.status(200).json({
      //     message: `The token is created`
      // })
      let token = jwt.sign(
        { email: result[0].email },
        process.env.PRIVATE_KEY,
        { expiresIn: "20s" }
      );
      res.status(200).json({
        message: `Login success !!!`,
        email: result[0].email,
        _token: token,
      });
    } else {
      res.status(401).json({
        message: `Wrong Credentials !!!!!!`,
      });
    }
  });
});
// get all user lists
userRoute.get("/user-lists", (req, res) => {
  let sql = `SELECT * FROM users`;
  con.query(sql, (error, result) => {
    if (error) {
      res.status(500).json(error);
    } else {
      if (result.length === 0) {
        res.status(400).json({
          success: false,
          message: `The give user is not find`,
        });
      } else {
        res.status(200).json({
          success: true,
          info: result,
        });
      }
    }
  });
});
// delete the user
userRoute.delete("/delete-user/:id", (req, res) => {
    const userId = req.params.id;
  let sql = `SELECT avatar FROM users WHERE _id='${req.params.id}'`;
  con.query(sql,userId, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: `failed to load the user ${error.message}`,
      });
    }else if(result.length === 0){
        return res.status(404).json({
            message: `Users not found with the id ${req.params.id}`
        })
    }
    else{
        // if(result.length){
            let filename = result[0].avatar;
            deleteFile(filename, () => {
                let sql = `DELETE FROM users WHERE _id='${req.params.id}'`;
                con.query(sql,(error,result)=>{
                    if(error){
                        return res.status(500).json({
                            message:`Failed to delete the user ${error.message}`
                        })
                    }else{
                        if(result.affectedRows === 0){
                            return res.status(404).json({
                                message : `Users with the given id not found ${req.params.id}`
                            });
                        }else{
                            return res.status(204).send();
                        }
                    }
                })
            })
        // }
        // else{
        //     return res.status(500).json({
        //         message: `The user is not found !!!!!`
        //     })
        // }
    }
  });
});
// update the user based on the id
userRoute.all("/update-user/:id", uploadObj.single("avatar"), (req, res) => {
  if (req.method == "PUT" || req.method == "PATCH") {
    let sql = `SELECT * FROM users WHERE _id='${req.params.id}'`;
    con.query(sql, (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        if (!result.length) {
          res.status(404).message({ message: `user id not found!!!!!` });
        } else {
          let updateFirstName = req.body.first_name
            ? req.body.first_name
            : result[0].first_name;
          let updateLastName = req.body.last_name
            ? req.body.last_name
            : result[0].last_name;
          let updateEmail = req.body.email ? req.body.email : result[0].email;
          let updatePhone = req.body.phone ? req.body.phone : result[0].phone;
          let image_url = "http://localhost:3000/uploads/users";
          let updateAvatar = req.file
            ? `${image_url}/${req.file.filename}`
            : result[0].avatar;
          // here is the code if the user do not want to set the password
          let salt = bcrypt.genSaltSync(10);
          let updatePass1;
          if (req.body.pass1) {
            updatePass1 = bcrypt.hashSync(req.body.pass1, salt);
          } else {
            updatePass1 = result[0].pass1;
          }
          // end the update password code
          let updateSql = `UPDATE users SET `;
          updateSql += `first_name='${updateFirstName}', last_name='${updateLastName}', email='${updateEmail}', phone='${updatePhone}'`;
          if (req.file) {
            updateSql += ` , avatar='${updateAvatar}'`;
          }
          if (req.body.pass1) {
            updateSql += ` , pass1='${updatePass1}'`;
          }
          updateSql += ` WHERE _id='${req.params.id}' `;
          con.query(updateSql, (error, result) => {
            if (error) {
              res.status(500).json(error);
            } else {
              con.query(sql, (fetchError, updateResult) => {
                if (fetchError) {
                  res.status(500).json(error);
                } else {
                  res.status(200).json({
                    success: true,
                    info: updateResult,
                    message: `The user id is updated`,
                  });
                }
              });
            }
          });
        }
      }
    });
  } else {
    res.status(500).json({
      message: `${req.method} is not supported !!!!`,
    });
  }
});
module.exports = userRoute;
console.log("The user route is set up successfully !!!!");