const Picture = require("../models/Picture");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const createPicture = async (req, res) => {
  try {
    const picture = new Picture({
      authorEmail: req.body.authorEmail,
      pictureName: req.file.filename,
    });
    await picture.save();
    res.writeHead(201);
  } catch (err) {
    console.log("in create pic : ", err);
    res.writeHead(500);
    JSON.stringify({ message: "Internal Server Error" });
  }
};

const getPictureById = async (req, res) => {
  const id = req.params.id;
  try {
    const picture = await Picture.findById(id);
    if (!picture) {
      res.writeHead(404).json({ message: "Picture not found" });
      return;
    }
    res.writeHead(200).json(picture);
  } catch (err) {
    res.writeHead(500).json({ message: "Internal Server Error" });
  }
};

const getAllPictures = async (req, res) => {
  try {
    const pictures = await Picture.find();
    return pictures;
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
};

const getPaginatedPictures = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Picture.countDocuments();
  const images = await Picture.find().skip(skip).limit(parseInt(limit));
  return { images, total };
};

const getPictureDetails = async (req, res, pictureId) => {
  try {
    const picture = await Picture.findById(pictureId);
    if (!picture) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Picture not found" }));
      return;
    }
    let comments = picture.Comments;
    if (!comments) {
      comments = [];
    }
    console.log(comments);
    res.writeHead(200, { "Content-Type": "application/json" });
    return {picture, comments};
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
};
// const createtest = async (req, res) => {
//   try {
//     let picture = new Picture({
//         pictureName: "e",
//         authorEmail: "shanley@hotmail.fr",
//         path: "/uploads/e.jpg",
//     });
//     picture.save();
//     let picture2 = new Picture({
//         pictureName: "f",
//         authorEmail: "shanley@hotmail.fr",
//         path: "/uploads/f.jpg",
//     });
//     picture2.save();
//     let picture3 = new Picture({
//         pictureName: "c",
//         authorEmail: "shanley@hotmail.fr",
//         path: "/uploads/c.jpg",
//     });
//     picture3.save();
//     let picture4 = new Picture({
//         pictureName: "d",
//         authorEmail: "shanley@hotmail.fr",
//         path: "/uploads/d.jpg",
//     });
//     picture4.save();
//     console.log(picture, "picture created successfully!");
//     res.writeHead(201).json(picture);
//   } catch (err) {
//     console.log(err.message);
//     res.writeHead(500, { "Content-Type": "text/plain" });
//     res.end(JSON.stringify({ message: "Internal Server Error" }));
//   }
// };

module.exports = {
  createPicture,
  getPictureById,
  getAllPictures,
  getPaginatedPictures,
  getPictureDetails,
  upload,
  // createtest,
};
