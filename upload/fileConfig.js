const multer = require("multer");
const mime = require("mime-types");
const fileConfig = multer.diskStorage({
  destination: "public/uploads/users",
  filename: function (req, file, cb) {
    let unique = Date.now();
    let extensions = "";
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      extensions = ".jpg";
    } else if ((file.mimetype === "image/png")) {
      extensions = ".png";
    }
    cb(null, file.fieldname + unique + extensions);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg, png images are allowed"), false);
  }
};
const uploadObj = multer({ storage: fileConfig, fileFilter: fileFilter, limits: {fileSize: 12000}})
module.exports = uploadObj;
console.log("File upload obj is ready to use");