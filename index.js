const inquirer = require('inquirer');
const mysql = require('mysql');



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
    name: 'actions',
    choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
}


function viewAllEmployees() {
    db.query("SELECT e.id, e.first_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ',m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id", 
    function (err, results) {
        if(err) {
            console.log(err);
        }
        console.log(results);
     employeeManager();
    });
}

function viewAllRoles() {
    db.query('SELECT r.id, r.title, d.name AS department, r.salary FROM department d JOIN role r ON d.id = r.department_id',
    function (err, results) {
        if(err) {
          console.log(err);
        } 
        console.log(results);
     employeeManager()
    });
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if(err) {
            console.log(err);
        }
        console.log(results);
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
            if(err) {
                console.log(err);
            } else {
                console.log(`Added ${newDepartment} to the database`);
            }
         employeeManager();
        });
    });
 

}

function employeeManager(){
    inquirer.prompt(question)
    .then((answers) => {
    switch (answers) {
        case 'View all Employees':
            viewAllEmployees();
            break;
        case 'Add Employee':
            break;
        case 'Update Employee Role':
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'Add Role':
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Quit':
            break;
    }
});
}


 

// invoke inquirer in each choice employeeManager();