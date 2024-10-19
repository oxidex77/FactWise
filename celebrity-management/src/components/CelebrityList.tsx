import React, { useState } from 'react';
import { Celebrity } from './types';
import CelebrityItem from './CelebrityItem';

interface CelebrityListProps {
  celebrities: Celebrity[];
  onEdit: (celebrity: Celebrity) => void;
  onDelete: (id: number) => void;
  editMode: number | null;
  toggleEditMode: (id: number | null) => void;
}

const CelebrityList: React.FC<CelebrityListProps> = ({ celebrities, onEdit, onDelete, editMode, toggleEditMode }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    if (editMode === null) {
      setOpenAccordion(openAccordion === id ? null : id);
    }
  };

  return (
    <div className="space-y-4">
      {celebrities.map(celebrity => (
        <CelebrityItem
          key={celebrity.id}
          celebrity={celebrity}
          onEdit={onEdit}
          onDelete={onDelete}
          isOpen={openAccordion === celebrity.id}
          toggleAccordion={() => toggleAccordion(celebrity.id)}
          isEditing={editMode === celebrity.id}
          toggleEditMode={toggleEditMode}
        />
      ))}
    </div>
  );
};

export default CelebrityList;