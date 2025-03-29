/* eslint-disable no-unused-vars */
import  { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPlayCircle, FaFile, FaCheckCircle, FaLock, FaBars, FaPlay, FaPause, FaClock } from 'react-icons/fa';
import Navbar from './Navbar';
import axios from 'axios';
import { BASE_URL } from '../config';
import PomodoroTimer from './PomodoroTimer';

const VideoPlayer = ({ videoUrl, title }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to extract YouTube ID
  const getYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Function to check if it's a direct video file
  const isDirectVideoFile = (url) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
  };

  // Function to check if it's a YouTube link
  const isYouTubeLink = (url) => getYouTubeID(url) !== null;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case " ":
          e.preventDefault(); // Prevent page scroll
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipVideo(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipVideo(5);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipVideo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // **Render Logic: Handle Different Video Types**
  return (
    <div className="relative w-full">
      {isYouTubeLink(videoUrl) ? (
        // Render YouTube Video
        <iframe
          className="w-full rounded-md"
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${getYouTubeID(videoUrl)}`}
          title={title}
          allowFullScreen
        ></iframe>
      ) : isDirectVideoFile(videoUrl) ? (
        // Render Direct Video File
        <video
          ref={videoRef}
          className="w-full rounded-md"
          src={videoUrl}
          title={title}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        // Render Generic Embedded Video (Google Drive, Dropbox, etc.)
        <iframe
          className="w-full rounded-md"
          width="100%"
          height="400"
          src={videoUrl}
          title={title}
          allowFullScreen
        ></iframe>
      )}

      {/* Play/Pause Indicator */}
      {!isYouTubeLink(videoUrl) && isDirectVideoFile(videoUrl) && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {isPlaying ? "Playing" : "Paused"}
        </div>
      )}
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
const CourseContent = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { course: fetchedCourse } = response.data;
        setCourse(fetchedCourse);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleLessonCompletion = (lessonIndex) => {
    const lessonId = `${lessonIndex}`;
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!course) {
    return <div className="flex items-center justify-center h-screen text-xl text-gray-500">Loading...</div>;
  }

  const currentLesson = course.lessons[activeLesson];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <div
          className={`bg-white w-80 flex-shrink-0 overflow-y-auto shadow-lg transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <FaPlayCircle className="mr-2" />
                <span>{course.lessons.length} Lessons</span>
                <span className="mx-2">•</span>
                <span>{course.lessons.reduce((acc, curr) => acc + curr.duration, 0)} mins total</span>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Course Progress</span>
                <span className="text-sm font-medium text-indigo-600">
                  {Math.round((completedLessons.length / course.lessons.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {course.lessons.map((lesson, index) => (
                  <div key={index} className="mb-2">
                    <button
                      onClick={() => {
                        setActiveLesson(index);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        activeLesson === index
                          ? 'bg-indigo-50 border-indigo-100 border'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          completedLessons.includes(`${index}`)
                            ? 'bg-green-100'
                            : activeLesson === index
                            ? 'bg-indigo-100'
                            : 'bg-gray-100'
                        }`}>
                          {completedLessons.includes(`${index}`) ? (
                            <FaCheckCircle className="text-green-600" />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className={`font-medium mb-1 ${
                            activeLesson === index ? 'text-indigo-600' : 'text-gray-700'
                          }`}>
                            {lesson.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaClock className="mr-1 text-xs" />
                            <span>{lesson.duration} mins</span>
                            {lesson.videoLink && (
                              <>
                                <span className="mx-2">•</span>
                                <FaPlayCircle className="mr-1 text-xs" />
                                <span>Video</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Completed: {completedLessons.length}/{course.lessons.length}</span>
                <button 
                  onClick={() => setCompletedLessons([])}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={toggleSidebar}
                >
                  <FaBars size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{course.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Lesson {activeLesson + 1} of {course.lessons.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <FaClock className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {currentLesson.duration} mins
                  </span>
                </div>
                <div className="w-64">
                  <PomodoroTimer />
                </div>
              </div>
            </div>
          </header>

          {/* Content Viewer */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Video Section */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                  {currentLesson.videoLink ? (
                    <VideoPlayer 
                      videoUrl={currentLesson.videoLink}
                      title={currentLesson.title}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <FaFile className="mr-2" />
                      <span>No video content available</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {currentLesson.title}
                      </h2>
                      <p className="text-gray-600">
                        {currentLesson.content || 'No description available.'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleLessonCompletion(activeLesson)}
                      className={`flex-shrink-0 inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                        completedLessons.includes(`${activeLesson}`)
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {completedLessons.includes(`${activeLesson}`) ? (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Mark Complete
                        </>
                      )}
                    </button>
                  </div>

                  {/* Resources Section */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Lesson Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentLesson.videoLink && (
                        <a
                          href={currentLesson.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-white rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <FaPlayCircle className="text-indigo-600 mr-2" />
                          <span className="text-sm text-gray-600">Video Lecture</span>
                        </a>
                      )}
                      {/* Add more resource links as needed */}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        activeLesson === 0
                          ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      }`}
                      disabled={activeLesson === 0}
                    >
                      <FaPlay className="mr-2 rotate-180" />
                      Previous Lesson
                    </button>
                    <button
                      onClick={() => setActiveLesson(Math.min(course.lessons.length - 1, activeLesson + 1))}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        activeLesson === course.lessons.length - 1
                          ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                          : 'text-white bg-indigo-600 hover:bg-indigo-700'
                      }`}
                      disabled={activeLesson === course.lessons.length - 1}
                    >
                      Next Lesson
                      <FaPlay className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;

