const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const { error } = require("console");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// get
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    //serverdegi modelli aylanib hamma userlani opkeberadi

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
// get

//post
router.post("/", async (req, res) => {
  const { name } = req.body;

  let user = await User.findOne({ name });
  if (user) return res.send("Bu ismli User mavjud!");

  user = new User(req.body);
  await user.save();

  res.send(req.body);
});
//post

// registration
router.post("/register", async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
      return res.status(400).send("User uje bor!");
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPwd) => {
      if (err) {
        return res.json({
          error: err,
        });
      }

      const user = new User({
        ...req.body,
        password: hashedPwd,
      });

      await user.save();

      return res.status(201).json(user);
    });
  } catch (error) {}
});
// registration

// login
router.post("/login", async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
      const isValidPwd = await bcrypt.compare(
        req.body.password,
        exists.password
      );

      if (isValidPwd) {
        const token = jwt.sign({ user: exists }, "root", {
          expiresIn: "2h",
        });

        res.status(200).json({ token: token });
      } else {
        res.status(400).send("Parol xato terilgan!");
      }
    } else {
      res.status(404).send("User topilmadi");
    }
  } catch (error) {}
});
// login

//delete
router.delete("/:_id", async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params._id });

    res.send(`${req.params._id} User delete bo'ldi: OK`);
  } catch (error) {
    console.log({
      error,
      message: "User o'chmadi, nimadur noto'g'ri ketgan!",
    });
  }
});
//delete

//get by id
router.get("/:_id", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
//get by id

//patch
router.patch("/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const updUser = req.body;

    const result = await User.findByIdAndUpdate(_id, updUser);
    res.send(result);
  } catch (error) {
    console.log({
      error,
      message: "Patch ishlamadi, Error!",
    });
  }
});
// patch

module.exports = router;
