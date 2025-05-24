import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import TableActionModal from '../components/TableActionModal';
import "../css/actioncell.css";

const ActionCell = ({
  rowIndex,
  endpoint,
  activeRow,
  setActiveRow,
  rowId,
  setSelectedId,
  setIsEditMode,
  setDeleteModalOpen,
  setFormData,
  setOriginalData,
  setShowModal,
  items
}) => {
  const isOpen = activeRow === rowIndex;
  const containerRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);

  const onDelete = () => {
    setSelectedId(rowId);
    setDeleteModalOpen(true);
    setActiveRow(null);
  };

  const onEdit = () => {
    setIsEditMode(true);
    const item = items.find(i => i.id === rowId);
    setFormData(item);
    setOriginalData(item);
    setShowModal(true);
    setActiveRow(null);
  };

  // 🔽 Handle dynamic dropdown direction
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setOpenUpward(spaceBelow < 150 && spaceAbove > 150);
    }
  }, [isOpen]);

  // 🔽 Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveRow(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setActiveRow]);

  return (
    <div className="actionCell" ref={containerRef}>
      <BsThreeDotsVertical
        size={18}
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveRow(isOpen ? null : rowIndex)}
      />
      {isOpen && (
        <div className={`actionContainer ${openUpward ? 'open-up' : ''}`}>
          <TableActionModal 
            onDelete={onDelete}
            onEdit={onEdit}
            viewId={`/${endpoint}/${rowId}`}
          />
        </div>
      )}
    </div>
  );
};

export default ActionCell;
