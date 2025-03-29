import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlay, FaClock, FaStar } from 'react-icons/fa';
import Navbar from './Navbar';
import { BASE_URL } from "../config.js";
// Use axios or fetch to get course data from the backend
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Web Development', 'Programming', 'Data Science', 'Design'];

  // Fetch courses data from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses`); // Make sure the URL is correct
        console.log('Fetched courses:', response.data); // Log the response
        setCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err); // Log error if fetching fails
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, []);
  

  const filteredCourses = courses.filter(course =>
    (selectedCategory === 'All' || course.category === selectedCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-8">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Our Courses</h1>
        
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="relative mb-4 md:mb-0 md:w-1/2">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="relative md:w-1/4">
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <Link to={`/course/${course._id}`} key={course._id} 
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative">
                <img src={course.imageLink} alt={course.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {course.category || 'General'}
                  </span>
                  <span className="text-lg font-bold text-indigo-600">${course.price}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaPlay className="mr-1" />
                    <span>{course.lectures} lectures</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{course.rating || '4.5'}</span>
                    </div>
                    <span className="text-sm text-gray-600">{course.students.length} students enrolled</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-600 mt-8">No courses found. Try adjusting your search or filter.</p>
        )}
      </main>
    </div>
  );
};

export default Courses;
