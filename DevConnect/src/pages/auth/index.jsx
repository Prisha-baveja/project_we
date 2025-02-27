import Background from '@/assets/login2.png';
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import BG from "@/assets/BG.jpg"
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

function Auth() {

  const navigate = useNavigate();
  const { setUserInfo, resetChatState } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const validateLogin = () => {
    if(!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if(!password.length) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if(!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if(!password.length) {
      toast.error("Password is required!");
      return false;
    }
    if(password !== confirmPassword) {
      toast.error("Password and confirm password should be same!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if(validateLogin()) {
        const response = await apiClient.post(LOGIN_ROUTE,
          {email, password},
          { withCredentials: true }
        );

        if(response.data.user.id) {
          resetChatState();
          setUserInfo(response.data.user);
          if(response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      }
    }
    catch (error) {
      toast(error.response.data);
    }
  };

  const handleSignup = async () => {
    if(validateSignup()) {
      const response = await apiClient.post(SIGNUP_ROUTE, 
        {email, password},
        { withCredentials: true }
      );

      if(response.status === 201) {
        resetChatState();
        setUserInfo(response.data.user);
        navigate("/profile");
      }
    }
  };

  return (
    <div className="relative h-[100vh] w-[100vw] flex items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${BG})`,
          filter: 'blur(3px)', 
          transform: 'scale(1.1)', 
          backgroundSize: 'cover', 
          zIndex: '-1', 
        }}>
      </div>

      <div className="h-[80vh] bg-[#134376] border-2 border-[#00356F] text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl text-white">Welcome</h1>
              <img src={Victory} alt = "Victory Emoji" className='h-[100px]'/>
            </div>
            <p className='font-medium text-center text-white'>Fill in the details to get started!</p>
          </div>
          
          <div className='flex items-center justify-center w-full'>
            <Tabs className='w-3/4' defaultValue='login'>
              <TabsList className="bg-transparent w-full rounded-none">
                <TabsTrigger
                className='data-[state=active]:bg-transparent text-white text-opacity-90 border-b-2 rounded-none w-[50%] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-blue-500 p-3 transition-all duration-300'
                value = "login">
                  Login
                </TabsTrigger>
                <TabsTrigger 
                className='data-[state=active]:bg-transparent text-white text-opacity-90 border-b-2 rounded-none w-[50%] data-[state = active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300'
                value='signup'>
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent className='flex flex-col gap-5 mt-10' value='login'>
                <Input placeholder = "Email" 
                type = "email" 
                className="rounded-full p-6" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <Input placeholder = "Password" 
                type = "password" 
                className="rounded-full p-6" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6 bg-black" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className='flex flex-col gap-5' value='signup'>
              <Input placeholder = "Email" 
                type = "email" 
                className="rounded-full p-6" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <Input placeholder = "Password" 
                type = "password" 
                className="rounded-full p-6" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <Input placeholder = "Confirm Password" 
                type = "password" 
                className="rounded-full p-6" 
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6 bg-black" onClick={handleSignup}>
                  Sign-Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className='hidden xl:flex justify-center items-center'>
          <img src={Background} alt = "BG" className='h-[650px]'/>
        </div>
      </div>
    </div>
  )
}

export default Auth