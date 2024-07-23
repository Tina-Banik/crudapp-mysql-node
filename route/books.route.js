const express = require("express");
const con = require("../db/db_connection");
const uploadObj = require("../upload/fileConfig");
const checkAuthToken = require("../middleware/checkAuth");
const booksRoute = express.Router();
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
        console.log(`The ${filename} is deleted successfully !!!`);
        callback();
      }
    });
  } else {
    console.log(`The ${filename} does not exists`);
    callback();
  }
};
// insert the new book
booksRoute.post("/new-book", uploadObj.single("image"), (req, res) => {
  // res.status(200).json({
  //     success: true,
  //     message: `The new book is inserted`
  // })
  const { name, description, price } = req.body;
  const image = req.file.filename;
  const imageUrl = "http://localhost:3000/uploads/users";
  let sql = `INSERT INTO books (name, description,price,image) VALUES ('${name}','${description}','${price}','${imageUrl}/${image}') ORDER BY name,description,price`;
  con.query(
    sql,
    [name, description, price, `${imageUrl}/${image}`],
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.status(200).json({
          success: true,
          message: `The data is added successfully !!!!`,
          info: result,
        });
      }
    }
  );
});
// fetch all the books lists
booksRoute.get("/books-list", checkAuthToken, (req, res) => {
  // res.status(200).json({
  //     success: true,
  //     message: `The books list is shown here !!!! `
  // })
  let sql = `SELECT * FROM books`;
  con.query(sql, (error, result) => {
    if (error) {
      res.status(500).json(error);
    } else {
      if (!result.length) {
        res.status(500).json(error);
      } else {
        res.status(200).json({
          success: true,
          message: `All the books lists is shown here`,
          info: result,
        });
      }
    }
  });
});
//  get the books depends on the particular id
booksRoute.get("/get-books/:id", checkAuthToken, (req, res) => {
  let sql = `SELECT * FROM books WHERE book_id = '${req.params.id}'`;
  con.query(sql, (error, result) => {
    if (error) {
      res.status(500).json(error);
    } else {
      if (!result.length) {
        // res.status(500).json(error)
        res.status(500).json({
          success: false,
          message: `The book is not available now!!!`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `The books id is ${req.params.id}`,
          info: result,
        });
      }
    }
  });
});
// get the books with the price limit
booksRoute.get("/book-price/:st/:end", (req, res) => {
  // res.status(200).json({
  //     success: true,
  //     message: `The price limit is here`
  // })
  let start = Number(req.params.st);
  let end = Number(req.params.end);
  // res.status(200).json({
  //     st : start,
  //     end: end
  // })
  let sql = `SELECT * FROM books WHERE price BETWEEN ${start} AND ${end}`;
  if (start < end) {
    con.query(sql, (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.status(200).json({
          success: true,
          message: `The books are within this price ${start} and ${end} is here`,
          info: result,
        });
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: `The starting price should be small `,
    });
  }
});
// Delete Particular Book :
booksRoute.delete("/book-delete/:id", (req, res) => {
  // res.status(200).json({
  //     success: true,
  //     message: `The book is deleted...`
  // })
  let sql = `SELECT image FROM books WHERE book_id = '${req.params.id}'`;
  con.query(sql, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: `Failed to load the file ${error.message}`,
      });
    } else if (result.length === 0) {
      return res.status(404).json({
        message: `The books id =  ${req.params.id} till now is not listed`,
      });
    } else {
      let filename = result[0].image;
      deleteFile(filename, () => {
        let sql = `DELETE FROM books WHERE book_id='${req.params.id}'`;
        con.query(sql, (error, result) => {
          if (error) {
            res.status(500).json({
              message: `Failed to delete the file ${error.message}`,
            });
          } else {
            if (result.affectedRows === 0) {
              return res.status(404).json({
                success: false,
                message: `Bad Request !!!!!!`,
              });
            } else {
              return res.status(204).send();
            }
          }
        });
      });
    }
  });
});
// Update Particular book depends on ID :
booksRoute.all("/update-book/:id", uploadObj.single("image"), (req, res) => {
  // res.status(200).json({
  //     success: true,
  //     message: `The update info of the book is here !!!`
  // })
  if (req.method == "PUT" || req.method == "PATCH") {
    let sql = `SELECT * FROM books WHERE book_id = '${req.params.id}'`;
    con.query(sql, (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        if (!result.length) {
          res.status(401).json({ message: `The Bad request !!!!` });
        } else {
          let updateName = req.body.name ? req.body.name : result[0].name;
          let updateDesc = req.body.description
            ? req.body.description
            : result[0].description;
          let updatePrice = req.body.price ? req.body.price : result[0].price;
          let image_url = "http://localhost:3000/uploads/users";
          let updateFile = req.file
            ? `${image_url}/${req.file.filename}`
            : result[0].image;
          let updateSql = `UPDATE books SET `;
          updateSql += `name='${updateName}', description='${updateDesc}', price='${updatePrice}' `;
          if (req.file) {
            updateSql += ` , image='${updateFile}'`;
          }
          updateSql += ` WHERE book_id='${req.params.id}' `;
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
                    message: `The book details is updated`,
                    info: updateResult,
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
module.exports = booksRoute;
console.log("The books route is ready to use");