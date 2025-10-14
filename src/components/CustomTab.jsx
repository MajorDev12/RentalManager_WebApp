import "../css/customTab.css";
import { Tabs, Tab } from "react-bootstrap";

const CustomTab = ({ activeKey, onSelect }) => {
  return (
    <div className="tabsFilter">
      <Tabs
        id="income-filter-tabs"
        activeKey={activeKey}
        onSelect={onSelect}
        className="customTabs"
        fill
        data-active={activeKey}
      >
        <Tab eventKey="tenant" title="Tenant" />
        <Tab eventKey="unit" title="Unit" />
        <Tab eventKey="property" title="Property" />
      </Tabs>
    </div>
  );
};

export default CustomTab;
