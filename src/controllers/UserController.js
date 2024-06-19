const User = require('../models/User');

const index = async (req, res) => {
    try {
        const users = await User.find({});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

const show = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.writeHead(200).json(user);
        res.end(JSON.stringify(user));
    } catch (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

const create = async (req, res) => {
    try {
        console.log("salut ",req.body);
        const info = split(req.body, '&');
        let user = new User({
            userName: info[0],
            email: info[1],
            password: info[2]
        });
        console.log("user", user);
        user.save();
        console.log(user, "user created successfully!");
        res.writeHead(201).json(user);
        res.end(JSON.stringify(user));
    } catch (err) {
        res.writeHead(500).json({ message: err.message });
        res.end('Internal Server Error');
    }
}

const update = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.userName = req.body.userName;
        user.email = req.body.email;
        user.password = req.body.password;
        user.save();
        res.writeHead(200).json(user);
        res.end(JSON.stringify(user));
    } catch (err) {
        res.writeHead(500).json({ message: err.message });
        res.end('Internal Server Error');
    }
}

const destroy = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.delete();
        res.writeHead(200).json(user);
        res.end(JSON.stringify(user));
    } catch (err) {
        res.writeHead(500).json({ message: err.message });
        res.end('Internal Server Error');
    }
}

const createtest = async (req, res) => {
    try {
        let user = new User({
            userName: "pierre",
            email: "req.body.email",
            password: "req.body.password"
        });
        user.save();
        console.log(user, "user created successfully!");
        res.writeHead(201).json(user);
        res.end(JSON.stringify(user));
    } catch (err) {
        console.log(err.message);
        res.writeHead(500).json({ message: err.message });
        res.end('Internal Server Error');
    }
}

module.exports = {
    index,
    show,
    createtest,
    create,
    update,
    destroy
};