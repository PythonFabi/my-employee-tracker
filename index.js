const inquirer = require('inquirer');
const mysql = require('mysql');

const question = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'actions',
    choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
}

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Database146!',
        database: 'company_db'
    },
)

switch (this.choices) {
    case 'View all Employees':
        db.query("SELECT e.id, e.first_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ',m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id", 
        function (err, results) {
            if(err) {
                console.log(err);
            }
            console.log(results);
        });
        break;
    case 'Add Employee':
        break;
    case 'Update Employee Role':
        break;
    case 'View All Roles':
        db.query('SELECT r.id, r.title, d.name AS department, r.salary FROM department d JOIN role r ON d.id = r.department_id',
        function (err, results) {
            if(err) {
              console.log(err);
            } 
            console.log(results);
        });
        break;
    case 'Add Role':
        break;
    case 'View All Departments':
        db.query('SELECT * FROM department', function (err, results) {
            if(err) {
                console.log(err);
            }
            console.log(results);
        });
        break;
    case 'Add Department':
        db.query()
        break;
    case 'Quit':
        break;
}

 

// invoke inquirer in each choice
inquirer
.prompt