import { useState, useEffect } from "react";
import { useT } from "../../../context/ThemeContext";
import api from "../../../services/api";

export default function AdminUserManagement() {
  const { T } = useT();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page] = useState(1);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=10&search=${search}`);
      if (res.data?.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/users/${id}/toggle-status`);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: T.bgCard, borderRadius: 12, padding: "1.5rem", border: `1px solid ${T.border}` }}>
      <h3 style={{ margin: "0 0 1rem 0", color: T.text, fontSize: "1.1rem" }}>User Management</h3>
      <input 
        type="text" 
        placeholder="Search users..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "0.8rem", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, color: T.text, marginBottom: "1rem" }}
      />
      
      {loading ? (
        <p style={{ color: T.textMuted }}>Loading users...</p>
      ) : error ? (
        <p style={{ color: T.danger }}>{error}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", color: T.text }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Email</th>
                <th style={{ padding: "10px" }}>Role</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: `1px solid ${T.border}50` }}>
                  <td style={{ padding: "10px" }}>{u.fullName || u.email.split("@")[0]}</td>
                  <td style={{ padding: "10px", color: T.textMuted }}>{u.email}</td>
                  <td style={{ padding: "10px" }}>
                    <select 
                      value={u.role} 
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: 4, background: T.bgAlt, color: T.text, border: `1px solid ${T.border}` }}
                    >
                      <option value="user">User</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="ngo">NGO</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: 12, 
                      fontSize: "0.75rem", 
                      fontWeight: "bold",
                      background: u.isActive ? T.successPale : T.dangerPale,
                      color: u.isActive ? T.success : T.danger 
                    }}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button 
                      onClick={() => toggleStatus(u._id)}
                      style={{ padding: "4px 10px", borderRadius: 6, background: u.isActive ? T.danger : T.success, color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p style={{ color: T.textMuted, padding: "1rem", textAlign: "center" }}>No users found.</p>}
        </div>
      )}
    </div>
  );
}
