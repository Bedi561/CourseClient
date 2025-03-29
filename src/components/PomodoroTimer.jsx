import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaCog, FaTimes, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PomodoroIntro from './PomodoroIntro';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customTime, setCustomTime] = useState({ focus: 25, break: 5 });
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval);
          setIsActive(false);
          if (!isBreak) {
            setIsBreak(true);
            setMinutes(customTime.break);
            setSeconds(0);
            setPomodoroCount(prev => prev + 1);
            showNotificationMessage();
          } else {
            setIsBreak(false);
            setMinutes(customTime.focus);
            setSeconds(0);
            showNotificationMessage();
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, customTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(customTime.focus);
    setSeconds(0);
  };

  const showNotificationMessage = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const progress = isBreak
    ? ((customTime.break * 60 - (minutes * 60 + seconds)) / (customTime.break * 60)) * 100
    : ((customTime.focus * 60 - (minutes * 60 + seconds)) / (customTime.focus * 60)) * 100;

  const handleCustomTimeChange = (type, value) => {
    if (value >= 1 && value <= 60) {
      setCustomTime(prev => ({
        ...prev,
        [type]: value
      }));
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200"
        aria-label="Toggle Pomodoro Timer"
      >
        <FaClock size={20} />
      </button>

      {/* Main Timer Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-4 z-50 w-72 bg-white rounded-lg shadow-xl border border-gray-200"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-indigo-600" />
                  <span className="font-medium text-gray-800">
                    {isBreak ? 'Break Time' : 'Focus Time'}
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Timer Display */}
              <div className="text-3xl font-bold text-gray-800 text-center mb-2">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: "100%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={toggleTimer}
                  className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                  aria-label={isActive ? 'Pause' : 'Play'}
                >
                  {isActive ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                  aria-label="Reset"
                >
                  <FaRedo size={16} />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                  aria-label="Settings"
                >
                  <FaCog size={16} />
                </button>
              </div>

              {/* Pomodoro Count */}
              <div className="text-xs text-gray-500 text-center mt-2">
                Completed: {pomodoroCount}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Timer Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={customTime.focus}
                    onChange={(e) => handleCustomTimeChange('focus', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={customTime.break}
                    onChange={(e) => handleCustomTimeChange('break', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    max="60"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            {isBreak ? 'Break time is over! Time to focus!' : 'Focus time is over! Take a break!'}
          </motion.div>
        )}
      </AnimatePresence>

      <PomodoroIntro />
    </>
  );
};

export default PomodoroTimer;

