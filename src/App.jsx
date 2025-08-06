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
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
