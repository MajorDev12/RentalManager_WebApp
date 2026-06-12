import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "../../css/smartSelect.css";

const SmartSelect = ({
  name,
  labelName,
  value,
  onChange,
  options = [],
  placeholder = "-- Select --",
  disabled = false,
  required = false,
  searchable = true,
  className = "",
}) => {
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("bottom");
  const [coords, setCoords] = useState(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate position + coords
  useEffect(() => {
    if (!open || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setCoords(rect);

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < 260 && spaceAbove > spaceBelow) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  }, [open]);

  // Filter
  const filteredOptions = useMemo(() => {
    if (!searchable || !search) return options;

    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, searchable]);

  // Grouping
  const groupedOptions = useMemo(() => {
    const groups = {};

    filteredOptions.forEach((opt) => {
      const group = opt.groupKey || "Others";

      if (!groups[group]) groups[group] = [];

      groups[group].push(opt);
    });

    return groups;
  }, [filteredOptions]);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (opt) => {
    onChange({
      target: {
        name,
        value: opt.value,
      },
    });

    setOpen(false);
    setSearch("");
  };

  // Render dropdown content (reused for top/bottom)
  const renderContent = () => {
    const optionsUI = (
      <div className="smartOptions">
        {Object.keys(groupedOptions).length === 0 && (
          <div className="noResults">No results</div>
        )}

        {Object.entries(groupedOptions).map(([group, items]) => (
          <div key={group}>
            <div className="smartGroupHeader">{group}</div>

            {items.map((opt) => (
              <div
                key={opt.value}
                className={`smartOption ${opt.value === value ? "active" : ""}`}
                onClick={() => handleSelect(opt)}
              >
                {opt.icon && (
                  <span
                    className="material-icons smartIcon"
                    style={{ color: opt.color }}
                  >
                    {opt.icon}
                  </span>
                )}

                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    const searchUI = searchable && (
      <input
        className="smartSearch"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    );

    // NORMAL (bottom)
    if (position === "bottom") {
      return (
        <>
          {searchUI}
          {optionsUI}
        </>
      );
    }

    // TOP (search below options as requested)
    return (
      <>
        {optionsUI}
        {searchUI}
      </>
    );
  };

  return (
    <div className={`smartSelectContainer ${className}`} ref={containerRef}>
      {labelName && (
        <label className="smartSelectLabel">
          {labelName}
          {required && <span className="required">*</span>}
        </label>
      )}

      {/* SELECT BOX */}
      <div
        className={`smartSelectBox ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {selected ? (
          <div className="smartSelected">
            {selected.icon && (
              <span
                className="material-icons smartIcon"
                style={{ color: selected.color }}
              >
                {selected.icon}
              </span>
            )}
            <span>{selected.label}</span>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}

        <span className="arrow">▼</span>
      </div>

      {/* PORTAL DROPDOWN */}
      {open &&
        coords &&
        ReactDOM.createPortal(
          <div
            className={`smartDropdown ${position === "top" ? "top" : ""}`}
            style={{
              position: "absolute",
              top:
                position === "bottom"
                  ? coords.bottom + window.scrollY + 6
                  : undefined,
              bottom:
                position === "top"
                  ? window.innerHeight - coords.top + window.scrollY + 6
                  : undefined,
              left: coords.left,
              width: coords.width,
            }}
          >
            {renderContent()}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SmartSelect;
