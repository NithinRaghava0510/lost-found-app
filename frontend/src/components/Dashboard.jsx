// /frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { isAdmin } from '../utils/auth';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
      fetchLost();
      fetchFound();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLost = async () => {
    try {
      const res = await API.get('/admin/lost');
      setLostItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFound = async () => {
    try {
      const res = await API.get('/admin/found');
      setFoundItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Admin Dashboard</h2>
      {!isAdmin() && <p className="text-danger">Access denied. Admins only.</p>}

      {isAdmin() && (
        <>
          <section className="mt-4">
            <h3>All Users</h3>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>College ID</th>
                    <th>Email</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.college_id}</td>
                      <td>{u.email}</td>
                      <td>{u.is_admin ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="mt-4">
            <h3>All Lost Items</h3>
            {lostItems.length === 0 ? (
              <p>No lost items reported.</p>
            ) : (
              lostItems.map((item) => (
                <div key={item.id} className="card item-card">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Date Lost: {new Date(item.date_lost).toLocaleDateString()} | Location: {item.location}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Reported on: {new Date(item.date_reported).toLocaleString()}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Reporter: {item.reporter_email}</small>
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="mt-4">
            <h3>All Found Items</h3>
            {foundItems.length === 0 ? (
              <p>No found items reported.</p>
            ) : (
              foundItems.map((item) => (
                <div key={item.id} className="card item-card">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Date Found: {new Date(item.date_found).toLocaleDateString()} | Location: {item.location}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Reported on: {new Date(item.date_reported).toLocaleString()}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Finder: {item.finder_email}</small>
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
