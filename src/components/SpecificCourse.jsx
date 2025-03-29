import { useState, useEffect } from 'react';
import { FaStar, FaPlay, FaBook, FaClock, FaAward, FaList } from 'react-icons/fa';
import Modal from './Modal';
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config.js';

const SpecificCourse = () => {
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams(); // Get courseId from the URL
  const navigate = useNavigate();

  // Log courseId from URL
  console.log("Course ID from URL:", courseId);

  // Fetch the course details from the backend
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        console.log("Fetching course details...");
        const response = await axios.get(`${BASE_URL}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Add your JWT token if needed
          }
        });
        console.log('Fetched course details:', response.data);
        console.log('Course modules:', response.data.course.modules);
        setCourse(response.data.course); // Set course data
        setIsEnrolled(response.data.isPurchased); // Set purchase status
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to fetch course details');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    } else {
      console.error("Course ID is undefined or invalid.");
    }
  }, [courseId]);

  const handleEnroll = async () => {
    console.log("Enrolling in course with ID:", courseId);

    try {
      const token = localStorage.getItem('token'); // Assume token is stored in local storage
      if (!token) {
        throw new Error('User is not authenticated');
      }

      console.log("Sending enrollment request with courseId:", courseId);
      const response = await axios.put(
        `${BASE_URL}/enroll`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      if (response.status === 200) {
        console.log("Enrollment successful:", response.data);
        setIsEnrolled(true);
        setShowModal(true);
      } else {
        console.error("Failed to enroll in the course:", response.data);
        setError('Failed to enroll in the course');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in the course');
    }
  };

  const navigateToCourseContent = () => {
    console.log("Navigating to course content...");
    setShowModal(false);
    navigate(`/course/content/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-8">Loading course details...</div>
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-8">Course not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 md:h-96 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">{course.title}</h1>
            </div>
          </div>

          {/* Course Info */}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="font-bold mr-2">{course.rating}</span>
                <span className="text-gray-600">({course.students.length} students)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaPlay className="mr-2" />
                <span>{course.lectures} lectures</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaBook className="mr-2" />
                <span>{course.level}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">{course.description}</p>

            {/* Course Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <FaClock className="text-indigo-600 mr-4 text-2xl" />
                <div>
                  <h4 className="font-semibold text-gray-800">Course Duration</h4>
                  <p className="text-gray-600">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <FaPlay className="text-indigo-600 mr-4 text-2xl" />
                <div>
                  <h4 className="font-semibold text-gray-800">Total Lectures</h4>
                  <p className="text-gray-600">{course.lectures} lectures</p>
                </div>
              </div>
              <div className="flex items-center bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <FaBook className="text-indigo-600 mr-4 text-2xl" />
                <div>
                  <h4 className="font-semibold text-gray-800">Course Level</h4>
                  <p className="text-gray-600">{course.level}</p>
                </div>
              </div>
              <div className="flex items-center bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <FaAward className="text-indigo-600 mr-4 text-2xl" />
                <div>
                  <h4 className="font-semibold text-gray-800">Certificate</h4>
                  <p className="text-gray-600">Certificate of completion</p>
                </div>
              </div>
            </div>

            {/* Roadmap Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowRoadmapModal(true)}
                className="flex items-center bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition duration-300 shadow-sm hover:shadow-md"
              >
                <FaList className="mr-2" />
                <span className="font-semibold">View Course Roadmap</span>
              </button>
            </div>

            {/* Enrollment Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl">
              <div>
                <span className="text-4xl font-bold text-indigo-600">${course.price}</span>
                <p className="text-gray-600 mt-1">One-time payment</p>
              </div>
              {isEnrolled ? (
                <span className="bg-green-600 text-white py-3 px-8 rounded-xl font-semibold">Enrolled</span>
              ) : (
                <button
                  className="bg-indigo-600 text-white py-3 px-8 rounded-xl hover:bg-indigo-700 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Enrollment Successful!</h2>
          <p className="text-lg mb-6">Congratulations! You have successfully enrolled in &quot;{course.title}&quot;.</p>
          <p className="mb-8">You can now access the course content and start your learning journey.</p>
          <button
            className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300 text-lg font-semibold w-full"
            onClick={navigateToCourseContent}
          >
            Start Learning
          </button>
        </div>
      </Modal>
      <Modal isOpen={showRoadmapModal} onClose={() => setShowRoadmapModal(false)}>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Course Journey</h2>
              <button 
                onClick={() => setShowRoadmapModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              <div className="space-y-8">
                {course.roadmap?.map((milestone, index) => (
                  <div key={index} className="relative">
                    {/* Connecting Line */}
                    {index !== course.roadmap.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    <div className="flex gap-6">
                      {/* Left Timeline */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-800">
                            {milestone.milestone}
                          </h3>
                          <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            <FaClock className="text-xs" />
                            {milestone.estimatedCompletionTime}h
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-4">
                          {milestone.description}
                        </p>

                        {/* Collapsible Content */}
                        <div className="space-y-4">
                          {/* Lessons */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <FaBook className="text-indigo-600" />
                              Included Lessons
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {milestone.lessonsIncluded.map((lessonIndex) => (
                                <div 
                                  key={lessonIndex}
                                  className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm"
                                >
                                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <FaPlay className="text-indigo-600 text-xs" />
                                  </div>
                                  <span className="text-sm text-gray-700">
                                    {course.lessons[lessonIndex].title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Project */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <FaAward className="text-green-600" />
                              Project Deliverable
                            </h4>
                            <p className="text-gray-700 text-sm bg-white bg-opacity-50 p-3 rounded-md">
                              {milestone.projectDeliverables}
                            </p>
                          </div>

                          {/* Progress */}
                          <div className="flex items-center gap-4">
                            <div className="flex-grow">
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-indigo-600 rounded-full" />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-500">0%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Total Duration: {course.roadmap?.reduce((acc, curr) => acc + curr.estimatedCompletionTime, 0)} hours
                </div>
                <button
                  onClick={() => setShowRoadmapModal(false)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpecificCourse;
