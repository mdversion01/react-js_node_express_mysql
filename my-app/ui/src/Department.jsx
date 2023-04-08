import React, { useState, useEffect } from 'react';
import { endpoints } from './Endpoints';

const Department = () => {

  const [departments, setDepartments] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [deptId, setDeptId] = useState(0);
  const [deptName, setDeptName] = useState('');
  const [departmentIdFilter, setDepartmentIdFilter] = useState('');
  const [departmentNameFilter, setDepartmentNameFilter] = useState('');
  const [departmentsWithoutFilter, setDepartmentsWithoutFilter] = useState([]);
  
  // Filtering
  const changeDepartmentIdFilter = (e) => {
    setDepartmentIdFilter(e.target.value);
    clearDeptNameFilter();
  }

  const changeDepartmentNameFilter = (e) => {
    setDepartmentNameFilter(e.target.value);
    clearDeptIdFilter();
  }

  useEffect(() => {
    const filteredData = departmentsWithoutFilter.filter(el =>
      el.departmentId.toString().toLowerCase().includes(
        departmentIdFilter.toString().trim().toLowerCase()
      ) &&
      el.departmentName.toString().toLowerCase().includes(
        departmentNameFilter.toString().trim().toLowerCase()
      )
    );

    setDepartments(filteredData);

  }, [departmentIdFilter, departmentNameFilter, departmentsWithoutFilter]);

  // Sorting
  const sortResult = (prop, asc) => {
    const sortData = [...departmentsWithoutFilter].sort(function (a, b) {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      }
      else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });

    setDepartments(sortData);
    clearFilters();
    
  }

  const refreshList = () => {
    fetch(endpoints.API_URL + 'department')
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
        setDepartmentsWithoutFilter(data);
      });
  }

  useEffect(() => {
    refreshList();
    
  }, []);

  const clearFilters = () => {
    setDepartmentIdFilter('');
    setDepartmentNameFilter('');
  }

  const clearDeptIdFilter = () => { setDepartmentIdFilter(''); }
  const clearDeptNameFilter = () => { setDepartmentNameFilter(''); }

  useEffect(() => {
    clearFilters();
    clearDeptIdFilter();
    clearDeptNameFilter();
  }, []);

  const changeDepartmentName = (e) => {
    setDeptName(e.target.value);
  }

  const addClick = () => {
    setModalTitle('Add Department');
    setDeptId(0);
    setDeptName('');
  }

  const editClick = (dept) => {
    setModalTitle('Edit Department');
    setDeptId(dept.departmentId);
    setDeptName(dept.departmentName);
  }

  const createClick = () => {
    fetch(endpoints.API_URL + 'department', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        departmentName: deptName
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
    fetch(endpoints.API_URL + 'department', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        departmentId: deptId,
        departmentName: deptName
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
      fetch(endpoints.API_URL + 'department/' + id, {
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


  return (
    <div>
      <h3>Departments</h3>

      <div className="d-flex" style={{ alignItems: "center", width: "100%" }}>
        <div className="form-group m-2" style={{ width: "100%" }}>
          <input
            className="form-control m-2"
            onChange={changeDepartmentIdFilter}
            placeholder="Filter By ID"
            type="text"
            value={departmentIdFilter}
          />
        </div>
        <div className="form-group m-2" style={{ width: "100%" }}>
          <input
            className="form-control m-2"
            onChange={changeDepartmentNameFilter}
            placeholder="Filter By Name"
            type="text"
            value={departmentNameFilter}
          />
        </div>
        <div className="form-group m-2" style={{ width: "100%" }}>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={clearFilters}
            >Clear Filter</button>
        </div>
        <div style={{ width: "100%" }}>
          <button
            type="button"
            className="btn btn-primary m-2 float-end"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={addClick}
          >
            Add Department
          </button>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <div className="d-flex" style={{ alignItems: "center", width: "100%" }}>
                <div>Department ID</div>
                <div>
                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => sortResult('departmentId', true)}
                    style={{ padding: "0px", margin: "0px 0px 0px 5px" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => sortResult('departmentId', false)}
                    style={{ padding: "0px", margin: "0px" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </th>
            <th>
            <div className="d-flex" style={{ alignItems: "center", width: "100%" }}>
                <div>Department Name</div>
                <div>
                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => sortResult('departmentName', true)}
                    style={{ padding: "0px", margin: "0px 0px 0px 5px" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-light"
                    onClick={() => sortResult('departmentName', false)}
                    style={{ padding: "0px", margin: "0px" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.departmentId}>
              <td>
                {dept.departmentId}
              </td>
              <td>
                {dept.departmentName}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-light m-1"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => editClick(dept)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                  </svg>
                </button>
                <button className="btn btn-light" onClick={() => deleteClick(dept.departmentId)}>
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

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">Department Name</span>
                <input type="text" className="form-control" value={deptName} onChange={changeDepartmentName} />
              </div>

              {deptId === 0 ?
                <button type="button" className="btn btn-primary" onClick={createClick}>Create Department</button>
                : null}

              {deptId !== 0 ?
                <button type="button" className="btn btn-primary" onClick={updateClick}>Update Department</button>
                : null}

            </div>
          </div>
        </div>
      </div>
    </div>
  )

};

export default Department;
