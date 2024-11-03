
import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [patientDetails, setPatientDetails] = useState({});
  const [name, setName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [userId, setUserId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchPatientDetails(user.uid);
        await fetchDoctors();
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchPatientDetails = async (id) => {
    const patientDocRef = doc(db, 'patients', id);
    const patientDocSnapshot = await getDoc(patientDocRef);

    if (patientDocSnapshot.exists()) {
      const data = patientDocSnapshot.data();
      setPatientDetails(data);
      setName(data.name || '');
      setContactDetails(data.contactDetails || '');
      setMedicalHistory(data.medicalHistory || '');
    } else {
      console.log("No such document!");
    }
  };

  const fetchDoctors = async () => {
    const doctorsRef = collection(db, 'doctors');
    const doctorSnapshot = await getDocs(doctorsRef);
    const doctorList = doctorSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDoctors(doctorList);
  };

  const handleSaveDetails = async () => {
    const patientDocRef = doc(db, 'patients', userId);
    await setDoc(patientDocRef, { name, contactDetails, medicalHistory }, { merge: true });
    alert("Patient details saved successfully.");
    setIsEditing(false); // Exit editing mode after saving
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !dateTime) {
      alert("Please select a doctor and choose a date/time.");
      return;
    }
  
    // Log the dateTime to ensure it's formatted correctly
    console.log("Booking appointment for date/time: ", dateTime);
  
    try {
      // Create a new Date object and log it
      const appointmentDateTime = new Date(dateTime);
      console.log("Parsed appointment date/time: ", appointmentDateTime);
  
      if (isNaN(appointmentDateTime.getTime())) {
        throw new Error("Invalid date/time format. Please ensure it is correctly selected.");
      }
  
      const appointmentRef = collection(db, 'appointments');
      await addDoc(appointmentRef, {
        doctorId: selectedDoctorId,
        patientId: userId,
        dateTime: appointmentDateTime,
        notes,
      });
      alert('Appointment booked successfully!');
      clearAppointmentForm();
    } catch (error) {
      console.error("Error booking appointment: ", error);
      alert("Error booking appointment: " + error.message);
    }
  };
  
  

  const clearAppointmentForm = () => {
    setSelectedDoctorId('');
    setDateTime('');
    setNotes('');
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

      {/* Display patient details */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-4">Your Details</h2>
        {isEditing ? (
          <>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <label className="block mb-2">
              Contact Details:
              <input
                type="text"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <label className="block mb-2">
              Medical History:
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <button
              onClick={handleSaveDetails}
              className="w-full py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Save Details
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-full py-2 mt-2 font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Contact Details:</strong> {contactDetails}</p>
            <p><strong>Medical History:</strong> {medicalHistory}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 py-2 px-4 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-200"
            >
              Edit Details
            </button>
          </>
        )}
      </div>

      {/* Button to toggle appointment form */}
      <button
        onClick={() => setShowAppointment(!showAppointment)}
        className="mb-4 py-2 px-4 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-200"
      >
        {showAppointment ? "Hide Appointment Form" : "Book an Appointment"}
      </button>

      {/* Display appointment form */}
      {showAppointment && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
          <form onSubmit={handleBookAppointment}>
            <label className="block mb-2">
              Select Doctor:
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-2">
              Appointment Date & Time:
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </label>
            <label className="block mb-2">
              Notes:
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </label>
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Book Appointment
            </button>
          </form>
        </div>
      )}

      {/* <button
        onClick={handleLogout}
        className="mt-4 py-2 px-4 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200"
      >
        Logout
      </button> */}
    </div>
  );
};

export default PatientDashboard;
