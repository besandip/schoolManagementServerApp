const express = require("express");
const router = express.Router();
const Fees = require("../model/fees");

router.post("/saveStudentFeesInfo", async (req, res) => {
    console.log("Received payload:", req.body);

    try {
        const {
            rollNumber,
            studentName,
            class: studentClass,
            monthlyFees,
            annualFees,
            annualRecord,
            monthlyRecord,
            paymentHistory,
        } = req.body;


        // Check if the student already exists
        let student = await Fees.findOne({ rollNumber });

        if (!student) {
            console.log('student not found')
            // Create a new student record
            student = new Fees({
                rollNumber,
                studentName,
                class: studentClass,
                monthlyFees,
                annualFees,
                annualRecord: {
                    totalPaid: annualRecord?.totalPaid || 0,
                    due: annualFees - (annualRecord?.totalPaid || 0),
                    lastPaymentDate: annualRecord?.lastPaymentDate || null,
                },
                monthlyRecord: monthlyRecord || [],
                paymentHistory: paymentHistory || [],
            });
        } else {
            // Update existing student record

            // Update annual records
            if (annualRecord) {
                console.log('student found')
                if (annualRecord.totalPaid != null) {
                    student.annualRecord.totalPaid += annualRecord.totalPaid;
                    student.annualRecord.due = Math.max(
                        0,
                        student.annualRecord.due - annualRecord.totalPaid
                    );
                }
                if (annualRecord.lastPaymentDate) {
                    student.annualRecord.lastPaymentDate = annualRecord.lastPaymentDate;
                }
            }

            // Update monthly records
            if (Array.isArray(monthlyRecord)) {
                monthlyRecord.forEach((record) => {
                    const existingRecord = student.monthlyRecord.find(
                        (r) => r.month === record.month
                    );
                    if (existingRecord) {
                        // Update existing record
                        existingRecord.amountPaid += record.amountPaid || 0;
                        existingRecord.due = Math.max(
                            0,
                            (existingRecord.due || 0) - (record.amountPaid || 0)
                        );
                        existingRecord.paymentDate =
                            record.paymentDate || existingRecord.paymentDate;
                    } else {
                        // Add new monthly record
                        student.monthlyRecord.push(record);
                    }
                });
            }

            // Update payment history
            if (Array.isArray(paymentHistory)) {
                console.log('paymnet history payloads',paymentHistory);
                student.paymentHistory.push(...paymentHistory);
                console.log('ssasasppp',student.paymentHistory);
            }
        }

        // Save the updated or new student record
        await student.save();

        res.status(201).json({
            message: "Student fees information saved successfully.",
            student,
        });
    } catch (err) {
        console.error("Error saving student fees information:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.get("/getAllstudentsFeesInfo", async (req, res) => {
    console.log(req.body)
    try {
        const studentFees = await Fees.find(); // Fetch all user documents from the database
        res.status(200).json(studentFees);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
});



// GET request to fetch a student by rollNumber
router.get("/getStudentFeesInfo/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;

    try {
        // Validate the rollNumber parameter
        if (!rollNumber) {
            return res.status(400).json({
                error: "rollNumber is required to fetch student details.",
            });
        }

        // Find the student by rollNumber
        const student = await Fees.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({
                error: `No student found with rollNumber: ${rollNumber}`,
            });
        }

        // Return the student details
        res.status(200).json({
            message: "Student details fetched successfully.",
            student,
        });
    } catch (err) {
        console.error("Error fetching student details:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.delete('/fees/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;

    try {
        // Find and delete the document based on rollNumber
        const feeRecord = await Fees.findOneAndDelete({ rollNumber });

        // If no record found
        if (!feeRecord) {
            return res.status(404).json({ message: "Fee record not found for roll number " + rollNumber });
        }

        // Success response
        res.status(200).json({ message: `Fee record for roll number ${rollNumber} deleted successfully.`,feeRecord });
    } catch (error) {
        console.error("Error deleting fee record:", error);
        res.status(500).json({ message: "Server error occurred while deleting fee record." });
    }
});

module.exports = router;