const inquirer = require ('inquirer');
const mysql = require('mysql');
const ctable = require('console.table');


require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'Redhead29',

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

console.log(greet);

function run(){
    
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

function viewEmployees() 
{
    connection.query
    ("SELECT employees.first_name, employees.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id GROUP BY employees.id",
    function(err, res) 
        {
        if (err) throw err;

        console.table(res);
        run();
        }
    );
}



function addEmployee() 
{
    console.log("Input info for new employee. \n");
    inquirer
        .prompt 
        ([
            {
                type: 'input',
                message: 'Enter First Name',
                name: 'first_name',
            },
            {
                type: 'input',
                message: 'Enter Last Name',
                name: 'last_name',
            },
            {
                type: 'list',
                message: 'Choose the employees role',
                name: 'role_id',
                choices: [1,2,3]
            },
            {
                type: 'input',
                message: 'Who is this employees manager?',
                name: 'manager_id'
            }
        ])
        .then (function(res)
        {
            connection.query
            (
                "INSERT INTO employees SET ?",
                res,
                    function(err, res) 
                    {
                        if (err) throw err;
                        console.log('Employee add succeeded!');

                        run();
                    }

            );
        })
}



function rmEmployee() 
{
    let employeelist = [];
    connection.query
    (
        'SELECT employees.first_name, employees.last_name FROM employees', (err, res) => 
        {
            for (let i=0; i< res.length; i++)
            {
                employeelist.push(res[i].first_name + " " + res[i].last_name);
            }
        inquirer
        .prompt 
        ([
            {
                type: 'list',
                message: 'Choose the employee to remove.',
                name: 'employee',
                choices: employeelist
            },
        ])
        .then (function(res)
        {
            connection.query
            (
                `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
                function (err, res) 
                {
                    if (err) throw err;
                    console.log('Employee Removed');
                    run();
                }
            );
        })
        }
    )
}



function viewDepartments() 
{
    connection.query ('SELECT * FROM departments', function(err, res)
    {
        console.table(res);
        run();
    })
}




function addDepartment() 
{
    inquirer
    .prompt
    ([
        {
            type: 'input',
            name: 'deptname',
            message: 'Enter the Department you would like to add.'
        }
    ])
    .then(function(res)
    {
        console.log(res);
        connection.query
        (
            'INSERT INTO departments SET ?',
            {
                name: res.deptname
            },
            function(err, res)
            {
                connection.query('SELECT * FROM departments', function(err, res)
                {
                    console.table(res);
                    run();
                })
            }
        )
    })
}



function viewRoles() 
{
    connection.query('SELECT roles.*, departments.name FROM roles LEFT JOIN departments on departments.id = roles.department_id', function (err, res)
    {
        if (err) throw err;
        console.table(res);
        run();
    })
}



function updEmployee() {
    connection.query('SELECT first_name, last_name, id FROM employees',
    function(err, res){
        let employees = res.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeName',
                message: 'Choose the employee you would like to update',
                choices: employees
            },
            {
                type: 'input',
                name: 'role',
                message: "What is the new role?"

            }
        ])
        .then (function(res){
            connection.query(`UPDATE employees SET role_id = ${res.role} WHERE id = ${res.employeeName}`,
            function(err, res){
                console.log(res);
                run();
            }
            );
        })
    })
}



function addRole() 
{
    let departments = [];
    connection.query('SELECT * FROM departments',
    function(err, res)
    {
        if (err) throw err;
        for (let i=0; i <res.length; i++)
        {
            res[i].first_name + " " + res[i].last_name
            departments.push({name: res[i].name, value: res[i].id});
        }
        inquirer
        .prompt
        ([
            {
                type: 'input',
                name: 'title',
                message: 'Please Enter the Role you would like to add.'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please Enter the Salary for this role.'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Please choose the Department for this role.',
                choices: departments
            }
        ])
        .then (function(res)
        {
            console.log(res);
            connection.query
            (
                'INSERT INTO roles SET ?',
                {
                    title: res.title,
                    salary: res.salary,
                    department_id: res.department
                },
                function (err, res){
                    if (err) throw err;
                    run();
                }
            )
        })
    })
}

