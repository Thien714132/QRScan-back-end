const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

router.post("/register", async (req, res) => {
  //Validate here
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check email exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create a user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    student_code: req.body.student_code,
    date_of_birth: req.body.date_of_birth,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: "Email not found" });

  //Check password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Invalid password" });

  //Create and assign a token
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send({ access_token: token });

  //   res.send("Logged in!!!");
});

router.get("/", verify, async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

router.get("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ message: "User doesn't exist" });
    res.json(user);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

//change user infor

router.put("/:id",verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ message: "User doesn't exist" });
    const data = await User.updateOne({ _id: user._id }, { $set: req.body });
    res.json({ message: "Sucessfully" });
  } catch (error) {
    res.json({ message: "Failed" });
  }
});

//change password

router.put("/password/:id",verify, async (req, res) => {
  try {
    //Hash password
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ message: "User doesn't exist" });

    const validPassword = await bcrypt.compare(req.body.current_password, user.password);
    if (!validPassword)
      return res.status(400).send({ message: "Invalid password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const data = await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    res.json({ message: "Sucessfully" });
  } catch (error) {
    res.json({ message: "Failed" });
  }
});

module.exports = router;
