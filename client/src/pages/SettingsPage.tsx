import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <button
        onClick={handleLogout}
        className="mt-4 rounded-md bg-red-500 p-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default SettingsPage;
