import { Link } from 'react-router-dom';
import { FaBook, FaChartBar, FaCog, FaGraduationCap } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaChartBar className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/courses" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaBook className="mr-3" />
              <span>My Courses</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/progress" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaGraduationCap className="mr-3" />
              <span>Progress</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaCog className="mr-3" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

