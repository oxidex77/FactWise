import React, { useState, useEffect } from 'react';
import { Celebrity } from './components/types';
import { fetchCelebrities } from './api/api';
import CelebrityList from './components/CelebrityList';
import SearchBar from './components/SearchBar';

const App: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState<Celebrity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState<number | null>(null);

  useEffect(() => {
    const loadCelebrities = async () => {
      try {
        const data = await fetchCelebrities();
        setCelebrities(data);
        setFilteredCelebrities(data);
      } catch (error) {
        console.error('Error fetching celebrities:', error);
      }
    };
    loadCelebrities();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = celebrities.filter(celebrity =>
      `${celebrity.first} ${celebrity.last}`.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCelebrities(filtered);
  };

  const handleEdit = (updatedCelebrity: Celebrity) => {
    const updatedCelebrities = celebrities.map(celebrity =>
      celebrity.id === updatedCelebrity.id ? updatedCelebrity : celebrity
    );
    setCelebrities(updatedCelebrities);
    setFilteredCelebrities(updatedCelebrities.filter(celebrity =>
      `${celebrity.first} ${celebrity.last}`.toLowerCase().includes(searchTerm.toLowerCase())
    ));
    setEditMode(null);
  };

  const handleDelete = (id: number) => {
    const updatedCelebrities = celebrities.filter(celebrity => celebrity.id !== id);
    setCelebrities(updatedCelebrities);
    setFilteredCelebrities(updatedCelebrities.filter(celebrity =>
      `${celebrity.first} ${celebrity.last}`.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  const toggleEditMode = (id: number | null) => {
    if (editMode === null || id === null) {
      setEditMode(id);
    }
  };

    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">FactWise Assessment</h1>
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} />
          <CelebrityList
            celebrities={filteredCelebrities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
          />
        </div>
      </div>
    );
  };

export default App;