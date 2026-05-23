const UnitHeader = ({ unit, loading, error }) => {
  // Loading / Empty State
  if (loading) {
    return (
      <div className="unitHeaderCard card">
        <div>
          <h1>Loading Unit...</h1>
          <p>Please wait while we fetch unit details.</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="unitHeaderCard card errorCard">
        <div>
          <h1>Unable to Load Unit</h1>
          <p>Something went wrong while fetching the unit details.</p>
        </div>
      </div>
    );
  }

  // No Unit Found
  if (!unit) {
    return (
      <div className="unitHeaderCard card emptyCard">
        <div>
          <h1>Unit Not Found</h1>
          <p>The requested unit does not exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unitHeaderCard card">
      <div>
        <h1>{unit.name || "Unnamed Unit"}</h1>

        <p>
          {unit.propertyName || "Unknown Property"} •{" "}
          {unit.unitType || "Unknown Type"}
        </p>
      </div>

      <div className="headerRight">
        <h2>KES {unit.amount ? Number(unit.amount).toLocaleString() : "0"}</h2>

        <span className={`statusBadge ${unit.status?.toLowerCase()}`}>
          {unit.status || "UNKNOWN"}
        </span>
      </div>
    </div>
  );
};

export default UnitHeader;
