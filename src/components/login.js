import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the logged-in user is a doctor
      const doctorDocRef = doc(db, "doctors", user.uid);
      const doctorDocSnapshot = await getDoc(doctorDocRef);

      if (doctorDocSnapshot.exists()) {
        alert("Login successful!");
        navigate('/doc'); // Redirect to the Doctor Dashboard after login
      } else {
        // If the user is not a doctor, check if they are a patient
        const patientDocRef = doc(db, "patients", user.uid);
        const patientDocSnapshot = await getDoc(patientDocRef);

        if (patientDocSnapshot.exists()) {
          alert("Login successful!");
          navigate('/pat'); // Redirect to the Patient Dashboard after login
        } else {
          alert("Login successful, but you are neither a doctor nor a patient.");
          navigate('/'); // Redirect to homepage if the user is neither
        }
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          alert('The email address is not valid.');
          break;
        case 'auth/user-not-found':
          alert('No user found with this email.');
          break;
        case 'auth/wrong-password':
          alert('Incorrect password.');
          break;
        default:
          alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600">
          Don’t have an account?{' '}
          <button 
            onClick={() => navigate('/reg')} 
            className="text-teal-500 hover:underline"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
