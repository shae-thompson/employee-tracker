// Require mysql, express and inquirer
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

// Questions for employee view/input
    // Options for what to do
const userOptions = () => {
    console.log(`Welcome to the Employee Tracker!`);
    
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'options',
            message: 'What woudl you like to do? Please select an option',
            choices: ["View all employees", "Add a New Employee", "Update an Employee's Role", "View all Roles", "Add a New Role", "View all Departments", "Add a New Department"],
        }
    ])
};

    // View all Employees
const viewEmployees = function() {
    console.log('These are your current Employees:')
    const employees = `SELECT * FROM employee`;
}
    // Add Employee

    // Update Employee Role

    // View all Roles

    // Add Role

    // View all Departments

    // Add Department