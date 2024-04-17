import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [isModel, setisModel] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });
  const getAllUsers = async () => {
    await axios
      .get("http://localhost:5000/users")
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        setFilterUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  //SEARCH FUNCTION
  const handleSearchChange = (e) => {
    const search = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.city.toLowerCase().includes(search)
    );
    setFilterUser(filteredUsers);
  };
  //DELETE FUNCTION
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Aere ypu sure want to delter?");
    if (isConfirmed) {
      await axios
        .delete(`http://localhost:5000/users/${id}`)
        .then((res) => {
          setFilterUser(res.data);
          setUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  //ADD USER DETAILS
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setisModel(true);
  };
  //CLOSE MODEL
  const modelClose = () => {
    setisModel(false);
  };
  getAllUsers();
  const handleData = (e) => {
    // console.log(e.target.name);
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios
        .patch(`http://localhost:5000/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post("http://localhost:5000/users", userData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    modelClose();
  };
  const updateRecord = (user) => {
    setUserData(user);
    setisModel(true);
  };
  return (
    <>
      <div className="container">
        <h3>CRUD Application with ReactJS and NodeJS </h3>
        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here"
            onChange={handleSearchChange}
          />

          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUser &&
              filterUser.map((user, index) => (
                <tr key={index}>
                  <td>{user.id} </td>
                  <td>{user.name} </td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button
                      className="btn green"
                      onClick={() => updateRecord(user)}
                    >
                      EDIT
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn red"
                      onClick={() => handleDelete(user.id)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isModel && (
          <div className="model">
            <div className="model_content">
              <span className="close" onClick={modelClose}>
                &times;
              </span>
              <h2>{userData.id?"update Record":"add record"}</h2>
              <div className="input__group">
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={userData.name}
                  onChange={handleData}
                />
              </div>
              <div className="input__group">
                <label htmlFor="age">age</label>
                <input
                  type="text"
                  name="age"
                  id="age"
                  value={userData.age}
                  onChange={handleData}
                />
              </div>
              <div className="input__group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={userData.city}
                  onChange={handleData}
                />
              </div>
              <button className="btn green" onClick={handleSubmit}>
                {userData.id?"Edit":"ADD"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
