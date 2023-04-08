var Express = require('express');
var bodyParser = require('body-parser');

var app = Express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// if using express 4.16.0 or above, you can use the following code instead of the above two lines
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));


var cors = require('cors');
app.use(cors());

// This is the MySQL connection information for local development using MAMP on MacOS
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '8889', // for mac and using MAMP/MAMP's default port
  password: 'root',
  database: 'mytestdb',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock' // for mac and using MAMP
});

var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
app.use('/photos', Express.static(__dirname+'/photos'));


app.listen(49146, () => {
  connection.connect(function (err) {
    // if(err) throw err;
    if (err) {
      return console.log('error: ' + err.message);
    }
    console.log('Connected to MySQL server.');
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// To start the server, run the following command:
// node index.js
// To test the server, run the following command:
// curl http://localhost:49146
// To test in Postman, run the following command:
// http://localhost:49146
// Hello World!
// To test in browser, run the following command:
// http://localhost:49146

//API methods for the department table
// GET all departments
app.get('/api/department', (req, res) => {
  var query = `SELECT * FROM mytestdb.department`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for departments: ' + err);
    }
    res.send(rows);
  }
  )
});

// INSERT method to add a new department
app.post('/api/department', (req, res) => {
  var query = `INSERT into mytestdb.department
                (departmentName)
                VALUE (?)`;

  var values = [
    req.body['departmentName']
  ];

  connection.query(query, values, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for departments: ' + err);
    }
    res.json('Added successfully');
  }
  )
});

// PUT method to update a department
app.put('/api/department', (req, res) => {
  var query = `UPDATE mytestdb.department
               set departmentName = ? where departmentId = ?`;

  var values = [
    req.body['departmentName'],
    req.body['departmentId']
  ];

  connection.query(query, values, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for departments: ' + err);
    }
    res.json('Updated successfully');
  }
  )
});

// DELETE method to delete a department
app.delete('/api/department/:id', (req, res) => {
  var query = `DELETE from mytestdb.department
               where departmentId = ?`;

  var values = [
    parseInt(req.params.id)
  ];

  connection.query(query, values, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for departments: ' + err);
    }
    res.json('Deleted successfully');
  }
  )
});

//API methods for the employee table
// GET all employees
app.get('/api/employee', (req, res) => {
  var query = `SELECT * FROM mytestdb.employee`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for employees: ' + err);
    }
    res.send(rows);
  }
  )
});

// INSERT method to add a new employee
app.post('/api/employee', (req, res) => {
  var query = `INSERT into mytestdb.employee
                (employeeName, department, dateOfJoining, photoFilename)
                VALUE (?,?,?,?)`;

  var values = [
    req.body['employeeName'],
    req.body['department'],
    req.body['dateOfJoining'],
    req.body['photoFilename']
  ];

  connection.query(query, values, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for employees: ' + err);
    }
    res.json('Added successfully');
  }
  )
});

// PUT method to update an employee
app.put('/api/employee', (req, res) => {
  var query = `UPDATE mytestdb.employee
               set employeeName =?, 
               department =?,
               dateOfJoining =?,
               photoFilename =?  
               where employeeId = ?`;

  var values = [
    req.body['employeeName'],
    req.body['department'],
    req.body['dateOfJoining'],
    req.body['photoFilename'],
    req.body['employeeId'],
  ];

  connection.query(query, values, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for employees: ' + err);
    }
    res.json('Updated successfully');
  }
  )
});

// DELETE method to delete an employee
app.delete('/api/employee/:id', (req, res) => {
  var query = `DELETE from mytestdb.employee
               where employeeId = ?`;

  var values = [
    parseInt(req.params.id)
  ];

  connection.query(query, values, function (err, rows, fields) {
    if (err) {
      res.send('Failed to query for employees: ' + err);
    }
    res.json('Deleted successfully');
  }
  )
});


// API method to upload a photo
app.post('/api/employee/savefile',(req, res) => {

  fs.writeFile("./photos/"+req.files.file.name, req.files.file.data, function (err) {
    if (err) {
      return console.log(err);
    }

    res.json(req.files.file.name);
    console.log("The file was saved!");
  });
});
