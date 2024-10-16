import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store"
import { useEffect } from "react";
import { toast } from "sonner";

function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {;
    if(!userInfo.profileSetups) {
      
      toast("Please complete your profile setup to continue", "error");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  
  return (
    <>

    </>
  )
}

export default Chat