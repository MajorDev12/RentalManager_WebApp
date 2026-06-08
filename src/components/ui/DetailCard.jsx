const DetailCard = ({ title, state = "success", details = [] }) => {
  return (
    <>
      <div className="card sectionCard">
        <div className="sectionHeader">
          <h3>{title}</h3>
        </div>
        {state === "loading" && <p className="vpMuted">Loading…</p>}
        {state === "error" && (
          <p className="vpMuted vpError">Something went wrong.</p>
        )}
        {state === "success" && (
          <div className="detailList">
            {details.map((detail) => (
              <div className="detailRow">
                <span className="detailLbl">
                  {detail.icon || ""} {detail.label}
                </span>
                <span className={`detailVal ${detail.className}`}>
                  {detail.value || "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DetailCard;
