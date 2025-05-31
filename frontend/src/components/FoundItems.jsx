// /frontend/src/components/FoundItems.jsx
import React, { useState, useEffect, useRef } from 'react';
import API from '../api/api';

function FoundItems() {
  const [items, setItems] = useState([]);
  const [mine, setMine] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_found: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const fileInputRef = useRef(); // to access the file input

  useEffect(() => {
    fetchAll();
    fetchMine();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await API.get('/found');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMine = async () => {
    try {
      const res = await API.get('/found/mine');
      setMine(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    // Build FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date_found', formData.date_found);
    data.append('location', formData.location);

    // If user selected a file, append it
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      data.append('image', fileInputRef.current.files[0]);
    }

    try {
      // POST as multipart/form-data
      await API.post('/found', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form fields
      setFormData({ title: '', description: '', date_found: '', location: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refetch lists
      fetchAll();
      fetchMine();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item.');
    }
  };

  // Filter items by title or location
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="mt-4">Report Found Item</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAdd} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Item Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="date_found" className="form-label">
              Date Found
            </label>
            <input
              type="date"
              className="form-control"
              id="date_found"
              name="date_found"
              value={formData.date_found}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
              Upload Image (optional)
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              accept="image/*"
              ref={fileInputRef}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </div>
        </div>
      </form>

      <hr />

      <h3>All Found Items</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by title or location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {filteredItems.length === 0 ? (
        <p>No found items listed.</p>
      ) : (
        filteredItems.map((item) => (
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
              {item.image_path && (
                <div className="mb-2">
                  <img
                    src={`http://localhost:5000/${item.image_path}`}
                    alt="Found item"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <a href={`mailto:${item.finder_email}`} className="btn btn-outline-primary btn-sm">
                Contact Finder
              </a>
            </div>
          </div>
        ))
      )}

      <hr />

      <h3>My Found Items</h3>
      {mine.length === 0 ? (
        <p>You have not reported any found items yet.</p>
      ) : (
        mine.map((item) => (
          <div key={item.id} className="card item-card border-secondary">
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{item.description}</p>
              <p className="card-text">
                <small className="text-muted">
                  Found on: {new Date(item.date_found).toLocaleDateString()} | Location: {item.location}
                </small>
              </p>
              <p className="card-text">
                <small className="text-muted">Reported on: {new Date(item.date_reported).toLocaleString()}</small>
              </p>
              {item.image_path && (
                <div className="mb-2">
                  <img
                    src={`http://localhost:5000/${item.image_path}`}
                    alt="My found item"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FoundItems;
