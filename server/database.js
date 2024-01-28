const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db_proiect.sqlite',
  define: {
    timestamps: false
} 
});

const Student = sequelize.define('student', {
    studentId: {
      type: DataTypes.INTEGER, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement:true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    major: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentEmail:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assignedProfessorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    requestFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  const Professor = sequelize.define('professor', {
    professorId: {
      type: DataTypes.INTEGER, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement:true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    professorEmail:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  const SesiuneInscriere = sequelize.define('sesiuneInscriere', {
    sessionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    studentsLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  const FirstRequest = sequelize.define('firstRequest', {
    firstRequestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    professorJustification: {
      type: DataTypes.STRING,
      allowNull: true,
    },  
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:'Wainting',
    },
  });

  const FinalRequest = sequelize.define('finalRequest', {
    finalRequestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentFilePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    professorFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

// Adaugă relația între Participation și Event
Professor.hasMany(SesiuneInscriere, { foreignKey: 'professorId' })

Professor.hasMany(Student, { foreignKey: 'assignedProfessorId' });
Student.belongsTo(Professor, { foreignKey: 'assignedProfessorId' });

SesiuneInscriere.belongsTo(Professor, { foreignKey: 'professorId' });

SesiuneInscriere.hasMany(FirstRequest, { foreignKey: 'sessionId' });
FirstRequest.belongsTo(SesiuneInscriere, { foreignKey: 'sessionId' });

Student.hasMany(FirstRequest, { foreignKey: 'studentId' });
FirstRequest.belongsTo(Student, { foreignKey: 'studentId' });

// Student.hasMany(FinalRequest, { foreignKey: 'studentId' });
// FinalRequest.belongsTo(Student, { foreignKey: 'studentId' });

// Professor.hasMany(FinalRequest, { foreignKey: 'professorId' });
// FinalRequest.belongsTo(Professor, { foreignKey: 'professorId' });

async function initialize() {
  await sequelize.authenticate();
  await sequelize.sync();
}

module.exports = { initialize, Student, Professor, FirstRequest,SesiuneInscriere };
