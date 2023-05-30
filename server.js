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
const connection = mysql.createConnection(
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
const userOptions = function() {
    console.log(`Welcome to the Employee Tracker!`);
    
    return inquirer.prompt ([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'options',
            choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'Update Employee Manager', 'View Employees by Manager', 'View Employees by Department', 'Delete Employee', 'Delete Role', 'Delete Department', 'Find Total Budget of Department', 'Quit']
        },
    ])
    .then ((answer) => {
      switch (answer.options) {
          case 'View All Employees':
              viewEmployees()
              break
          case 'Add Employee':
              addEmployee()
              break
          case 'Update Employee Role':
              updateRole()
              break
          case 'View All Roles':
              viewRoles()
              break
          case 'Add Role':
              addRole()
              break
          case 'View All Departments':
              viewDepartment()
              break
          case 'Add Department':
              addDepartment()
              break
          case 'Update Employee Manager':
              updateManager()
              break
          case 'View Employees by Manager':
              viewEmployeesByManager()
              break
          case 'View Employees by Department':
              viewEmployeesByDepartment()
              break
          case 'Delete Department':
              deleteDepartment()
              break
          case 'Delete Employee':
              deleteEmployee()
              break
          case 'Delete Role':
              deleteRole()
              break
          case 'Find Total Budget of Department':
              totalBudget()
              break
          case 'Quit':
            process.exit(1)
        }
    })
            // View all Employees
            function viewEmployees() {
              const query = `SELECT  
              employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title,  
              department_name,
              role.salary, 
              CONCAT(manager.first_name, ' ', manager.last_name) AS 
              manager FROM 
              employee 
              LEFT JOIN role ON 
              employee.role_id = role.id 
              LEFT JOIN department ON 
              role.department_id = department.id 
              LEFT JOIN employee manager ON 
              manager.id = employee.manager_id;`;
              connection.query(query, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu();
              });
            }
            // Add Employee 
            function addEmployee() {
                inquirer
                    .prompt([
                        {
                            name: "first_name",
                            message: "Enter employee first name:",
                            type: "input"
                        },
                        {
                            name: "last_name",
                            message: "Enter employee last name:",
                            type: "input"
                        },
                        {
                            name: "role_id",
                            message: "Enter role ID:",
                            type: "input",
                        },
                        {
                            name: "manager_id",
                            message: "Enter manager ID:",
                            type: "input",
                        }
                    ])
                    .then(function ({ first_name, last_name, role_id, manager_id }) {
                        con.query("INSERT INTO employee SET ?",
                            {
                                first_name: first_name,
                                last_name: last_name,
                                role_id: role_id,
                                manager_id: manager_id
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log(`Successfully added ${first_name} ${last_name} into employee table!`)
                                viewEmployees();
                                addEmployeePrompt();
                            }
                        )
                    })
            }
            // Update Role
            function updateRole() {
            const query = `SELECT first_name, last_name FROM employee;`;
                connection.query(query, (err, data) => {
                    const employee = data.map(
                        (item) => `${item.first_name} ${item.last_name}`
                    );
                    inquirer
                        .prompt([
                            {
                                name: "employee",
                                type: "list",
                                message: "Which Employee Would you Like to Update?",
                                choices: employee,
                              },
                        ])
                        .then((answer) => {
                            const selectedEmployee = answer.employee.split(" ");
                            const firstName = selectedEmployee[0];
                            const lastName = selectedEmployee[1];
                            const query = `SELECT title FROM role;`;
                            connection.query(query, (err, data) => {
                                const role = data.map((item) => item.title);
                                inquirer
                                .prompt({
                                    name: "role",
                                    type: "list",
                                    message: "What is the Employee's New Role?",
                                    choices: role,
                                })
                                .then((answer) => {
                                    const query = `SELECT id FROM role WHERE title = ?`;
                                    connection.query(query, [answer.role], (err, data) => {
                                    if (err) throw err;
                                    const roleId = data[0].id;
                                    const query = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;
                                    connection.query(
                                        query,
                                        [roleId, firstName, lastName],
                                        (err, data) => {
                                        if (err) throw err;
                                        console.log(
                                            `Successfully Updated ${firstName} ${lastName}'s Role to ${answer.role}.`
                                        );
                                        ViewAllEmployees();
                                    }
                                    );
                                  });
                                });
                            });
                          });
                      });
                    }
                }
            // View Role
            function viewRoles() {
                console.log("Viewing all roles...\n");
                con.query("SELECT * FROM employee_role", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    addEmployeePrompt();
                });
            }
            // Add Role
            function addRole() {
                inquirer
                    .prompt([
                        {
                            name: "title",
                            message: "Enter role title:",
                            type: "input"
                        },
                        {
                            name: "salary",
                            message: "Enter salary:",
                            type: "input"
                        },
                        {
                            name: "department_id",
                            message: "Enter department ID:",
                            type: "input"
                        }
                    ])
                    .then(function ({ title, salary, department_id }) {
                        con.query("INSERT INTO employee_role SET ?",
                            {
                                title: title,
                                salary: salary,
                                department_id: department_id,
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log(`Successfully added ${title} into role table!`)
                                viewRoles();
                                addEmployeePrompt();
                            })
                    })
                }
            // View Department
            function viewDepartment() {
                console.log("Viewing all departments...\n");
                con.query("SELECT * FROM department", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    addEmployeePrompt();
                });
            }
            // Add Department
            function addDepartment() {
                inquirer
                    .prompt([
                        {
                            name: "department_name",
                            message: "Enter department name:",
                            type: "input"
                        },
                    ])
                    .then(function ({ department_name }) {
                        con.query("INSERT INTO department SET ?",
                            {
                                name: department_name,
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log(`Successfully added ${department_name} into department table!`)
                                viewDepartment();
                                addEmployeePrompt();
                            })
                    })
            }
            // Update Manager
            function updateManager() {
                const query = `SELECT first_name, last_name FROM employee;`;
                connection.query(query, (err, data) => {
                const employee = data.map(
                  (item) => `${item.first_name} ${item.last_name}`
                );
                inquirer
                  .prompt([
                    {
                      name: "employee",
                      type: "list",
                      message: "Which employee would you like to update?",
                      choices: employee,
                    },
                  ])
                  .then((answer) => {
                    const selectedEmployee = answer.employee.split(" ");
                    const firstName = selectedEmployee[0];
                    const lastName = selectedEmployee[1];
                    const query = `SELECT 
                    first_name, last_name 
                    FROM employee 
                    WHERE manager_id IS NULL 
                    AND first_name != '${firstName}' 
                    AND last_name != '${lastName}';`;
                    connection.query(query, (err, data) => {
                      const managers = data.map(
                        (item) => `${item.first_name} ${item.last_name}`
                      );
                      inquirer
                        .prompt({
                          name: "manager",
                          type: "list",
                          message: "Who is the employee's new manager?",
                          choices: managers,
                        })
                        .then((answer) => {
                          const query = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
                          connection.query(query, [answer.manager.split(" ")[0], answer.manager.split(" ")[1]], (err, data) => {
                            if (err) throw err;
                            const managerId = data[0].id;
                            const query = `UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`;
                            connection.query(
                              query,
                              [managerId, firstName, lastName],
                              (err, data) => {
                                if (err) throw err;
                                console.log(
                                  `Successfully updated ${firstName} ${lastName}'s manager to ${answer.manager}.`
                                );
                                ViewAllEmployees();
                              }
                            );
                          });
                        });
                    }
                  );
                });
              });
              }
            // View Employees by Manager
            function viewEmployeesByManager() {
                const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY manager;`;
                
                connection.query(query, (err, data) => {
                    if (err) throw err;
                    userOptions()
                })
            }
            // View Employees by Department
            function viewEmployeesByDepartment() {
                inquirer
                    .prompt({
                        name: "department",
                        type: "list",
                        message: "Which department would you like to view?",
                        choices: [
                            "Sales",
                            "Engineering",
                            "Finance",
                            "Legal",
                        ]
                    })
            }
            // Delete Department
            function deleteDepartment() {
                connection.query("SELECT department_name FROM department", (err, data) => {
                  const department = data.map((item) => `${item.department_name}`);
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "name",
                        message: "Select the Department you wish to Remove",
                        choices: [...department],
                      },
                    ])
                    .then((data) => {
                      const { name } = data;
                      connection.query(
                        "SELECT * FROM department WHERE department_name = '" + name + "'",
                        (err, res) => {
                          if (err) throw err;
                          if (res.length === 0) {
                            console.log(`Department with name ${data.department_name} Does NOT Exist.`);
                          }
                          if (res.length !== 0) {
                            connection.query(
                              "DELETE FROM department WHERE department_name = '" + name + "'",
                              (err, res) => {
                                if (err) throw err;
                                if (res.affectedRows === 0) {
                                  console.log(
                                    `Department with department_name ${data.department_name} Does NOT Exist.`
                                  );
                                } else {
                                  console.table({
                                    message: `\n-------------------\n Department with Department Name ${data.department_name} Has Been Successfully Removed.\n`,
                                    affectedRows: res.affectedRows,
                                  });
                                  ViewAllDepartments();
                                }
                              }
                            );
                          }
                        }
                      );
                    });
                });
              }
            // Delete Employee
            function deleteEmployee() {
                const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON 
                employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
                
                connection.query(query, (err, data) => {
                    if (err) throw err;
                    const employee = data.map(
                        (item) => `${item.first_name} ${item.last_name}`
                    );
                })

                inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "employee",
                        message: "Select the Employee you wish to Remove",
                        choices: [...employee],
                      },
                    ])
                    .then((answer) => {
                      const query = `DELETE FROM employee WHERE first_name = ? AND last_name = ?`;
                      connection.query(
                        query,
                        [answer.employee.split(" ")[0], answer.employee.split(" ")[1]],
                        (err, data) => {
                            if (err) throw err;
                            console.log(
                                `You have removed ${answer.employee}`
                            );
                            ViewAllEmployees();
                        }
                      )
                });
              }
            // Delete Role
            function deleteRole() {
                connection.query("SELECT role.title FROM role", (err, data) => {
                  const role = data.map((item) => `${item.title}`);
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "title",
                        message: "Select the Role you wish to Remove",
                        choices: [...role],
                      },
                    ])
                    .then((data) => {
                      const { title } = data;
                      connection.query(
                        "SELECT * FROM role WHERE title = '" + title + "'",
                        (err, res) => {
                          if (err) throw err;
                          if (res.length === 0) {
                            console.log(`Role with Title ${data.title} Does NOT Exist.`);
                          }
                          if (res.length !== 0) {
                            connection.query(
                              "DELETE FROM role WHERE title = '" + title + "'",
                              (err, res) => {
                                if (err) throw err;
                                if (res.affectedRows === 0) {
                                  console.log(
                                    `Role with Title ${data.title} Does NOT Exist.`
                                  );
                                } else {
                                  console.table({
                                    message: `\n-------------------\n Role with Title ${data.title} Has Been Successfully Removed.\n`,
                                    affectedRows: res.affectedRows,
                                  });
                                  ViewAllRoles();
                                }
                              }
                            );
                          }
                        }
                      );
                    });
                });
              }
            
            // Total Budget
            function totalBudget() {
                const query = `select department.department_name AS department,
                  SUM(role.salary) AS utilized_budget from role
                  LEFT JOIN employees ON role.id = employees.role_id
                  LEFT JOIN department ON role.department_id = department.id
                  GROUP BY department_name;`;
                connection.query(query, (err, data) => {
                  if (err) throw err;
                  console.table(data);
                  mainMenu();
                });
              }
                
              // Options Menu:
              userOptions();