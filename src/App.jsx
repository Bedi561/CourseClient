/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route,  Routes, useLocation } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import Navbar from './components/Navbar';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';
import SpecificCourse from './components/SpecificCourse';
import Profile from './components/Profile';
import Cart from './components/Cart';
import axios from 'axios';
import Courses from './components/Courses';
import { useEffect } from 'react';
import { userStates } from './store/atoms/user';
import { BASE_URL } from './config';
import CourseContent from './components/CourseContent';
import ProductivityHacks from './components/ProductivityHacks';
import useApiClient from './ApiClient'; // Import useApiClient to manage API calls and modal state

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          <InitUser />
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/productivityHacks" element={<ProductivityHacks />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/course/:courseId" element={<SpecificCourse />} />
            <Route path="/course/content/:id" element={<CourseContent />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/courses" element={<Courses/>} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </RecoilRoot>
  );
}


function InitUser() {
  const setUser = useSetRecoilState(userStates);
  const location = useLocation();
  const { setShowModal } = useApiClient(); // Get modal state from useApiClient

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken"); // ✅ Always accessible

      console.log("token from localStorage:", token);
      console.log("refreshToken from localStorage:", refreshToken);

      if (!token) {
        console.log("No token found. Aborting user data initialization.");
        setUser({ isLoading: false, userEmail: null });
        return;
      }

      setUser({ isLoading: true, userEmail: null });

      const fetchUserData = async (accessToken) => {
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + accessToken,
          },
        });

        console.log("User data response:", response.data);

        if (response.data.fullName) {
          setUser({ isLoading: false, userEmail: response.data.fullName });
          console.log("User data initialized successfully.");
        } else {
          setUser({ isLoading: false, userEmail: null });
          console.log("User data not found in response.");
        }
      };

      try {
        await fetchUserData(token);
      } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.response?.status === 401 && refreshToken) {
          console.warn("Access token expired. Attempting to refresh token...");

          try {
            const refreshResponse = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
            const newToken = refreshResponse.data.accessToken;
            localStorage.setItem("token", newToken); // Update stored access token

            console.log("New access token obtained:", newToken);
            console.log("Retrying user data fetch with new access token...");

            await fetchUserData(newToken);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError.message);
            console.error("Refresh token might be invalid or expired.");
            setShowModal(true); // Show token expired modal
          }
        } else {
          console.error("Non-refreshable error occurred during user data fetch:", error.message);
          setUser({ isLoading: false, userEmail: null });
        }
      }
    };

    initUser();
  }, [location, setUser, setShowModal]);

  return null;
}




export default App;

