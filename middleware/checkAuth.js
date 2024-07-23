const jwt = require('jsonwebtoken');
const checkAuthToken = function check(req,res,next){
    // console.log("Token check middle ware");
    // next();
    let head_token = req.headers._token;
    // console.log(head_token);
    try{
        let decoded = jwt.verify(head_token,process.env.PRIVAtE_KEY);
        console.log(decoded);
        next(); // it points to the next resources of the checking point/ function check user auth properly
    }catch(error){
        res.status(500).json({err: error})
    }
    console.log(head_token);
}
module.exports = checkAuthToken;
console.log("The check middle ware is ready to use");