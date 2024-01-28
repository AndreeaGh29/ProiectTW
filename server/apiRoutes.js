  const express = require('express');
  const { Op } = require('sequelize');
  const { Student, Professor, FirstRequest, SesiuneInscriere,sequelize } = require('./database');
  
  
  const router = express.Router();
  
  //Endpoint pentru autentificare
  router.post('/auth', async (req, res) => {
    const { email, hashedPassword } = req.body;

    try{
    let user = await Student.findOne({ where: { studentEmail: email, hashedPassword} });
    
    if (user) {
      res.json({ success: true, userType: 'student' });
    } else {
      user = await Professor.findOne({ where: { professorEmail: email, hashedPassword } });
      if (user) {
        res.json({ success: true, userType: 'professor' });
      } else {
        res.json({ success: false });
      }
    }
    }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  });
  
  
  
  // Endpoint pentru obținerea informațiilor despre profesor
  router.get('/professor/:professorId', async (req, res) => {
    try {
      const { professorId } = req.params;
      const professor = await Professor.findOne({
        where: {
          professorId,
        },
        attributes: ['professorId', 'lastName'],
      });
  
      if (professor) {
        res.status(200).json({ professor });
      } else {
        res.status(404).json({ error: 'Utilizatorul nu a fost găsit.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint pentru preluarea tuturor profesorilor
router.get('/professors', async (req, res) => {
  try {
      const professors = await Professor.findAll({
          attributes: ['professorId', 'lastName']
      });
      res.status(200).json(professors);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  


//aflarea de informatii despre un student
router.get('/student/:id', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findByPk(studentId);

        if (student) {
            res.status(200).json({ student });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error getting student by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//stergerea unui student
router.delete('/student/:id', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await student.destroy();
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//pentru update student
router.put('/student/:id', async (req, res) => {
  try {
      const { studentId } = req.params;
      const {studentEmail, hashedPassword} = req.body;  
      const student = await Student.findByPk(studentId);

      if (!student) {
          return res.status(404).json({ error: 'Student not found' });
      }

      await student.update({studentEmail, hashedPassword});
      res.status(200).json({ student });
  } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//pentru adaugarea unui cereri noi
router.post('/firstRequest/:firstRequestId', async (req, res) => {
    try {
        const { studentId, sessionId, title, description } = req.body;
;
        const newFirstRequest = await FirstRequest.create({
            studentId: studentId,
            sessionId: sessionId,
            title: title,
            description: description,
            professorJustification: null,
            status: PRESTATUS.PENDING,
        });

        if (!newFirstRequest) {
            return res.status(400).json({ message: "Invalid data" });
        }

        res.status(201).json({ message: "Preliminary request created", newFirstRequest });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: "Internal server issues" });
    }
});

//endpoint pentru aflare informatii despre cerere
router.put('/firstRequest/:firstRequestId', async (req, res) => {
    try {
      const { firstRequestId } = req.body;
  
      if (!firstRequestId) {
        return res.status(400).json({ message: "Malformed request" });
      }
  
      const request = await firstRequest.findOne({
        where: {
          firstRequestId: firstRequestId,
        },
      });
  
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      const session = await SesiuneInscriere.findOne({
        where: {
          sessionId: request.sessionId,
        },
      });
  
      if (session.enrolledStudents >= session.studentsLimit) {
        return res.status(409).json({ message: "Session is full" });
      }
  
      const student = await Student.findOne({
        where: {
          studentId: request.studentId,
        },
      });
  
      request.status = PRESTATUS.APPROVED;
      await request.save();
  
      student.assignedProfessorId = req.body.professorId;
      await student.save();
  
      session.enrolledStudents += 1;
      await session.save();
  
      res.status(200).json({ message: "Preliminary request accepted" });
    } catch (err) {
      console.warn(err);
      return res.status(500).json({ message: "Internal server issues" });
    }
  });

  //endpoint pentru stergerea unei cereri
router.delete('/firstRequest/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FirstRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: 'First request not found' });
    }

    await request.destroy();
    res.status(200).json({ message: 'First request deleted successfully' });
  } catch (error) {
    console.error('Error deleting first request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//gasirea tuturor cererilor unui profesor
router.get('/firstRequest/:professorId', async (req, res) => {
  try {
    const { professorId } = req.params;
    const requests = await FirstRequest.findAll({
      include: [{
        model: SesiuneInscriere,
        where: { professorId }
      }]
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  //crearea unei sesiuni noi 
router.post('/sesiuneInscriere', async (req, res) => {
    try {
        const { professorId, startTime, endTime, studentsLimit } = req.body;

        if (!professorId || !startTime || !endTime || !studentsLimit) {
            return res.status(400).json({ message: "Malformed request" });
        }

        const professor = await Professor.findByPk(professorId);

        const sesiuneNoua = await SesiuneInscriere.create({
            professorId: professorId,
            professorName: professor.name,
            startTime: startTime,
            endTime: endTime,
            enrolledStudents: 0,
            studentsLimit: studentsLimit,
        });

        if (!sesiuneNoua) {
            return res.status(400).json({ message: "Invalid data" });
        }

        res.status(201).json({ message: "Enrollment session created", sesiuneNoua });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server issues" });
    }
});


router.get('/sesiuniActive', async (req, res) => {
    try {
        const sesiuniActive = await SesiuneInscriere.findAll({
            where: {
                startTime: { [Op.lt]: new Date() },
                endTime: { [Op.gt]: new Date() },
                enrolledStudents: { [Op.lt]: { [Op.col]: "studentsLimit" } },
            },
        });

        if (!sesiuniActive) {
            return res.status(404).json({ message: "No active sessions" });
        }

        res.status(200).json({ sesiuniActive });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server issues" });
    }
});

module.exports = router;


// Endpoint pentru crearea unui sesiuni
// router.post('/sesiune', async (req, res) => {
//   try {
//     const { sessionId, startTime, endTime, studentsLimit } = req.body;

//     if (!sessionId || !startTime || !studentsLimit) {
//       return res.status(400).json({ error: 'Numele, startTime si limita de studenti sunt obligatorii.' });
//     }

//     // Verifica daca endTime este inainte de startTime
//     if (endTime && new Date(endTime) <= new Date(startTime)) {
//       return res.status(400).json({ error: 'Data de sfârșit trebuie să fie după data de început.' });
//     }
  
//     const sesiune = await Event.create({ sessionId, startTime, endTime, studentsLimit });

//     res.status(201).json({ sesiune });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.post('/student/login', async (req, res) => {
//     try {
//         const { studentEmail, hashedPassword } = req.body;
//         const student = await Student.findOne({
//             where: {
//                 studentEmail: studentEmail,
//                 hashedPassword: hashedPassword
//             }
//         });

//         if (student) {
//             res.status(200).json({ student });
//         } else {
//             res.status(401).json({ error: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error('Error in student login:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

//pentru updatarea statusului cererii
// router.put('/firstRequest/:requestId', async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const { status } = req.body; // 'Aprobata' sau 'Respinsa'

//     // Logica pentru a verifica limita de cereri aprobate
//     // ...

//     const updatedRequest = await FirstRequest.update({ status }, {
//       where: { id: requestId }
//     });
//     res.status(200).json(updatedRequest);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// module.exports = router;

// router.post('/firstRequest', async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.body;
//     const firstRequest = await FirstRequest.create({ studentId, sessionId, status: 'În așteptare' });
//     res.status(201).json(firstRequest);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
