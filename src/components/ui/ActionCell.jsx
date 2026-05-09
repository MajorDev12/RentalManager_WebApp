import React, { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import TableActionModal from "./TableActionModal";
import "../../css/actioncell.css";

const ActionCell = ({ rowId, activeRow, setActiveRow, actions }) => {
  const isOpen = activeRow === rowId;

  const containerRef = useRef(null);

  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;

      const spaceAbove = rect.top;

      setOpenUpward(spaceBelow < 150 && spaceAbove > 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setActiveRow]);

  const handleToggle = (e) => {
    e.stopPropagation();

    setActiveRow(isOpen ? null : rowId);
  };

  return (
    <div
      className="actionCell"
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <BsThreeDotsVertical
        size={18}
        style={{ cursor: "pointer" }}
        onClick={handleToggle}
      />

      {isOpen && (
        <div className={`actionContainer ${openUpward ? "open-up" : ""}`}>
          <TableActionModal>{actions}</TableActionModal>
        </div>
      )}
    </div>
  );
};

export default ActionCell;
