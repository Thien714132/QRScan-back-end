const router = require("express").Router();
const Course = require("../model/Course");
const Lesson = require("../model/Lesson");
const verify = require("./verifyToken");

//add lesson

router.post("/", async (req, res) => {
  const courseExist = await Course.findOne({ _id: req.body.course_id });
  if (!courseExist) return res.status(400).send("Course doesn't exists");
  const lessonExist = await Lesson.findOne({ course_id: req.body.course_id });
  if (lessonExist?.name == req.body.name)
    return res.status(400).send("Lesson already exists");
  const lesson = new Lesson({
    name: req.body.name,
    qr_code: req.body.qr_code,
    shift: req.body.shift,
    course_id: req.body.course_id,
    lesson_date: req.body.lesson_date,
  });

  try {
    const savedLesson = await lesson.save();
    res.send({ lesson: lesson });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get lesson by id

router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    res.json(lesson);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const lesson = await Lesson.find();
    res.json(lesson);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

//get all lesson by id course

router.get("/course/:id", async (req, res) => {
  const course = await Course.findById(req.params.id)
  try {
    const lesson = await Lesson.find({ course_id: req.params.id });
    res.status(200).send({lesson, course});
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

//delete lesson by id

router.delete("/:id", async (req, res) => {
  const lessonExist = await Lesson.findById({ _id: req.params.id });
  if (!lessonExist) return res.status(400).send("Lesson does't exists");
  try {
    // const lesson = await Lesson.findById(req.params.id)
    await Lesson.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

// add qr code

router.post("/:id/qrcode", async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson)
    return res.status(400).send({ message: "Lesson doesn't exists" });
  // const qrExist = await lesson.qr_code.find(item => item !== " ")
  // console.log(lesson.qr_code !== " ")
  if (lesson.qr_code === req.body.qr_code)
    res.status(400).send({ message: "QR code already exists" });
    else{
      try {
        // const lesson = await Lesson.findById(req.params.id)
        // console.log(course.students)
        lesson.qr_code = req.body.qr_code;
        await lesson.save();
        res.send({ lesson: lesson });
      } catch (error) {
        // res.status(400).send(error);
        res.status(400).json({ success: false, message: "Add failed" });
        // res.json({message: error})
      }
    }
});

module.exports = router;
