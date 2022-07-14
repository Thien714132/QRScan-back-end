const Course = require("../model/Course");
const History = require("../model/History");
const Lesson = require("../model/Lesson");
const User = require("../model/User");
const verify = require("./verifyToken");

const router = require("express").Router();

//add history

router.post("/", verify, async (req, res) => {
  const find_lesson = await Lesson.findById(req.body.lesson_id);
  // console.log(find_lesson.name)

  const find_course = await Course.findById(find_lesson.course_id);

  const find_student = await find_course.students.filter(
    (item) => item._id == req.body.student_id
  );

  if (!find_student) return res.status(400).send("You are not in this class");
  const historyExist = await History.findOne({
    lesson_id: req.body.lesson_id,
    student_id: req.body.student_id,
  });
  if (historyExist) return res.status(400).send({"message":"You've already checked in"});
    const history = new History({
      check_in_at: req.body.check_in_at,
      student_id: req.body.student_id,
      lesson_id: req.body.lesson_id,
      device_name: req.body.device_name,
      lesson_name: find_lesson.name,
      course_id: find_course._id,
      course_name: find_course.classroom_name,
      student_name: find_student[0].name,
      student_code: find_student[0].student_code
    });

    try {
      const savedHistory = await history.save();
      res.send({history: history });
    } catch (error) {
      res.status(400).send(error);
    }

});




//get student check in by lesson
router.get("/lesson/:id", verify,async (req, res) => {
    const history = await History.find();
    const findHistory = history.filter((item)=> item.lesson_id == req.params.id)
    if (!findHistory) return res.status(400).send({"message":"There's no one a all"});
    res.send({ history: findHistory });
  });

  router.get("/student/:id", verify,async (req, res) => {
    const history = await History.find();
    const findHistory = history.filter((item)=> item.student_id == req.params.id)
    if (!findHistory) return res.status(400).send({"message":"Failed"});
    res.send({ history: findHistory });
  });


  router.get("/teacher/:id",verify, async(req, res) => {
    const course = await Course.find();
    const teacherExist = course.filter(
      (item) => item.teacher_id._id == req.params.id
    );
    const history = await History.find();
    // console.log(teacherExist)

    var newArr = [];

    for (var i = 0; i < teacherExist.length; i++) {
      if (teacherExist != [] && teacherExist != undefined) {
        b = history.filter((item) => item.course_id == `${teacherExist[i]._id}`);
        // console.log(b)
        newArr.push(b);
      } else newArr = [];
    }
    // console.log(b)
    res.send({history: newArr });
  });

module.exports = router;
