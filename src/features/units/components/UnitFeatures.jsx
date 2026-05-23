const UnitFeatures = ({ features }) => {
  return (
    <div className="card">
      <h3>Features & Amenities</h3>

      <div className="featureGrid">
        {features.map((feature) => (
          <div className="featureItem" key={feature.name}>
            <span>{feature.name}</span>

            <strong>{feature.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UnitFeatures;
