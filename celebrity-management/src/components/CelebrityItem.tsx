import React, { useState, useEffect } from 'react';
import { Celebrity } from './types';
import { Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

interface CelebrityItemProps {
  celebrity: Celebrity;
  onEdit: (celebrity: Celebrity) => void;
  onDelete: (id: number) => void;
  isOpen: boolean;
  toggleAccordion: () => void;
  isEditing: boolean;
  toggleEditMode: (id: number | null) => void;
}

const DeleteDialog = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Delete Celebrity</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this celebrity? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CelebrityItem: React.FC<CelebrityItemProps> = ({ 
  celebrity, 
  onEdit, 
  onDelete, 
  isOpen, 
  toggleAccordion, 
  isEditing, 
  toggleEditMode 
}) => {
  const [editedCelebrity, setEditedCelebrity] = useState(celebrity);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showAgeTooltip, setShowAgeTooltip] = useState(false);

  useEffect(() => {
    setEditedCelebrity(celebrity);
    setIsChanged(false);
  }, [celebrity, isEditing]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(celebrity.dob);
  const isEditable = age > 20; // Changed from isAdult to age > 20

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'age') {
      if (!/^\d*$/.test(value)) return;
      const currentDate = new Date();
      const newYear = currentDate.getFullYear() - parseInt(value, 10);
      const newDob = new Date(newYear, currentDate.getMonth(), currentDate.getDate());
      if (!isNaN(newDob.getTime())) {
        setEditedCelebrity(prev => ({ ...prev, dob: newDob.toISOString().split('T')[0] }));
      }
    } else if (name === 'country') {
      if (/\d/.test(value)) return;
      setEditedCelebrity(prev => ({ ...prev, [name]: value }));
    } else {
      setEditedCelebrity(prev => ({ ...prev, [name]: value }));
    }
    
    setIsChanged(true);
  };

  const handleSave = () => {
    if (!isEditable) {
      return;
    }
    if (Object.values(editedCelebrity).some(value => value === '')) {
      alert('All fields must be filled.');
      return;
    }
    onEdit(editedCelebrity);
    toggleEditMode(null);
  };

  const handleCancel = () => {
    setEditedCelebrity(celebrity);
    toggleEditMode(null);
  };

  const handleDelete = () => {
    onDelete(celebrity.id);
    setIsDeleteDialogOpen(false);
  };

  const handleAccordionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleAccordion();
  };

  const handleEditClick = () => {
    if (!isEditable) {
      setShowAgeTooltip(true);
      setTimeout(() => setShowAgeTooltip(false), 3000);
      return;
    }
    toggleEditMode(celebrity.id);
  };

  return (
    <div className="border p-4 mb-4 rounded-lg shadow-md bg-white">
      <div className="flex flex-col sm:flex-row items-center">
        <img src={celebrity.picture} alt={`${celebrity.first} ${celebrity.last}`} className="w-16 h-16 rounded-full mb-2 sm:mb-0 sm:mr-4" />
        <h2 className="text-xl font-bold text-center sm:text-left">{`${celebrity.first} ${celebrity.last}`}</h2>
        <button
          onClick={handleAccordionToggle}
          className="text-2xl mt-2 sm:mt-0 sm:ml-auto focus:outline-none"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4">
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="first"
                value={editedCelebrity.first}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
                placeholder="First Name"
              />
              <input
                type="text"
                name="last"
                value={editedCelebrity.last}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
                placeholder="Last Name"
              />
              <input
                type="number"
                name="age"
                value={calculateAge(editedCelebrity.dob)}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
                placeholder="Age"
              />
              <select
                name="gender"
                value={editedCelebrity.gender}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
                <option value="rather_not_say">Rather not say</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="country"
                value={editedCelebrity.country}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
                placeholder="Country"
              />
              <input
                type="email"
                name="email"
                value={editedCelebrity.email}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
                placeholder="Email"
              />
              <textarea
                name="description"
                value={editedCelebrity.description}
                onChange={handleChange}
                className="p-2 border rounded w-full col-span-1 sm:col-span-2"
                required
                placeholder="Description"
                rows={3}
              />
              <div className="col-span-1 sm:col-span-2 flex justify-end space-x-2">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded ${isChanged ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={!isChanged}
                >
                  <Check size={20} />
                </button>
                <button onClick={handleCancel} className="p-2 rounded bg-red-500 text-white">
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Age:</strong> {age} Years</p>
              <p><strong>Gender:</strong> {celebrity.gender}</p>
              <p><strong>Email:</strong> {celebrity.email}</p>
              <p><strong>Country:</strong> {celebrity.country}</p>
              <p className="col-span-1 sm:col-span-2"><strong>Description:</strong> {celebrity.description}</p>
              <div className="col-span-1 sm:col-span-2 flex justify-end space-x-2">
                <div className="relative">
                  <button
                    onClick={handleEditClick}
                    className={`p-2 rounded hover:bg-gray-100 ${!isEditable && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <Edit2 size={20} className="text-blue-500" />
                  </button>
                  {showAgeTooltip && !isEditable && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>Only celebrities above 20 years can be edited</span>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsDeleteDialogOpen(true)} 
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <Trash2 size={20} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CelebrityItem;