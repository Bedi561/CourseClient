import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const PomodoroIntro = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenPomodoroIntro');
    if (!hasSeenIntro) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenPomodoroIntro', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-lg z-50 w-64">
      <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <FaTimes />
      </button>
      <h3 className="text-lg font-semibold mb-2">Pomodoro Timer</h3>
      <p className="text-sm text-gray-600">
        Use this timer to manage your study sessions. Click play to start a 25-minute focus session, followed by a 5-minute break.
      </p>
    </div>
  );
};

export default PomodoroIntro;

