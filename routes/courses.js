const req = require("express/lib/request");
const Course = require("../model/Course");
const History = require("../model/History");
const Lesson = require("../model/Lesson");
const User = require("../model/User");

const router = require("express").Router();

// create courses

router.post("/", async (req, res) => {
  const courseExist = await Course.findOne({
    classroom_name: req.body.classroom_name,
  });
  if (courseExist) return res.status(400).send("Course already exists");
  const teacher = await User.findById(req.body.teacher_id);
  // console.log(teacher)
  if (teacher?.role !== "Teacher")
    return res.status(400).send("This user isn't a teacher");
  else {
    const course = new Course({
      classroom_name: req.body.classroom_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      teacher_id: teacher,
      color: req.body.color,
      location: req.body.location,
    });

    try {
      const savedCourse = await course.save();
      res.send({ course: course._id });
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

//get course by id

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

//get all courses

router.get("/", async (req, res) => {
  try {
    const course = await Course.find();
    res.json(course);
  } catch (error) {
    // res.status(400).send(error);

    res.json({ message: error });
  }
});

//Add student to course

router.post("/:id/student", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(400).send("Course doesn't exists");
  const studentExist = await course.students.find(
    (item) => item._id == req.body._id
  );
  if (studentExist)
    return res.status(400).send("Student already in this coures");
  const user = await User.findById({ _id: req.body._id });
  if (!user) return res.status(400).send("This user doesn't exist");
  if (user.role !== "Student")
    return res.status(400).send("This user isn't a student");
  else {
    try {
      const course = await Course.findById(req.params.id);
      // console.log(course.students)
      course.students.push(user);
      await course.save();
      res.send({ course: course });
    } catch (error) {
      // res.status(400).send(error);
      res.status(400).json({ success: false, message: "Add failed" });
      // res.json({message: error})
    }
  }
});

//get course and lesson by student id

router.get("/student/:id", async (req, res) => {
  var inCourse = [];
  try {
    const course = await Course.find();
    const studentExist = course.filter((item) => item.students.length >= 1);
    for (var i = 0; i < studentExist.length; i++) {
      var a = await studentExist[i].students.find(
        (item) => item._id == req.params.id
      );
      if (a != undefined && a != {}) {
        inCourse.push(studentExist[i]);
      }
    }
    const lesson = await Lesson.find();

    var newArr = [];

    for (var i = 0; i < inCourse.length; i++) {
      if (inCourse != [] && inCourse != undefined) {
        b = lesson.filter((item) => item.course_id == `${inCourse[i]._id}`);
        // console.log(b)
        newArr.push(b);
      } else newArr = [];
    }
    // console.log(b)
    res.send({ courses: inCourse, lesson: newArr });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed" });
  }
});

// const getCoures = async(id) =>  {
//   const course = await Course.find();
//     const studentExist = course.filter((item) => item.students.length >= 1);
//     var inCourse = [];
//     for (var i = 0; i < studentExist.length; i++) {
//       var a = await studentExist[i].students.find(
//         (item) => item._id == id
//       );
//       if (a != undefined && a != {}) {
//         inCourse.push(studentExist[i]);
//       }
//     }
//     return(inCourse)
// }

//get course by teacher id

router.get("/teacher/:id", async (req, res) => {
  // var inCourse = [];
  try {
    const course = await Course.find();
    const teacherExist = course.filter(
      (item) => item.teacher_id._id == req.params.id
    );

    // console.log(teacherExist)
    // for (var i = 0; i < studentExist.length; i++) {
    //   var a = await studentExist[i].students.find(
    //     (item) => item._id == req.params.id
    //   );
    //   if (a != undefined && a != {}) {
    //     inCourse.push(studentExist[i]);
    //   }
    // }
    const lesson = await Lesson.find();

    var newArr = [];

    for (var i = 0; i < teacherExist.length; i++) {
      if (teacherExist != [] && teacherExist != undefined) {
        b = lesson.filter((item) => item.course_id == `${teacherExist[i]._id}`);
        // console.log(b)
        newArr.push(b);
      } else newArr = [];
    }
    // console.log(b)
    res.send({ courses: teacherExist, lesson: newArr });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed" });
  }
});

//get statistics

router.get("/:id/statistic", async (req, res) => {
  const statistic = [];
  const history = await History.find();
  const course = await Course.findById(req.params.id);
  const find_history = history.filter(
    (item) => item.course_id == req.params.id
  );
  if(!find_history) return res.status(400).send("There'is no one checks in");

  for (var i = 0; i < course.students.length; i++) {
    const A = find_history.filter(
      (item) => item.student_id == course.students[i]._id
    );
    // console.log("____A",A)
    const B = {
      student_id: " ",
      name: " ",
      attendance: " ",
      lesson_attendance: [],
    };
    for (var j = 0; j < A.length; j++) {
      B.lesson_attendance.push(A[j].lesson_name);
    }
    B.student_id = course.students[i]._id;
    B.name = course.students[i].name;
    B.attendance = A.length;
    statistic.push(B);
  }
  // console.log("____A",statistic)
  res.send({"statistic": statistic})
});

module.exports = router;
