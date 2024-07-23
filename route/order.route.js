const express = require("express");
const orderRouter = express.Router();
const con = require("../db/db_connection");
const booksRoute = require("./books.route");

// for creating the order
function createOrder() {
  let order_id = Math.random() * 67890909 + 1;
  return order_id;
}
orderRouter.post("/book/order/buy/:book_id/:user_id", (req, res) => {
  let bookId = req.params.book_id;
  let userId = req.params.user_id;
  //   res.status(200).json(`Order placed for book ${bookId} by user ${userId}`);
  //   let { user_id, book_id } = req.body;
  let orderId = Math.floor(createOrder());
//   console.log(orderId);
  let sql = `INSERT INTO orders (order_id,user_id,book_id) VALUES ('${orderId}','${userId}','${bookId}')`;
  con.query(sql, (error, result) => {
    if (error) {
      res.status(500).json({
        message: `Something Went Wrong !!!`,
        err: error,
        msg: error.sqlMessage,
      });
    } else {
      if (result.affectedRows) {
        res.status(200).json({
          success: true,
          message: `Order is placed successfully !!!`,
        });
      } else {
        res.status(401).json({
          success: false,
          message: `Order is not placed`,
        });
      }
    }
  });
});
// 2. View Order Details :
booksRoute.get('/books/order/view/:order_id',(req,res)=>{
    // res.status(200).json({
    //     message : `View your order lists`
    // })
    let order_id = req.params.order_id;
    // console.log(order_id);
    let sql = `SELECT users.first_name, users.last_name, users.email, users.phone, users.avatar, users.pass1, books.name, books.description, books.price, books.image, orders.order_id, orders.order_date FROM orders INNER JOIN users ON (orders.user_id = users._id) INNER JOIN books ON (orders.book_id = books.book_id) AND orders.order_id = '${order_id}'`;
    // console.log(sql);
    con.query(sql,(error,result)=>{
      if(error){
        res.status(500).json(error)
      }else{
        if(result.length){
          res.status(200).json({
            success: true,
            message: `Order is placed successfully !!!!`,
            info: result
          })
        }else{
          res.status(401).json({
            message:` Order is not placed. Please Try Again`
          })
        }
      }
    })
})
module.exports = orderRouter;
console.log("the order router works properly !!!");