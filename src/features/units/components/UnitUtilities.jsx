const UnitUtilities = ({ utilities }) => {
  return (
    <div className="card">
      <h3>Utilities</h3>

      {utilities.map((u) => (
        <div className="utilityRow" key={u.name}>
          <span>{u.name}</span>

          <strong>KES {u.amount}</strong>
        </div>
      ))}
    </div>
  );
};

export default UnitUtilities;
