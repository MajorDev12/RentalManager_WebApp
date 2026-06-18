const UnitTypeCard = ({
  unitTypeList = [],
  unitTypeLoading,
  unitTypeError,
}) => (
  <div className="card sectionCard">
    <div className="sectionHeader">
      <h3>Unit Types</h3>
    </div>

    {unitTypeLoading ? (
      <p className="vpMuted">Loading...</p>
    ) : unitTypeError ? (
      <p className="vpMuted">Error loading unit types.</p>
    ) : unitTypeList.length ? (
      <div className="tagWrap">
        {unitTypeList.map((type) => (
          <span key={type.unitTypeId} className="vpTag">
            <strong>({type.count})</strong> {type.unitType}
          </span>
        ))}
      </div>
    ) : (
      <p className="vpMuted">No unit types added yet.</p>
    )}
  </div>
);

export default UnitTypeCard;
