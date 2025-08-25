import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RegisterAdmin from './pages/RegisterAdmin';
import RegisterUser from './pages/RegisterUser';
import UpdateProfileAdmin from './pages/UpdateProfileAdmin';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoutes';
import Home from './pages/Home';
import UpdateProfileUser from './pages/UpdateProfileUser';
import EventDetail from './pages/EventDetail';
import ValidateCertificate from './pages/ValidateCertificate';
import MyEvents from './pages/MyEvents';
import MyActivities from './pages/MyActivities';
import MyCertificates from './pages/MyCertificates';
import ForgetPassword from './pages/ForgetPassword';
import CreateEvent from './pages/CreateEvent';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home></Home>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/register' element={<RegisterUser></RegisterUser>}></Route>
            <Route path='/register/admin' element={<PrivateRoute requiredRole="admin"><RegisterAdmin></RegisterAdmin></PrivateRoute>}></Route>
            <Route path='/update/admin' element={<PrivateRoute requiredRole="admin"><UpdateProfileAdmin></UpdateProfileAdmin></PrivateRoute>}></Route>
            <Route path='/update/user' element={<PrivateRoute requiredRole="user"><UpdateProfileUser></UpdateProfileUser></PrivateRoute>}></Route>
            <Route path='/event/:id_event' element={<EventDetail></EventDetail>}></Route>
            <Route path='/validate' element={<ValidateCertificate></ValidateCertificate>}></Route>
            <Route path='/my/events' element={<PrivateRoute requiredRole="user"><MyEvents></MyEvents></PrivateRoute>}></Route>
            <Route path='/:id_event/my/activities' element={<PrivateRoute requiredRole="user"><MyActivities></MyActivities></PrivateRoute>}></Route>
            <Route path='/my/certificate' element={<PrivateRoute requiredRole="user"><MyCertificates></MyCertificates></PrivateRoute>}></Route>
            <Route path='/forget/password' element={<ForgetPassword></ForgetPassword>}></Route>
            <Route path='/event/create' element={<PrivateRoute requiredRole="admin"><CreateEvent></CreateEvent></PrivateRoute>}></Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
