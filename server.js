const inquirer = require ('inquirer');
const mysql = require('mysql');
const ctable = require('console.table');

require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: process.env.DB_PW,

    database: 'employee_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    run();
});

const greet = 
`
  ╭━━━╮╱╱╱╱╱╭╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭━━━━╮╱╱╱╱╱╱╭╮
  ┃╭━━╯╱╱╱╱╱┃┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃╭╮╭╮┃╱╱╱╱╱╱┃┃
  ┃╰━━┳╮╭┳━━┫┃╭━━┳╮╱╭┳━━┳━━╮╰╯┃┃┣┻┳━━┳━━┫┃╭┳━━┳━╮
  ┃╭━━┫╰╯┃╭╮┃┃┃╭╮┃┃╱┃┃┃━┫┃━┫╱╱┃┃┃╭┫╭╮┃╭━┫╰╯┫┃━┫╭╯
  ┃╰━━┫┃┃┃╰╯┃╰┫╰╯┃╰━╯┃┃━┫┃━┫╱╱┃┃┃┃┃╭╮┃╰━┫╭╮┫┃━┫┃
  ╰━━━┻┻┻┫╭━┻━┻━━┻━╮╭┻━━┻━━╯╱╱╰╯╰╯╰╯╰┻━━┻╯╰┻━━┻╯
  ╱╱╱╱╱╱╱┃┃╱╱╱╱╱╱╭━╯┃
  ╱╱╱╱╱╱╱╰╯╱╱╱╱╱╱╰━━╯ `;

function run(){
    console.log(greet);
    inquirer
    .prompt ([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'run',
            choices: 
            [
                'View All Employees',
                'Add Employee',
                'Remove Employee',
                'View all Departments',
                'Add Department',
                'View all Roles',
                'Update Employee Role',
                'Add Roles',
                'Exit'
            ]
        }
    ])
    .then (function(res){
        switch (res.run){

            case 'View All Employees':
            viewEmployees();
            break;

            case 'Add Employee':
            addEmployee();
            break;

            case 'Remove Employee':
            rmEmployee();
            break;

            
            case 'View all Departments':
            viewDepartments();
            break;

            case 'Add Department':
            addDepartment();
            break;

            case 'View all Roles':
            viewRoles();
            break;

            case 'Update Employee Role':
            updEmployee();
            break;

            case 'Add Roles':
            addRole();
            break;

            case 'Exit':
            connection.end();
            break;
        }
    })
}