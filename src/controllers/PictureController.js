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
    res.writeHead(200, { "Content-Type": "application/json" });
    return {picture, comments};
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
};

const likePicture = async (req, res, pictureId, user) => {
  try {
    const picture = await Picture.findById(pictureId);
    console.log(picture);
    if (!picture) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Picture not found" }));
      return;
    }
    if (req.method === 'POST') {
      if (picture.likedBy.includes(user.username)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "You have already liked this picture" }));
        return;
      }
      console.log("like");
      picture.like += 1;
      picture.likedBy.push(user.username);
    } else if (req.method === 'DELETE') {
      if (!picture.likedBy.includes(user.username)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "You haven't liked this picture" }));
        return;
      }
      console.log("dislike");
      picture.like -= 1;
      picture.likedBy = picture.likedBy.filter(username => username !== user.username);
      console.log(picture.likedBy, user.username);
    }
    await picture.save();
    console.log(picture);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, likesHtml: picture.like }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
}

const addComment = async (req, res) => {
  try {
    const { pictureId } = req.params;
    const { text } = req.body;
    const user = req.user; // Assume req.user contains the authenticated user

    const picture = await Picture.findById(pictureId);
    if (!picture) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Picture not found" }));
      return;
    }

    const comment = { author: user.username, text };
    picture.comments.push(comment);
    await picture.save();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, author: user.username, text }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
}






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
  likePicture,
  addComment
  // createtest,
};
