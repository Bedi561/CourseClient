import { useState, useEffect } from 'react';
import { FaBook, FaCertificate, FaClock, FaChevronRight, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import Navbar from './Navbar';
import axios from 'axios'; // Import axios to make API requests
import { BASE_URL } from '../config'; // Import your base URL
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PropTypes from 'prop-types';

const Dashboard = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);  // Default to an empty array
  const [completedCourses, setCompletedCourses] = useState([]);  // Default to an empty array
  const [learningHours, setLearningHours] = useState(0);  // Default to 0 hours
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch the user's purchased courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/purchased-courses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
        });

        const { purchased, completed, hours } = response.data;
        setPurchasedCourses(purchased || []);
        setCompletedCourses(completed || []);
        setLearningHours(hours || 0);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch your courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const navigateToCourseContent = (courseId) => {
    navigate(`/course/content/${courseId}`); // Navigate to the course content page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center">
            <FaGraduationCap className="mr-2" />
            Browse Courses
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={FaBook}
            title="Enrolled Courses"
            value={purchasedCourses.length}
            color="indigo"
            trend="+2 this month"
          />
          <StatCard
            icon={FaCertificate}
            title="Completed Courses"
            value={completedCourses.length}
            color="green"
            trend="+1 this month"
          />
          <StatCard
            icon={FaClock}
            title="Learning Hours"
            value={learningHours}
            color="yellow"
            trend="+5h this week"
          />
        </div>

        {/* Continue Learning Section */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Continue Learning</h2>
            <button className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
              View All
              <FaChevronRight className="ml-1" />
            </button>
          </div>

          {purchasedCourses.length > 0 ? (
            <div className="space-y-4">
              {purchasedCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <span className="text-sm text-gray-500">{course.hoursLeft} hours left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(course.progress / course.totalLectures) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaChartLine className="mr-2" />
                      <span>{Math.round((course.progress / course.totalLectures) * 100)}% Complete</span>
                    </div>
                    <button
                      className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center"
                      onClick={() => navigateToCourseContent(course._id)}
                    >
                      Continue
                      <FaChevronRight className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaGraduationCap className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No courses enrolled yet</p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                Browse Courses
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-300">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className={`p-2 rounded-lg bg-${color}-50`}>
        <Icon className={`text-${color}-600 text-xl`} />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
    <p className="text-sm text-gray-500">{trend}</p>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.string
};

export default Dashboard;
