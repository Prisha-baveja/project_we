import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store"
import { useEffect } from "react";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

function Chat() {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {;
    if(!userInfo.profileSetups) {
      
      toast("Please complete your profile setup to continue", "error");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {
        selectedChatType === undefined 
        ? <EmptyChatContainer /> 
        : <ChatContainer />
      }
    </div>
  )
}

export default Chat