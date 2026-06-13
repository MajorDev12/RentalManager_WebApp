import React, { useMemo } from "react";
import Select from "react-select";

const FONT_SIZE = "var(--smallFontSize)";

const SmartSelect = ({
  name,
  labelName,
  value,
  onChange,
  options = [],
  placeholder = "-- Select --",
  required = false,
  disabled = false,
  isMulti = false,
  isSearchable = true,
  isClearable = true,
  closeMenuOnSelect = true,
  groupBy = null,
  className = "",
}) => {
  // GROUPING
  const formattedOptions = useMemo(() => {
    if (!groupBy) return options;

    const groups = {};

    options.forEach((item) => {
      const group = item[groupBy] || "Others";

      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });

    return Object.entries(groups).map(([label, items]) => ({
      label,
      options: items,
    }));
  }, [options, groupBy]);

  // VALUE RESOLVE
  const selectedValue = useMemo(() => {
    if (isMulti) {
      if (!Array.isArray(value)) return [];
      return options.filter((x) => value.includes(x.value));
    }

    return options.find((x) => x.value === value) || null;
  }, [options, value, isMulti]);

  // CHANGE HANDLER
  const handleChange = (selected) => {
    if (isMulti) {
      onChange?.({
        target: {
          name,
          value: selected ? selected.map((x) => x.value) : [],
        },
      });
      return;
    }

    onChange?.({
      target: {
        name,
        value: selected ? selected.value : "",
      },
    });
  };

  // OPTION RENDER (icons + text)
  const formatOptionLabel = (option) => (
    <div className="smart-option">
      {option.icon && (
        <span
          className="material-icons smart-icon"
          style={{ color: option.color }}
        >
          {option.icon}
        </span>
      )}
      <span>{option.label}</span>
    </div>
  );

  return (
    <div className={`selectContainer ${className}`}>
      {labelName && (
        <label className="selectLabel">
          {labelName}
          {required && <span className="required">*</span>}
        </label>
      )}

      <Select
        name={name}
        options={formattedOptions}
        value={selectedValue}
        onChange={handleChange}
        isMulti={isMulti}
        isDisabled={disabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        closeMenuOnSelect={isMulti ? false : closeMenuOnSelect}
        placeholder={placeholder}
        formatOptionLabel={formatOptionLabel}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={customStyles}
      />
    </div>
  );
};

const customStyles = {
  /* ================= CONTROL ================= */
  control: (base, state) => ({
    ...base,
    minHeight: "32px",
    height: "32px",

    borderRadius: "10px",
    backgroundColor: "var(--backgroundColor)",
    borderColor: state.isFocused
      ? "var(--highlightColor)"
      : "var(--borderColor)",

    boxShadow: state.isFocused ? "0 0 0 3px rgba(34,119,204,0.12)" : "none",

    fontSize: FONT_SIZE,

    "&:hover": {
      borderColor: "var(--highlightColor)",
    },
  }),

  /* ================= VALUE ================= */
  valueContainer: (base) => ({
    ...base,
    height: "32px",
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontSize: FONT_SIZE,
  }),

  singleValue: (base) => ({
    ...base,
    fontSize: FONT_SIZE,
    color: "var(--textColor)",
  }),

  placeholder: (base) => ({
    ...base,
    fontSize: FONT_SIZE,
    color: "var(--lightTextColor)",
  }),

  /* ================= MENU ================= */
  menu: (base) => ({
    ...base,
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "var(--backgroundColor)",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),

  /* ================= OPTIONS ================= */
  option: (base, state) => ({
    ...base,
    fontSize: FONT_SIZE,
    padding: "8px 12px",

    backgroundColor: state.isSelected
      ? "rgba(34,119,204,0.15)"
      : state.isFocused
        ? "var(--containerColor)"
        : "var(--backgroundColor)",

    color: "var(--textColor)",
    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),

  /* ================= GROUP ================= */
  groupHeading: (base) => ({
    ...base,
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--lightTextColor)",
    backgroundColor: "var(--containerColor)",
    padding: "6px 10px",
    margin: 0,
  }),

  /* ================= INDICATORS ================= */
  indicatorsContainer: (base) => ({
    ...base,
    height: "32px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: "4px",
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: "4px",
  }),
};

export default SmartSelect;
