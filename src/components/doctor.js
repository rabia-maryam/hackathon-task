// import React, { useState, useEffect } from 'react';
// import { auth, db } from '../config/firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// const DoctorDashboard = () => {
//   const [doctorDetails, setDoctorDetails] = useState({});
//   const [schedule, setSchedule] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [activeSection, setActiveSection] = useState('details');
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [available, setAvailable] = useState(false);
//   const [isEditing, setIsEditing] = useState(false); // New state for editing
//   const [name, setName] = useState('');
//   const [specialization, setSpecialization] = useState('');
//   const [contactInfo, setContactInfo] = useState('');
//   const [userId, setUserId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         setUserId(user.uid);
//       } else {
//         navigate('/login');
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   useEffect(() => {
//     if (userId) {
//       fetchDoctorDetails(userId);
//       fetchSchedule(userId);
//       fetchAppointments(userId); // Fetch appointments as well
//     }
//   }, [userId]);

//   const fetchDoctorDetails = async (id) => {
//     const doctorDocRef = doc(db, 'doctors', id);
//     const doctorDocSnapshot = await getDoc(doctorDocRef);
    
//     if (doctorDocSnapshot.exists()) {
//       const data = doctorDocSnapshot.data();
//       setDoctorDetails(data);
//       setName(data.name || '');
//       setSpecialization(data.specialization || '');
//       setContactInfo(data.contactInfo || '');
//     } else {
//       console.log("No such document!");
//     }
//   };

//   const fetchSchedule = (id) => {
//     const scheduleRef = collection(db, 'doctors', id, 'schedule');
//     const q = query(scheduleRef);
    
//     onSnapshot(q, (snapshot) => {
//       const slots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setSchedule(slots);
//     });
//   };

//   const fetchAppointments = (id) => {
//     const appointmentsRef = collection(db, 'appointments');
//     const q = query(appointmentsRef, where('doctorId', '==', id)); // Filter by doctorId directly in Firestore
    
//     onSnapshot(q, (snapshot) => {
//       const appointmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAppointments(appointmentsData);
//     });
//   };

//   const handleSaveSlot = async () => {
//     if (!startTime || !endTime) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (new Date(startTime) >= new Date(endTime)) {
//       alert("Start time must be before end time.");
//       return;
//     }

//     const slotData = {
//       startTime: startTime,
//       endTime: endTime,
//       available,
//     };

//     try {
//       await setDoc(doc(db, 'doctors', userId, 'schedule', `${Date.now()}`), slotData);
//       setStartTime('');
//       setEndTime('');
//       setAvailable(false);
//     } catch (error) {
//       console.error("Error saving slot:", error);
//       alert("Failed to save slot. Please try again.");
//     }
//   };

//   const handleSaveDetails = async () => {
//     if (!name || !specialization || !contactInfo) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const doctorDocRef = doc(db, 'doctors', userId);
//     await setDoc(doctorDocRef, { name, specialization, contactInfo }, { merge: true });
    
//     setDoctorDetails({
//       ...doctorDetails,
//       name,
//       specialization,
//       contactInfo
//     });
    
//     alert("Doctor details saved successfully.");
//     setIsEditing(false);
//   };

//   return (
//     <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-4xl font-extrabold text-blue-600 mb-6">Doctor Dashboard</h1>
//       <nav className="mb-8">
//         <ul className="flex space-x-8">
//           <li 
//             onClick={() => setActiveSection('details')} 
//             className={`cursor-pointer hover:underline ${activeSection === 'details' ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
//           >
//             Details
//           </li>
//           <li 
//             onClick={() => setActiveSection('schedule')} 
//             className={`cursor-pointer hover:underline ${activeSection === 'schedule' ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
//           >
//             Schedule
//           </li>
//           <li 
//             onClick={() => setActiveSection('appointments')} 
//             className={`cursor-pointer hover:underline ${activeSection === 'appointments' ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
//           >
//             Appointments
//           </li>
//         </ul>
//       </nav>

//       {activeSection === 'details' && (
//         <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
//           <h2 className="text-2xl font-bold text-blue-500 mb-4">Your Details</h2>
//           {isEditing ? (
//             <>
//               <label className="block mb-3">
//                 <span className="text-gray-700">Name:</span>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </label>
//               <label className="block mb-3">
//                 <span className="text-gray-700">Specialization:</span>
//                 <input
//                   type="text"
//                   value={specialization}
//                   onChange={(e) => setSpecialization(e.target.value)}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </label>
//               <label className="block mb-3">
//                 <span className="text-gray-700">Contact Info:</span>
//                 <input
//                   type="text"
//                   value={contactInfo}
//                   onChange={(e) => setContactInfo(e.target.value)}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </label>
//               <button 
//                 onClick={handleSaveDetails} 
//                 className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
//               >
//                 Save Details
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="mb-2 text-gray-700"><strong>Name:</strong> {doctorDetails.name || 'N/A'}</p>
//               <p className="mb-2 text-gray-700"><strong>Specialization:</strong> {doctorDetails.specialization || 'N/A'}</p>
//               <p className="mb-2 text-gray-700"><strong>Contact Info:</strong> {doctorDetails.contactInfo || 'N/A'}</p>
//               <button 
//                 onClick={() => setIsEditing(true)} 
//                 className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
//               >
//                 Edit Details
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {activeSection === 'schedule' && (
//         <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
//           <h2 className="text-2xl font-bold text-blue-500 mb-4">Your Schedule</h2>
//           <h3 className="text-xl font-semibold mb-2">Add Availability Slot</h3>
//           <label className="block mb-3">
//             <span className="text-gray-700">Start Time:</span>
//             <input
//               type="datetime-local"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </label>
//           <label className="block mb-3">
//             <span className="text-gray-700">End Time:</span>
//             <input
//               type="datetime-local"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </label>
//           <label className="flex items-center space-x-2 mb-4">
//             <input 
//               type="checkbox" 
//               checked={available} 
//               onChange={() => setAvailable(!available)} 
//               className="rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-gray-700">Available</span>
//           </label>
//           <button 
//             onClick={handleSaveSlot} 
//             className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
//           >
//             Save Slot
//           </button>

//           <h3 className="text-xl font-semibold mt-6 mb-2">Your Schedule</h3>
//           <ul className="space-y-3">
//             {schedule.map(slot => (
//               <li key={slot.id} className="p-4 border border-gray-200 rounded-md shadow-sm">
//                 <p className="text-blue-600"><strong>Start:</strong> {new Date(slot.startTime).toLocaleString()}</p>
//                 <p className="text-blue-600"><strong>End:</strong> {new Date(slot.endTime).toLocaleString()}</p>
//                 <p className={slot.available ? 'text-green-600' : 'text-red-600'}>
//                   {slot.available ? 'Available' : 'Not Available'}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {activeSection === 'appointments' && (
//         <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
//           <h3 className="text-2xl font-bold text-blue-500 mb-4">Your Appointments</h3>
//           {appointments.length > 0 ? (
//             <ul className="space-y-3">
//               {appointments.map(appointment => (
//                 <li key={appointment.id} className="p-4 border border-gray-200 rounded-md shadow-sm">
//                   <p className="text-lg font-semibold text-blue-600">{appointment.patientName}</p>
//                   <p className="text-gray-600">
//                     <strong>Date:</strong> {new Date(appointment.date).toLocaleString()}
//                   </p>
//                   {appointment.notes && (
//                     <p className="italic text-gray-500"><strong>Notes:</strong> {appointment.notes}</p>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No appointments found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [doctorDetails, setDoctorDetails] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState('details');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [available, setAvailable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      console.log("Fetching doctor details for user ID:", userId);
      fetchDoctorDetails(userId);
      fetchSchedule(userId);
      fetchAppointments(userId);
    }
  }, [userId]);

  const fetchDoctorDetails = async (id) => {
    const doctorDocRef = doc(db, 'doctors', id);
    const doctorDocSnapshot = await getDoc(doctorDocRef);
    
    if (doctorDocSnapshot.exists()) {
      const data = doctorDocSnapshot.data();
      console.log("Doctor details:", data);
      setDoctorDetails(data);
      setName(data.name || '');
      setSpecialization(data.specialization || '');
      setContactInfo(data.contactInfo || '');
    } else {
      console.log("No such doctor document!");
    }
  };

  const fetchSchedule = (id) => {
    const scheduleRef = collection(db, 'doctors', id, 'schedule');
    const q = query(scheduleRef);
    
    onSnapshot(q, (snapshot) => {
      const slots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Schedule slots:", slots);
      setSchedule(slots);
    }, (error) => {
      console.error("Error fetching schedule:", error);
    });
  };

  const fetchAppointments = (id) => {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('doctorId', '==', id));
    
    onSnapshot(q, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Appointments data:", appointmentsData);
      setAppointments(appointmentsData);
    }, (error) => {
      console.error("Error fetching appointments:", error);
    });
  };

  const handleSaveSlot = async () => {
    if (!startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert("Start time must be before end time.");
      return;
    }

    const slotData = {
      startTime: startTime,
      endTime: endTime,
      available,
    };

    try {
      await setDoc(doc(db, 'doctors', userId, 'schedule', `${Date.now()}`), slotData);
      setStartTime('');
      setEndTime('');
      setAvailable(false);
      console.log("Slot saved successfully:", slotData);
    } catch (error) {
      console.error("Error saving slot:", error);
      alert("Failed to save slot. Please try again.");
    }
  };

  const handleSaveDetails = async () => {
    if (!name || !specialization || !contactInfo) {
      alert("Please fill in all fields.");
      return;
    }

    const doctorDocRef = doc(db, 'doctors', userId);
    await setDoc(doctorDocRef, { name, specialization, contactInfo }, { merge: true });
    
    setDoctorDetails({
      ...doctorDetails,
      name,
      specialization,
      contactInfo
    });
    
    alert("Doctor details saved successfully.");
    setIsEditing(false);
  };

  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000); // Firestore timestamp
      return date.toLocaleString(); // Format as needed
    }
    return 'Invalid Date';
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">Doctor Dashboard</h1>
      <nav className="mb-8">
        <ul className="flex space-x-8">
          <li 
            onClick={() => setActiveSection('details')} 
            className={`cursor-pointer hover:underline ${activeSection === 'details' ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
          >
            Details
          </li>
          <li 
            onClick={() => setActiveSection('schedule')} 
            className={`cursor-pointer hover:underline ${activeSection === 'schedule' ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
          >
            Schedule
          </li>
          <li 
            onClick={() => setActiveSection('appointments')} 
            className={`cursor-pointer hover:underline ${activeSection === 'appointments' ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
          >
            Appointments
          </li>
        </ul>
      </nav>

      {activeSection === 'details' && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-500 mb-4">Your Details</h2>
          {isEditing ? (
            <>
              <label className="block mb-3">
                <span className="text-gray-700">Name:</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-3">
                <span className="text-gray-700">Specialization:</span>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-3">
                <span className="text-gray-700">Contact Info:</span>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <button 
                onClick={handleSaveDetails} 
                className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
              >
                Save Details
              </button>
            </>
          ) : (
            <>
              <p className="mb-2 text-gray-700"><strong>Name:</strong> {doctorDetails.name || 'N/A'}</p>
              <p className="mb-2 text-gray-700"><strong>Specialization:</strong> {doctorDetails.specialization || 'N/A'}</p>
              <p className="mb-2 text-gray-700"><strong>Contact Info:</strong> {doctorDetails.contactInfo || 'N/A'}</p>
              <button 
                onClick={() => setIsEditing(true)} 
                className="mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
              >
                Edit Details
              </button>
            </>
          )}
        </div>
      )}

      {activeSection === 'schedule' && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">Schedule Availability</h3>
          <label className="block mb-3">
            <span className="text-gray-700">Start Time:</span>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-3">
            <span className="text-gray-700">End Time:</span>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-3">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="mr-2"
            />
            Available
          </label>
          <button 
            onClick={handleSaveSlot} 
            className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
          >
            Save Slot
          </button>

          <h3 className="text-xl font-semibold mt-6">Your Availability Slots</h3>
          <ul className="space-y-2 mt-2">
            {schedule.length > 0 ? (
              schedule.map(slot => (
                <li key={slot.id} className="p-4 border border-gray-200 rounded-md shadow-sm">
                  <p><strong>Start:</strong> {new Date(slot.startTime).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(slot.endTime).toLocaleString()}</p>
                  <p><strong>Available:</strong> {slot.available ? 'Yes' : 'No'}</p>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500">No availability slots found.</li>
            )}
          </ul>
        </div>
      )}

      {activeSection === 'appointments' && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">Your Appointments</h3>
          {appointments.length > 0 ? (
            <ul className="space-y-3">
              {appointments.map(appointment => (
                <li key={appointment.id} className="p-4 border border-gray-200 rounded-md shadow-sm">
                  <p className="text-lg font-semibold text-blue-600">{appointment.patientName}</p>
                  <p className="text-gray-600">
                    <strong>Date:</strong> {formatDate(appointment.date)}
                  </p>
                  {appointment.notes && (
                    <p className="italic text-gray-500"><strong>Notes:</strong> {appointment.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
