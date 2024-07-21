import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signin', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Signin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg"/>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Signin</button>
        </form>
        <p className="mt-4 text-center">Don't have an account?</p>
        <button onClick={() => navigate('/')} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2">Sign Up</button>
      </div>
    </div>
  );
};

export default Signin;
