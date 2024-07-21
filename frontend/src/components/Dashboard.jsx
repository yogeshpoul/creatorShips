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
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Users</h3>
          <ul className="bg-white p-4 rounded shadow">
            {users.map(user => (
              <li key={user.id} className="flex justify-between items-center p-2 border-b last:border-none">
                <span>{user.name} ({user.email})</span>
                <button
                  onClick={() => setSelectedUser(user.id)}
                  className="bg-blue-500 text-white py-1 px-2 rounded"
                >
                  Send Request
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Requests</h3>
          <ul className="bg-white p-4 rounded shadow">
            {requests.map(request => (
              <li key={request.id} className="p-2 border-b last:border-none">
                <span>
                  {request.message} 
                  {request.fromUser && ` (from: ${request.fromUser.name} - ${request.fromUser.email})`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedUser && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Send Request</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={() => handleRequest(selectedUser)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
