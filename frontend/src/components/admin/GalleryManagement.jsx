import { useState, useEffect } from 'react';
import axios from 'axios';
import './GalleryManagement.css';

function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '', // Initialize as empty or a valid default lowercase category
    imageUrl: '',
    isActive: true
  });

  // This array is used for display in the dropdown.
  // Ensure it matches the categories you want to support.
  const categoriesForDisplay = [
    'Activities',
    'Facilities',
    'Events',
    'Residents',
    'Staff',
    'Dining',
    'Recreation',
    'Healthcare',
    'Celebrations',
    'General',
    'Other' // Added 'Other' to match model
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImage) {
        await axios.put(`http://localhost:5000/api/gallery/${editingImage._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/gallery', formData);
      }
      
      fetchImages();
      resetForm();
      setShowAddModal(false);
      setEditingImage(null);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image. Please try again.');
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      category: image.category, // Assuming image.category from DB is already lowercase
      imageUrl: image.imageUrl,
      isActive: image.isActive
    });
    setShowAddModal(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`http://localhost:5000/api/gallery/${id}`);
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image. Please try again.');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/gallery/${id}`, {
        isActive: !currentStatus
      });
      fetchImages();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '', // Reset to empty or a default lowercase category
      imageUrl: '',
      isActive: true
    });
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-management-container"> {/* Changed class for main container */}
      <div className="gallery-header"> {/* Changed class */}
        <h2>Gallery Management</h2>
        <button 
          className="btn primary-btn add-image-btn" // Added specific class
          onClick={() => {
            resetForm();
            setEditingImage(null);
            setShowAddModal(true);
          }}
        >
          Add New Image
        </button>
      </div>

      <div className="gallery-stats">
        <div className="stat-card">
          <h3>{images.length}</h3>
          <p>Total Images</p>
        </div>
        <div className="stat-card">
          <h3>{images.filter(img => img.isActive).length}</h3>
          <p>Active Images</p>
        </div>
        <div className="stat-card">
          <h3>{categoriesForDisplay.length}</h3>
          <p>Categories</p>
        </div>
      </div>

      <div className="gallery-grid">
        {images.map(image => (
          <div key={image._id} className={`gallery-item ${!image.isActive ? 'inactive' : ''}`}>
            <div className="image-container">
              <img src={image.imageUrl} alt={image.title} />
              <div className="image-overlay">
                <button 
                  className="btn edit-btn"
                  onClick={() => handleEdit(image)}
                >
                  Edit
                </button>
                <button 
                  className="btn delete-btn"
                  onClick={() => handleDelete(image._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="image-info">
              <h4>{image.title}</h4>
              <p className="category">{image.category}</p>
              <p className="description">{image.description}</p>
              <div className="image-actions">
                <button 
                  className={`btn ${image.isActive ? 'deactivate-btn' : 'activate-btn'}`}
                  onClick={() => toggleStatus(image._id, image.isActive)}
                >
                  {image.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          {/* Use modal-content and gallery-modal for better CSS targeting */}
          <div className="modal-content gallery-modal"> 
            <div className="modal-header">
              <h3>{editingImage ? 'Edit Image' : 'Add New Image'}</h3>
              <button 
                className="close-btn" // Use 'close-btn' if styled in admin.css
                onClick={() => {
                  setShowAddModal(false);
                  setEditingImage(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {/* Use categoriesForDisplay for labels, and lowercase for values */}
                  {categoriesForDisplay.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn secondary-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary-btn">
                  {editingImage ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryManagement;