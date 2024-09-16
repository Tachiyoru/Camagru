const Picture = require("../models/Picture");
const multer = require("multer");
const { default: test } = require("node:test");
const path = require("path");
const { text } = require("stream/consumers");
const likor = require("../components/likor");
const commentator = require("../components/commentator");
const UserRef = require("../models/User");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const savePicture = async (user, filename, base64Data) => {
	try {
	const picture = new Picture({
      authorEmail: user.email,
      pictureName: filename,
      path: `/uploads/${filename}`,
	  ImageData: base64Data,
    });
    await picture.save();
  } catch (err) {
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
  const images = await Picture.find().skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
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
    return { picture, comments };
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
};

const likePicture = async (req, res, pictureId, user) => {
    try {
      const picture = await Picture.findById(pictureId);
      
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
            
        const user2 = await UserRef.findOne({ email: picture.authorEmail });
        if (user2.notification) {
              await likor(user2.email);
            }
        picture.like += 1;
        picture.likedBy.push(user.username);

      } else if (req.method === 'DELETE') {
        if (!picture.likedBy.includes(user.username)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "You haven't liked this picture" }));
          return;
        }
        picture.like -= 1;
        picture.likedBy = picture.likedBy.filter(username => username !== user.username);
      }
  
      await picture.save();
  
      res.writeHead(200, { "Content-Type": "application/json" });
      return picture.like;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  };
  
const addComment = async (req, res, pictureId, user, text) => {
  try {
    const picture = await Picture.findById(pictureId);
    if (!picture) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Picture not found" }));
      return;
    }
    const newComment = { author: user.username, text: text };
    picture.Comments.push([user.username, text]);
    await picture.save();
    const user2 = await UserRef.findOne({ email: picture.authorEmail });
    if (user2.notification) {
      await commentator(user2.email);
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return newComment;
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const deletePicture = async (req, res, pictureId) => {
	try {
		const picture = await Picture.findById(pictureId);
		if (!picture) {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Picture not found" }));
			return;
		}
		await Picture.findByIdAndDelete(pictureId);
		res.writeHead(200, { "Content-Type": "application/json" });
		return 1;
	} catch (err) {
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Internal Server Error" }));
	}
};

const getUserPictures = async (req, res, user) => {
	try {
		const pictures = await Picture.find({ authorEmail: user.email });
		return pictures;
	} catch (err) {
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Internal Server Error" }));
	}
}

// const createtest = async (req, res) => {
// 	  try {
// 		let imageBuffer = await fs.readFile("/uploads/a.jpg");
// 		let imageB64 = imageBuffer.toString('base64');
// 		const fileName = `picture_${Date.now()}.jpg`;
// 		imageB64 = imageB64.replace(/^data:image\/png;base64,/, '');
// 		let picture = new Picture({
// 				pictureName: `picture_${Date.now()}.jpg`,
// 				authorEmail: "shanley@hotmail.fr",
// 				path: "/uploads/e.jpg",
// 				ImageData: imageB64,
// 			});
// 		picture.save();
// 		imageBuffer = await fs.readFile("/uploads/b.jpg");
// 		imageB64 = imageBuffer.toString('base64');
// 		imageB64 = imageB64.replace(/^data:image\/png;base64,/, '');
// 		let picture2 = new Picture({
// 				pictureName: `picture_${Date.now()}.jpg`,
// 				authorEmail: "shanley@hotmail.fr",
// 				ImageData: imageB64,
// 			});
// 		picture2.save();
// 		imageBuffer = await fs.readFile("/uploads/c.jpg");
// 		imageB64 = imageBuffer.toString('base64');
// 		imageB64 = imageB64.replace(/^data:image\/png;base64,/, '');
// 		let picture3 = new Picture({
// 				pictureName: `picture_${Date.now()}.jpg`,
// 				authorEmail: "shanley@hotmail.fr",
// 				ImageData: imageB64,
// 			});
// 		picture3.save();
//     res.writeHead(201).json(picture);
//   } catch (err) {
//     res.writeHead(500, { "Content-Type": "text/plain" });
//     res.end(JSON.stringify({ message: "Internal Server Error" }));
//   }
// };

module.exports = {
  savePicture,
  getPictureById,
  getAllPictures,
  getPaginatedPictures,
  getPictureDetails,
  upload,
  likePicture,
  addComment,
  deletePicture,
  getUserPictures,
  // createtest,
};
