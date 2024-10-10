import { Button } from '@/components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'

const PrivateRoutes = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to='/auth' />;
};

const AuthRoutes = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to='/chat' /> : children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<Auth/>} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='/profile' element={<Profile/>} />

          <Route path='*' element={<Navigate to='/auth'/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App
