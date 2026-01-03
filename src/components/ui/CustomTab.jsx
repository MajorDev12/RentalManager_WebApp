import "../../css/customTab.css";
import { Tabs, Tab } from "react-bootstrap";

const CustomTab = ({ activeKey, onSelect }) => {
  return (
    <div className="tabsFilter">
      <Tabs
        id="income-filter-tabs"
        activeKey={activeKey}
        onSelect={onSelect}
        className="mb-3 customTabs"
        data-active={activeKey.toLowerCase()}
        fill
      >
        <Tab eventKey="tenant" title="Tenant" />
        <Tab eventKey="unit" title="Unit" />
        <Tab eventKey="properties" title="Properties" />
      </Tabs>
    </div>
  );
};

export default CustomTab;
