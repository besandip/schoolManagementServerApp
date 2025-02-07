const express = require("express");
const router = express.Router();
const Student = require("../model/student");


router.post("/student", async (req, res) => {
  console.log('payloads',req.body)
    try {
      // Extract data from the request body
      const { personalInformation, parentInformation } = req.body;
  
      // Validate request body
      if (!personalInformation || !parentInformation) {
        return res.status(400).json({ message: "Personal and parent information are required." });
      }
  
      // Create a new user instance
      const newStudent = new Student({
        personalInformation,
        parentInformation,
      });
  
      // Save the user to the database
      const savedStudent = await newStudent.save();
  
      // Respond with the created user
      res.status(200).json({ message: "User created successfully!", student: savedStudent });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error.", error: error.message });
    }
  });


  
// Get all users
router.get("/getAllstudents", async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all user documents from the database
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});

// Get a user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id); // Find the user by ID

    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching user by ID:", error);

    // Handle invalid ObjectId error
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});

router.delete("/students/:roleNumber", async (req, res) => {
  try {
    const { roleNumber } = req.params;
    console.log(roleNumber)

    // Find and delete the student by roleNumber
    const deletedStudent = await Student.findOneAndDelete({ "personalInformation.roleNumber": roleNumber });

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found with the given role number." });
    }

    res.status(200).json({ message: "Student deleted successfully.", data: deletedStudent });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the student.", error: error.message });
  }
});


  module.exports = router;