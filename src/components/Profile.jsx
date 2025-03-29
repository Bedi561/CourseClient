/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaGraduationCap, FaEdit, FaMapMarkerAlt, FaGithub, FaLinkedin, FaSave, FaTimes, FaUser, FaBriefcase } from 'react-icons/fa';
import Navbar from './Navbar';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    education: [
      { degree: '', school: '', year: '' },
      { degree: '', school: '', year: '' }
    ],
    bio: '',
    skills: [],
    github: '',
    linkedin: ''
  });

  const navigate = useNavigate();

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newEducation = [...profile.education];
      newEducation[index] = { ...newEducation[index], [name]: value };
      setProfile({ ...profile, education: newEducation });
    } else if (name === 'skills') {
      setProfile({ ...profile, [name]: value.split(',').map(skill => skill.trim()) });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = () => {
    // Here you would typically send the profile data to a backend
    // For now, we'll just switch back to view mode
    setIsEditing(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getProfileImage = () => {
    if (imageError) {
      return "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || 'User') + "&background=6366f1&color=fff";
    }
    return profile.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || 'User') + "&background=6366f1&color=fff";
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data
    localStorage.removeItem('token'); // Adjust this based on your token storage
    navigate('/'); // Redirect to the sign-in page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FaUser className="text-2xl" />
                </div>
                <h1 className="text-3xl font-bold">My Profile</h1>
              </div>
              <div className="flex space-x-3">
                {!isEditing && (
                  <button 
                    onClick={toggleEdit} 
                    className="bg-white/10 hover:bg-white/20 text-white py-2.5 px-6 rounded-xl transition duration-300 flex items-center space-x-2"
                  >
                    <FaEdit className="text-lg" />
                    <span>Edit Profile</span>
                  </button>
                )}
                {isEditing && (
                  <div className="flex space-x-3">
                    <button 
                      onClick={saveProfile} 
                      className="bg-green-500 hover:bg-green-600 text-white py-2.5 px-6 rounded-xl transition duration-300 flex items-center space-x-2"
                    >
                      <FaSave className="text-lg" />
                      <span>Save</span>
                    </button>
                    <button 
                      onClick={toggleEdit} 
                      className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-6 rounded-xl transition duration-300 flex items-center space-x-2"
                    >
                      <FaTimes className="text-lg" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 rounded-xl transition duration-300 flex items-center space-x-2"
                >
                  <FaTimes className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <img 
                  src={getProfileImage()}
                  alt="Profile" 
                  className="w-40 h-40 rounded-2xl object-cover border-4 border-indigo-100 shadow-lg"
                  onError={handleImageError}
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300">
                    <FaEdit className="text-sm" />
                  </button>
                )}
              </div>
              <div className="text-center md:text-left flex-grow">
                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div className="relative">
                      <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="title"
                        value={profile.title}
                        onChange={handleChange}
                        placeholder="Your Title"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900">{profile.name || 'Your Name'}</h2>
                    <p className="text-xl text-gray-600 mt-2">{profile.title || 'Your Title'}</p>
                  </>
                )}
                <div className="mt-6 flex justify-center md:justify-start space-x-4">
                  {isEditing ? (
                    <div className="space-y-4 w-full">
                      <div className="relative">
                        <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="github"
                          value={profile.github}
                          onChange={handleChange}
                          placeholder="GitHub URL"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div className="relative">
                        <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="linkedin"
                          value={profile.linkedin}
                          onChange={handleChange}
                          placeholder="LinkedIn URL"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <a 
                        href={profile.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition duration-300"
                      >
                        <FaGithub className="text-2xl" />
                      </a>
                      <a 
                        href={profile.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition duration-300"
                      >
                        <FaLinkedin className="text-2xl" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Education Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-indigo-600 flex items-center">
                  <FaEnvelope className="mr-2" />
                  Contact Information
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="flex items-center text-gray-700">
                      <FaEnvelope className="mr-3 text-indigo-500" />
                      {profile.email || 'Your Email'}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FaPhone className="mr-3 text-indigo-500" />
                      {profile.phone || 'Your Phone'}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-3 text-indigo-500" />
                      {profile.location || 'Your Location'}
                    </p>
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-indigo-600 flex items-center">
                  <FaGraduationCap className="mr-2" />
                  Education
                </h3>
                {profile.education.map((edu, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="degree"
                            value={edu.degree}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Degree"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          />
                        </div>
                        <div className="relative">
                          <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="school"
                            value={edu.school}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="School"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          />
                        </div>
                        <div className="relative">
                          <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="year"
                            value={edu.year}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Year"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-900 font-medium">
                          <FaGraduationCap className="mr-3 text-indigo-500" />
                          {edu.degree || 'Your Degree'}
                        </p>
                        <p className="text-gray-600 ml-8">{edu.school || 'Your School'}, {edu.year || 'Year'}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Bio</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Your bio"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 min-h-[120px]"
                  rows="4"
                ></textarea>
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio || 'Your bio goes here. Tell us about yourself, your experience, and your passions.'}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Skills</h3>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    name="skills"
                    value={profile.skills.join(', ')}
                    onChange={handleChange}
                    placeholder="Your skills (comma-separated)"
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? profile.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-100 transition duration-200"
                    >
                      {skill}
                    </span>
                  )) : (
                    <span className="text-gray-500 italic">Add your skills here</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;


