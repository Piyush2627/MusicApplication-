import { useNavigate } from "react-router-dom";

const TopNavBar = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate to previous page
  };

  return (
    <nav className="flex w-full items-center justify-between bg-white px-4 py-2 shadow-md dark:bg-gray-900">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center text-gray-700 hover:text-blue-500 dark:text-gray-200"
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Profile Image */}
    </nav>
  );
};

export default TopNavBar;
