const inquirer = require('inquirer');
const mysql = require('mysql2');



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Database146!',
        database: 'company_db'
    },
)

const question = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'action',
    choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Update Manager of Employee', 'View Employees by Manager', 'View Employees by Department', 'Quit']
}


function viewAllEmployees() {
    db.query("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ',m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id",
        function (err, results) {
            if (err) {
                console.log(err);
            }
            console.table(results);
            employeeManager();
        });
}

function addEmployee() {
    db.query('SELECT title FROM role', function (err, roleResults) {
        if (err) {
            console.log(err);
            return;
        }

        const roleTitles = roleResults.map((row) => row.title);

        db.query('SELECT CONCAT(first_name, " ", last_name) AS managerName FROM employee', function (err, managerResults) {
            if (err) {
                console.log(err);
                return;
            }

            const managerNames = managerResults.map((row) => row.managerName);


            inquirer.prompt([{
                type: 'input',
                message: "What is the employee's first name?",
                name: 'fName'
            }, {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lName'
            }, {
                type: 'list',
                message: "What is the employee's role?",
                name: 'employeeRole',
                choices: roleTitles
            }, {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'employeeManager',
                choices: managerNames
            }])
                .then((answers) => {
                    const firstName = answers.fName;
                    const lastName = answers.lName;
                    const roleTitle = answers.employeeRole;
                    const managerName = answers.employeeManager;

                    db.query(`SELECT id FROM role WHERE title = '${roleTitle}'`, function (err, roleResult) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        const roleId = roleResult[0].id;

                        db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = '${managerName}'`, function (err, managerResult) {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            const managerId = managerResult[0].id;

                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${roleId}, ${managerId})`, function (err, results) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(`Added ${firstName} ${lastName} to the database`);
                                }
                                employeeManager();
                            });
                        });
                    });
                });
        });
    });

}

function updateEmployeeRole() {
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS employeeName FROM employee', function (err, employeeResults) {
        if (err) {
            console.log(err);
            return;
        }

        const employeeChoices = employeeResults.map((row) => {
            return {
                name: row.employeeName,
                value: row.id
            };
        });

        db.query('SELECT id, title FROM role', function (err, roleResults) {
            if (err) {
                console.log(err);
                return;
            }

            const roleChoices = roleResults.map((row) => {
                return {
                    name: row.title,
                    value: row.id
                };
            });


            inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's role do you want to update?",
                    name: 'selectedEmployee',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    message: 'Which role do you want to assign the selected employee?',
                    name: 'newRoleId',
                    choices: roleChoices
                }
            ])
                .then((answers) => {
                    const selectedEmployeeId = answers.selectedEmployee;
                    const newRoleId = answers.newRoleId;



                    db.query(`UPDATE employee SET role_id = ${newRoleId} WHERE id = ${selectedEmployeeId}`, function (err, updateResult) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Updated employee's role");
                        }
                        employeeManager();
                    });
                });
        });
    });
}

function viewAllRoles() {
    db.query('SELECT r.id, r.title, d.name AS department, r.salary FROM department d JOIN role r ON d.id = r.department_id',
        function (err, results) {
            if (err) {
                console.log(err);
            }
            console.table(results);
            employeeManager()
        });
}

function addRole() {
    db.query('SELECT name FROM department', function (err, results) {
        if (err) {
            console.log(err);
            return;
        }

        const departmentChoices = results.map((row) => row.name);

        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the role?',
            name: 'roleName'
        }, {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary'
        }, {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'departmentChoice',
            choices: departmentChoices
        }])
            .then((answers) => {
                const roleName = answers.roleName;
                const salary = answers.salary;
                const department = answers.departmentChoice;

                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${roleName}', '${salary}',(SELECT id FROM department WHERE name = '${department}'))`, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Added ${roleName} to the database`);
                    }
                    employeeManager();
                })
            });
    });
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        employeeManager();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'departmentName'
    }).then((answers) => {
        const newDepartment = answers.departmentName;
        db.query(`INSERT INTO department (name) VALUES ('${newDepartment}')`, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Added ${newDepartment} to the database`);
            }
            employeeManager();
        });
    });
}

function updateEmployeeManager() {
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS employeeName FROM employee', function (err, employeeResults) {
        if (err) {
            console.log(err);
            return;
        }

        const employeeChoices = employeeResults.map((row) => {
            return {
                name: row.employeeName, 
                value: row.id
            };
        });

        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's manager do you want to update?",
                name: 'selectedEmployee',
                choices: employeeChoices
            }, 
            {
                type: 'list',
                message: "Which new manager would you like to choose for the employee?",
                name: 'newManagerId',
                choices: employeeChoices
            }
        ])
          .then((answers) => {
            const selectedEmployeeId = answers.selectedEmployee;
            const newManagerId = answers.newManagerId;

            db.query(`UPDATE employee SET manager_id = ${newManagerId} WHERE id = ${selectedEmployeeId}`, function (err, updateResult) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Updated employee's manager`);
                }

                employeeManager();
            });
          });
    });
}

function viewEmployeesByManager() {
    db.query('SELECT DISTINCT m.id, CONCAT(m.first_name, " ", m.last_name) AS managerName FROM employee e JOIN employee m ON e.manager_id = m.id', function (err, managerResults) {
        if(err) {
            console.log(err);
            return;
        }

        const managerChoices = managerResults.map((row) => {
            return {
                name: row.managerName,
                value: row.id
            };
        });

        inquirer.prompt([
            {
                type:'list',
                message: 'Which manager would you like to view the employees from?',
                name: 'selectedManager',
                choices: managerChoices
            }
        ])
          .then((answers) => {
            const selectedManagerId = answers.selectedManager;

            db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE e.manager_id = ${selectedManagerId}`, function (err, results) {
                if(err) {
                    console.log(err);
                } 
                console.table(results);
                employeeManager();
            });
          })
    })
}

function viewEmployeesByDepartment() {
    db.query('SELECT * FROM department', function (err, departmentResults) {
        if (err) {
            console.log(err);
            return;
        }

        const departmentChoices = departmentResults.map((row) => {
            return {
                name: row.name,
                value: row.id
            };
        });

        inquirer.prompt([
            {
                type: 'list',
                message: "Which department would you like to see its employees from?",
                name: 'selectedDepartment',
                choices: departmentChoices
            }
        ])
          .then((answers) => {
            const selectedDepartmentId = answers.selectedDepartment;

            db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE d.id = ${selectedDepartmentId}`, function (err, results) {
                if(err) {
                    console.log(err);
                }
                console.table(results);
                employeeManager();
            });
          });
    });
}

function employeeManager() {
    inquirer.prompt(question)
        .then((answers) => {
            switch (answers.action) {
                case 'View all Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Manager of Employee':
                    updateEmployeeManager();
                    break;
                case 'View Employees by Manager':
                    viewEmployeesByManager();
                    break;
                case 'View Employees by Department':
                    viewEmployeesByDepartment();
                    break;
                case 'Quit':
                    console.log('Exiting the employee manager...see you next time!');
                    process.exit();
                    break;
            }
        });
}




// invoke inquirer in each choice 
employeeManager();