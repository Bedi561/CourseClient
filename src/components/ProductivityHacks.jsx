import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaStopwatch, FaClipboardList, FaListOl, FaFrog, FaChartLine, FaCheckSquare, FaTable, FaLayerGroup, FaTimes, FaLightbulb } from 'react-icons/fa';
import Navbar from './Navbar';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title = '', author = '', description = '', icon = null, steps = [] }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sm text-gray-600">by {author}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">{description}</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">How to implement:</h3>
              <ol className="space-y-3">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center text-blue-900">
                <FaLightbulb className="text-yellow-500 mr-2" />
                Pro Tip
              </h4>
              <p className="text-blue-800">{`Try combining ${title} with other productivity techniques for maximum efficiency!`}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ProductivityTip = ({ title, author, description, icon, onClick, steps }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    onClick={onClick}
  >
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-blue-50 rounded-xl mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">by {author}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-blue-600 text-sm font-medium">Click for details</span>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {steps.length} steps
        </span>
      </div>
    </div>
  </motion.div>
);

const ProductivityHacks = () => {
  const [selectedTip, setSelectedTip] = useState(null);

  const tips = [
    {
      title: "Timeboxing",
      author: "Marc Zao-Sanders",
      description: "Divide the day into blocks of time, assign each block a specific task, and do nothing else during that block.",
      icon: <FaClock className="text-blue-500 text-2xl" />,
      steps: [
        "List all tasks for the day",
        "Estimate time needed for each task",
        "Assign specific time blocks to each task",
        "Set alarms or notifications for each time block",
        "Focus solely on the assigned task during each time block",
        "Review and adjust your timeboxes regularly"
      ]
    },
    {
      title: "Pomodoro Technique",
      author: "Francesco Cirillo",
      description: "Work for 25 minutes, then take a 5-minute break. Repeat.",
      icon: <FaStopwatch className="text-red-500 text-2xl" />,
      steps: [
        "Choose a task to work on",
        "Set a timer for 25 minutes",
        "Work on the task until the timer rings",
        "Take a 5-minute break",
        "Repeat steps 2-4 four times",
        "After four pomodoros, take a longer 15-30 minute break"
      ]
    },
    {
      title: "2-Minute Rule",
      author: "David Allen",
      description: "If a task takes less than 2 minutes, do it immediately.",
      icon: <FaClock className="text-green-500 text-2xl" />,
      steps: [
        "Identify a task that needs to be done",
        "Estimate if it will take less than 2 minutes",
        "If yes, do it immediately",
        "If no, schedule it for later or delegate it",
        "Repeat this process throughout your day",
        "Regularly review your task list for new 2-minute tasks"
      ]
    },
    {
      title: "Kanban Board",
      author: "Taiichi Ohno",
      description: "Categorize tasks visually: To-Do | Working On | Completed",
      icon: <FaClipboardList className="text-purple-500 text-2xl" />,
      steps: [
        "Create a board with three columns: To-Do, In Progress, Done",
        "Write each task on a separate card or sticky note",
        "Place all tasks in the To-Do column",
        "Move tasks to In Progress when you start working on them",
        "Move completed tasks to the Done column",
        "Regularly review and update your board"
      ]
    },
    {
      title: "1-3-5 Rule",
      author: "Unknown",
      description: "Plan your day with 1 big task, 3 medium tasks, and 5 small tasks.",
      icon: <FaListOl className="text-orange-500 text-2xl" />,
      steps: [
        "Identify one major task for the day",
        "Choose three medium-sized tasks",
        "Select five small, quick tasks",
        "Write down all nine tasks",
        "Start with the big task, then move to medium and small tasks",
        "Review your progress at the end of the day"
      ]
    },
    {
      title: "Eat the Frog",
      author: "Brian Tracy",
      description: "Do your most challenging task first thing in the day.",
      icon: <FaFrog className="text-green-600 text-2xl" />,
      steps: [
        "Identify your most challenging or important task",
        "Schedule it for first thing in the morning",
        "Prepare everything you need the night before",
        "Start working on the task immediately upon starting your day",
        "Focus solely on this task until it's completed",
        "Reflect on your accomplishment and plan for tomorrow"
      ]
    },
    {
      title: "Flowtime Technique",
      author: "Zoe Read-Bivens",
      description: "Work until you lose focus, take a short break, and adjust future sessions to your natural flow.",
      icon: <FaChartLine className="text-blue-600 text-2xl" />,
      steps: [
        "Choose a task to work on",
        "Start a timer and begin working",
        "Work until you feel your focus waning",
        "Stop the timer and record your work time",
        "Take a short break (5-30 minutes)",
        "Repeat the process, adjusting work times based on your natural rhythm"
      ]
    },
    {
      title: "80/20 Rule",
      author: "Vilfredo Pareto",
      description: "Focus on the vital 20% of your tasks, eliminate or reduce the trivial 80%.",
      icon: <FaChartLine className="text-purple-600 text-2xl" />,
      steps: [
        "List all your tasks or goals",
        "Identify the top 20% that will produce 80% of your results",
        "Prioritize these high-impact tasks",
        "Allocate most of your time and resources to these tasks",
        "Delegate, automate, or eliminate low-impact tasks where possible",
        "Regularly review and adjust your task list"
      ]
    },
    {
      title: "Getting Things Done (GTD)",
      author: "David Allen",
      description: "Capture | Clarify | Organize | Reflect | Engage",
      icon: <FaCheckSquare className="text-teal-500 text-2xl" />,
      steps: [
        "Capture: Write down or collect every task, idea, or project",
        "Clarify: Process what each item means and what action it requires",
        "Organize: Put items where they belong (calendar, task list, etc.)",
        "Reflect: Regularly review and update your lists",
        "Engage: Take action on your tasks",
        "Consistently apply these steps to maintain productivity"
      ]
    },
    {
      title: "Warren Buffett's 25/5 Rule",
      author: "Warren Buffett",
      description: "List your top 25 goals, prioritize them, focus only on the top 5, ignore the rest.",
      icon: <FaListOl className="text-yellow-600 text-2xl" />,
      steps: [
        "Write down your top 25 career or life goals",
        "Circle the 5 most important goals",
        "Create a plan to achieve these top 5 goals",
        "Consider the remaining 20 goals as distractions",
        "Focus exclusively on your top 5 goals",
        "Regularly review and adjust your goals as needed"
      ]
    },
    {
      title: "Eisenhower Matrix",
      author: "Dwight D. Eisenhower",
      description: "Categorize tasks: Urgent & Important, Urgent & Not Important, Not Urgent & Important, Not Urgent & Not Important",
      icon: <FaTable className="text-red-600 text-2xl" />,
      steps: [
        "Create a 2x2 grid with Urgent/Not Urgent and Important/Not Important axes",
        "List all your tasks",
        "Categorize each task into one of the four quadrants",
        "Do urgent and important tasks immediately",
        "Schedule important but not urgent tasks",
        "Delegate urgent but not important tasks",
        "Eliminate tasks that are neither urgent nor important"
      ]
    },
    {
      title: "Task Batching",
      author: "Cal Newport",
      description: "Group similar tasks, schedule them together, work on them in one session.",
      icon: <FaLayerGroup className="text-indigo-500 text-2xl" />,
      steps: [
        "Identify similar or related tasks",
        "Group these tasks together",
        "Schedule specific time blocks for each batch of tasks",
        "Eliminate distractions during your batching sessions",
        "Work through each batch of tasks consecutively",
        "Take short breaks between batches to maintain focus"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">12 Productivity Hacks to Master Your Time</h1>
          <p className="text-lg text-gray-600">Discover proven techniques to boost your productivity and make the most of your time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <ProductivityTip key={index} {...tip} onClick={() => setSelectedTip(tip)} />
          ))}
        </div>

        <Modal
          isOpen={!!selectedTip}
          onClose={() => setSelectedTip(null)}
          {...selectedTip || {}}
        />
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.element,
  steps: PropTypes.arrayOf(PropTypes.string)
};

Modal.defaultProps = {
  title: '',
  author: '',
  description: '',
  icon: null,
  steps: []
};

ProductivityTip.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ProductivityHacks;

