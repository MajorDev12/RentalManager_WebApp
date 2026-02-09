import React from 'react';
import PrimaryButton from './PrimaryButton';
import "../../css/settings.css";

const SettingsCard = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="settingCard">
      <div className="settingInfo">
        <h3>{title}</h3>
        <p>{description}</p>

      </div>

      <PrimaryButton name={actionLabel} onClick={onAction} />
    </div>
  );
};

export default SettingsCard;