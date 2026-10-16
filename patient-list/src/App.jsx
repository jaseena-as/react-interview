import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/patients?user_id=1&clinic_id=1&page_no=0";


function App() {
const [patients, setPatients] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
async function fetchPatients() {
try {
setLoading(true);
setError("");


  const username = import.meta.env.VITE_API_USERNAME;
  const password = import.meta.env.VITE_API_PASSWORD;

  if (!username || !password) {
    throw new Error("API credentials are missing. Check your .env file.");
  }

  const credentials = btoa(username + ":" + password);

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: "Basic " + credentials,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("HTTP error: " + response.status);
  }

  // const result = await response.json();

  // const data = Array.isArray(result)
  //   ? result
  //   : Array.isArray(result.data)
  //     ? result.data
  //     : Array.isArray(result.patients)
  //       ? result.patients
  //       : null;

  // if (!data) {
  //   throw new Error("Unexpected API response format.");
  // }

  // setPatients(data);


const result = await response.json();

console.log("Full API response:", result);

const data = Array.isArray(result.result) ? result.result : [];

setPatients(data);


} catch (err) {
  setError(err.message || "Failed to fetch patients.");
} finally {
  setLoading(false);
}


}

fetchPatients();
}, []);


function getValue(...values) {
for (const value of values) {
if (value !== undefined && value !== null && value !== "") {
return value;
}
}

return "-";
}

function getName(patient) {
return getValue(
patient.name,
patient.patient_name,
[patient.first_name, patient.last_name].filter(Boolean).join(" ")
);
}

function getAge(patient) {
if (
patient.age !== undefined &&
patient.age !== null &&
patient.age !== ""
) {
return patient.age;
}

if (!patient.dob) {
return "-";
}

const birthDate = new Date(patient.dob);

if (Number.isNaN(birthDate.getTime())) {
return "-";
}

const today = new Date();

let age = today.getFullYear() - birthDate.getFullYear();

if (
today.getMonth() < birthDate.getMonth() ||
(today.getMonth() === birthDate.getMonth() &&
today.getDate() < birthDate.getDate())
) {
age--;
}

return age >= 0 ? age : "-";
}



return (
   <main className="container"> <header className="header"> <div> <p className="subtitle">PATIENT MANAGEMENT SYSTEM</p> <h1>Patient List</h1> <p className="description">
View registered patient information in one place. </p> </div>

```
    {!loading && !error && (
      <div className="count">
        Total Patients: <strong>{patients.length}</strong>
      </div>
    )}
  </header>

  <section className="table-card">
    {loading ? (
      <div className="message" role="status">
        <div className="spinner" />
        <p>Loading patients...</p>
      </div>
    ) : error ? (
      <div className="message error" role="alert">
        <h3>Unable to load patients</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    ) : patients.length === 0 ? (
      <div className="message">
        <p>No patients found.</p>
      </div>
    ) : (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Reg. ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Mobile</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={
                  patient.id ??
                  patient.reg_id ??
                  patient.registration_id ??
                  index
                }
              >
                <td>
                  {getValue(
                    patient.reg_id,
                    patient.registration_id,
                    patient.id
                  )}
                </td>
                <td className="patient-name">{getName(patient)}</td>
                <td>{getValue(patient.gender)}</td>
                <td>{getAge(patient)}</td>
                <td>{getValue(patient.mobile, patient.phone)}</td>
                <td className="address">
                  {getValue(patient.address)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>

  <footer>Patient Management System</footer>
</main>


);

}
export default App;
