const inquirer = require('inquirer');
const mysql = require('mysql');

const question = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'actions',
    choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
}


switch (this.choices) {
    case 'View all Employees':
}

 

// invoke inquirer in each choice
inquirer
.prompt