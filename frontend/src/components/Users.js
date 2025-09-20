import React from "react";
import { useContext, useEffect } from "react";
import AdminContext from "../context/AdminContext";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

const Users = () => {
  const {
    fetchUsers,
    users,
    handleDeleteUser,
    usersPage,
    setUsersPage,
    totalUsersPages,
  } = useContext(AdminContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, [usersPage]);

  const goBack = () => navigate("/admin");
  return (
    <main className="admin">
      <h2>Users</h2>
      {users.length > 0 ? (
        <table className="users">
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <button
                    style={{
                      height: "50px",
                      width: "50px",
                      backgroundColor: "#fff",
                      border: "none",
                      outline: "none",
                    }}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <FaTrashAlt
                      style={{
                        height: "30px",
                        width: "30px",
                        color: "#82853e",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Users</p>
      )}
      <Pagination
        currentPage={usersPage}
        totalPages={totalUsersPages}
        onPageChange={(page) => setUsersPage(page)}
      />
      <div>
        <button
          onClick={goBack}
          style={{
            display: "block",
            backgroundColor: "#82853e",
            color: "white",
            border: "none",
            outline: "none",
            padding: "7px",
            borderRadius: "3px",
            margin: "10px 0",
            textDecoration: "none",
          }}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default Users;
