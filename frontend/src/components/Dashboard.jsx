import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://localhost:3000/dashboard', config);
        setUsers(response.data);

        const requestResponse = await axios.get('http://localhost:3000/requests', config);
        setRequests(requestResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post('http://localhost:3000/request', { toUserId: userId, message }, config);
      setMessage('');
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Users</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => setSelectedUser(user.id)}>Send Request</button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>Send Request</h3>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={() => handleRequest(selectedUser)}>Send</button>
        </div>
      )}

      <h3>Requests</h3>
      <ul>
        {console.log(requests)}
        {requests.length>0 && requests.map(request => (
          <li key={request.id}>
            {request.message} (from: {request.fromUser?.name} - {request.fromUser?.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
