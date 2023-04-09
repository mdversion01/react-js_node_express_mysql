import React, { useState, useEffect } from 'react';
import { endpoints } from './Endpoints';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';

const Employee = () => {

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  // const [modalTitle, setModalTitle] = useState('');
  // const [departmentId, setDepartmentId] = useState(0);
  // const [departmentName, setDepartmentName] = useState('');
  const [employeeInfo, setEmployeeInfo] = useState({
    modalTitle: '',
    employeeId: 0,
    employeeName: '',
    department: '',
    dateOfJoining: '',
    photoFilename: '',
    // photoPath: endpoints.PHOTO_URL
  });

  const [photoPath, setPhotoPath] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setPhotoPath(endpoints.PHOTO_URL);
  }, []);


  const formatDoJ = (date) => {
    return moment(date).format('YYYY-MM-DD');
  }

  const refreshList = () => {
    fetch(endpoints.API_URL + 'employee')
      .then(response => response.json())
      .then(data => {
        setEmployees(data);
      });

    fetch(endpoints.API_URL + 'department')
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
      });
  }

  useEffect(() => {
    refreshList();
  }, []);

  const changeEmployeeName = (e) => {
    setEmployeeInfo({
      ...employeeInfo,
      employeeName: e.target.value
    });
  }

  const changeDepartment = (e) => {
    setEmployeeInfo({
      ...employeeInfo,
      department: e.target.value
    });
  }

  const changeDateOfJoining = (e) => {
    setEmployeeInfo({
      ...employeeInfo,
      dateOfJoining: e.target.value
    });
  }

  const addClick = () => {
    handleShow();
    setEmployeeInfo({
      modalTitle: 'Add Employee',
      employeeId: 0,
      employeeName: '',
      department: '',
      dateOfJoining: '',
      photoFilename: 'anonymous.png'
    });
  }

  const editClick = (emp) => {
    handleShow();
    setEmployeeInfo({
      modalTitle: 'Edit Employee',
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      department: emp.department,
      dateOfJoining: emp.dateOfJoining,
      photoFilename: emp.photoFilename
    });
  }

  const createClick = () => {
    fetch(endpoints.API_URL + 'employee', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employeeName: employeeInfo.employeeName,
        department: employeeInfo.department,
        dateOfJoining: employeeInfo.dateOfJoining,
        photoFilename: employeeInfo.photoFilename
      })
    })
      .then(res => res.json())
      .then((result) => {
        alert(result);
        refreshList();
      }, (error) => {
        alert('Failed');
      })
  }

  const updateClick = () => {
    fetch(endpoints.API_URL + 'employee', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employeeId: employeeInfo.employeeId,
        employeeName: employeeInfo.employeeName,
        department: employeeInfo.department,
        dateOfJoining: employeeInfo.dateOfJoining,
        photoFilename: employeeInfo.photoFilename
      })
    })
      .then(res => res.json())
      .then((result) => {
        alert(result);
        refreshList();
      }, (error) => {
        alert('Failed');
      })
  }

  const deleteClick = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(endpoints.API_URL + 'employee/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then((result) => {
          alert(result);
          refreshList();
        }, (error) => {
          alert('Failed');
        })
    }
  }

  const imageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);
    console.log(e.target.files[0].name)

    fetch(endpoints.API_URL + 'employee/savefile', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setEmployeeInfo({
          ...employeeInfo,
          photoFilename: data
        });
        // setPhotoPath(endpoints.PHOTO_URL + data);
      }, (error) => {
        alert('Failed');
      })
  }

  return (
    <div>
      <h3>Employees</h3>

      <button
        type="button"
        className="btn btn-primary m-2 float-end"
        onClick={addClick}
      >
        Add Department
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeId}>
              <td>{emp.employeeId}</td>
              <td>{emp.employeeName}</td>
              <td>{emp.department}</td>
              <td>{formatDoJ(emp.dateOfJoining)}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-light m-1"
                  onClick={() => editClick(emp)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                  </svg>
                </button>
                <button className="btn btn-light" onClick={() => deleteClick(emp.employeeId)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{employeeInfo.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-grow bd-highlight mb-3">

            <div className="p-2 w-50 bd-highlight">
              <div className="input-group mb-3">
                <span className="input-group-text">Employee Name</span>
                <input type="text" className="form-control" value={employeeInfo.employeeName} onChange={changeEmployeeName} />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Department</span>
                <select
                  className="form-select"
                  value={employeeInfo.department}
                  onChange={changeDepartment}
                >
                  {departments.map((dep) => (
                    <option key={dep.departmentId}>
                      {dep.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Date of Joining</span>
                <input
                  type="date"
                  className="form-control"
                  value={formatDoJ(employeeInfo.dateOfJoining)}
                  onChange={changeDateOfJoining}
                />
              </div>


            </div>
            <div className="p-2 w-50 bd-highlight">
              <img
                width="250px"
                height="250px"
                src={photoPath + '' ? photoPath + employeeInfo.photoFilename : 'noPhoto.jpg'}
                alt={employeeInfo.photoFilename}
              />

              <input className="m-2" type="file" onChange={imageUpload} />

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {employeeInfo.employeeId === 0 ?
            <Button variant="primary" onClick={createClick}>
              Add Employee
            </Button>
            : null}

          {employeeInfo.employeeId !== 0 ?
            <Button variant="primary" onClick={updateClick}>
              Update Employee
            </Button>
            : null}
        </Modal.Footer>
      </Modal>

      {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{employeeInfo.modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-grow bd-highlight mb-3">

                <div className="p-2 w-50 bd-highlight">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Employee Name</span>
                    <input type="text" className="form-control" value={employeeInfo.employeeName} onChange={changeEmployeeName} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Department</span>
                    <select
                      className="form-select"
                      value={employeeInfo.department}
                      onChange={changeDepartment}
                    >
                      {departments.map((dep) => (
                        <option key={dep.departmentId}>
                          {dep.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Date of Joining</span>
                    <input
                      type="date"
                      className="form-control"
                      value={formatDoJ(employeeInfo.dateOfJoining)}
                      onChange={changeDateOfJoining}
                    />
                  </div>


                </div>
                <div className="p-2 w-50 bd-highlight">
                  <img
                    width="250px"
                    height="250px"
                    src={photoPath + '' ? photoPath + employeeInfo.photoFilename : 'noPhoto.jpg'}
                    alt={employeeInfo.photoFilename}
                  />

                  <input className="m-2" type="file" onChange={imageUpload} />

                </div>
              </div>
              {employeeInfo.employeeId === 0 ?
                <button type="button" className="btn btn-primary" onClick={createClick}>Add Employee</button>
                : null}

              {employeeInfo.employeeId !== 0 ?
                <button type="button" className="btn btn-primary" onClick={updateClick}>Update Employee</button>
                : null}

            </div>
          </div>
        </div>
      </div> */}
    </div>
  )

};

export default Employee;
