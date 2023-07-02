import './App.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import Navbar from './components/common/Navbar'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from './pages/updatePassword'
import Dashboard from "./pages/Dashboard"
import MyProfile from './components/core/Dashboard/MyProfile'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor'
import AddCourse from './components/core/Dashboard/AddCourse'
import MyCourses from './components/core/Dashboard/MyCourses'
import EditCourse from './components/core/Dashboard/EditCourse'
import Settings from './components/core/Dashboard/Settings'
import Cart from './components/core/Dashboard/Cart'
import Error from './pages/Error'
import OpenRoute from './components/core/Auth/OpenRoute'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import { getUserDetails } from './services/operations/profileAPI'
import { ACCOUNT_TYPE } from "./utils/constants"
import Contact from './pages/Contact'
import Catalog from './pages/Catalog'
import CourseDetails from './pages/CourseDetails'





function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <>
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path="catalog/:catalogName" element={<Catalog/>} />
        <Route path="courses/:courseId" element={<CourseDetails/>} />
        <Route path = "/about" element = {<About/>}/>
        <Route path = "/contact" element = {<Contact/>}/>
        <Route path = "/login" element = {
        <OpenRoute>
          <Login />
        </OpenRoute>}/>
           <Route path = "/signup" element = {
          <OpenRoute>
            <SignUp/>
         </OpenRoute>
        }/>
        <Route path="verify-email" element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }/>
         <Route path="forgot-password"
         element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        {/* Private Route - for Only Logged in User */}
          <Route element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />

            {/* Route only for Instructors */}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
          
              
            </>
          )}
          
           {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          <Route path="dashboard/Settings" element={<Settings />} />
        </Route>
         {/* For the watching course lectures */}
         <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>
        <Route path = "*" element = {<Error/>}/>
      </Routes>
    </div>
    </>
  )
}




export default App

