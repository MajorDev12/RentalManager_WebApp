import BreadCrumb from '../../components/ui/BreadCrumb';
import SettingsCard from "../../components/ui/SettingsCard";
import "../../css/settings.css";

const Settings = () => {

    return(
        <>
            <BreadCrumb />
            <section className="settingSection">
                <div className="settingsGrid">
                    <SettingsCard
                        title="Billing & Subscription"
                        description="Manage your subscription, invoices, SMS credits, and payment methods."
                        actionLabel="Manage Billing"
                        onAction={() => navigate("/settings/billing")}
                    />

                    <SettingsCard
                        title="Account Settings"
                        description="Add Account Name to Emails, Company Logo etc."
                        actionLabel="Configure"
                        onAction={() => navigate("/settings/notifications")}
                    />


                    <SettingsCard
                        title="Notification Preferences"
                        description="Control how and when system notifications are delivered."
                        actionLabel="Configure"
                        onAction={() => navigate("/settings/notifications")}
                    />


                    <SettingsCard
                        title="SMS Templates"
                        description="Manage Sms messages that are sent."
                        actionLabel="Open"
                        onAction={() => navigate("/settings/security")}
                    />


                    <SettingsCard
                        title="Email Templates"
                        description="Manage Email messages that are sent."
                        actionLabel="Open"
                        onAction={() => navigate("/settings/security")}
                    />


                    <SettingsCard
                        title="Security & Access"
                        description="Manage passwords, 2FA, and access policies."
                        actionLabel="Open"
                        onAction={() => navigate("/settings/security")}
                    />
                </div>

            </section>
        </>
    )
} 


export default Settings;