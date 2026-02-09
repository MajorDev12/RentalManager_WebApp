import React, { useState, useEffect} from 'react';
import BreadCrumb from '../../components/ui/BreadCrumb';
import Table from '../../components/ui/Table';
import { getColumns } from "./systemColumn";
import { getData } from '../../helpers/getData';
import { notificationService } from "./notificationService";
import { useAuthContext } from "../../auth/AuthContext";
import { useApiRequest } from '../../hooks/useApiRequest';


const System = () => {
    const { isAuthenticated, logout, user} = useAuthContext();
  const { execute, apiLoading } = useApiRequest();
  const EMPTY_FORM = {
    id: '',
    title: '',
    body: '',
    createdAt: '',
    isRead: ''
    }
const [notifications, setNotifications] = useState(EMPTY_FORM);
const [notificationsLoader, setNotificationsLoader] = useState(true);
const [notificationError, setNotificationError] = useState('');



  useEffect(() => {
    fetchNotifications();
  }, []);



  const fetchNotifications = async () => {
    await getData({
    execute,
    request: () => notificationService.getUnRead(user.id),
    setData: setNotifications,
    setLoading: setNotificationsLoader,
    setError: setNotificationError
    });
  };
    

  const columns = getColumns();


  return (
    <>
    <BreadCrumb  greetings="" />
    <div id="Section">
      <div className="header">
          <h3>List of all Notifications</h3>
        </div>

        <div className="TableContainer">
          <Table data={notifications} columns={columns} loading={notificationsLoader}  error={notificationError}/>
        </div>

    </div>
  </>
  )
}

export default System