import { FiPlus } from "react-icons/fi";
const UtilityCard = ({ utilities, showModal }) => {
  return (
    <div className="card sectionCard">
      <div className="sectionHeader">
        <h3>Utilities</h3>
        <button className="addBtn" onClick={showModal}>
          <FiPlus /> Add utility
        </button>
      </div>
      <div className="utilityGrid">
        {utilities.map((util, i) => (
          <div key={i} className="utilityItem">
            <div
              className={`utilIcon icon${util.color.charAt(0).toUpperCase() + util.color.slice(1)}`}
            >
              {util.icon}
            </div>
            <div>
              <p className="utilName">{util.name}</p>
              <p className="utilMeta">{util.provider}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UtilityCard;
