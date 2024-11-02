import { useEffect, useRef } from "react";
import moment from "moment";
import { useAppStore } from "../../../../../../store";
import { apiClient } from "../../../../../../lib/api-client";
import { GET_ALL_MESSAGES_ROUTE } from "../../../../../../../utils/constants";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages, directMessagesContacts, setDirectMessagesContacts } = useAppStore();
  
  // console.log(selectedChatData);
  // console.log(directMessagesContacts);

  const removeFromContactListIfNoMessages = (contactId) => {
    const updatedContacts = directMessagesContacts.filter(contact => contact._id !== contactId);
    setDirectMessagesContacts(updatedContacts);
  }

  const addIfNotInContactList = (contact) => {
    const contactExists = directMessagesContacts.find(c => c._id === contact._id);
    if(!contactExists) {
      setDirectMessagesContacts([...directMessagesContacts, contact]);
    }
  }

  useEffect(()=> {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE,
        {id: selectedChatData.contact._id},
        {withCredentials: true});

        if(response.data.messages) {
          (response.data.messages.length === 0) 
          ? removeFromContactListIfNoMessages(selectedChatData.contact._id) 
          : addIfNotInContactList(selectedChatData.contact);
          
          setSelectedChatMessages(response.data.messages);
        }
      }
      catch (err) {
        console.log(err);
      }
    };

    if(selectedChatData.contact._id) {
      if(selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages, addIfNotInContactList, removeFromContactListIfNoMessages]);

  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollIntoView({behaviour: "smooth"});
    }
  }, [selectedChatMessages])

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {
            selectedChatType === "contact" && renderDMMessage(message)
          }
        </div>
      )
    });
  };

  const renderDMMessage = (message) => (
    <div className={`${message.sender === selectedChatData.contact._id ? "text-left" : "text-right"}`}>
      {message.messageType === "text" && (
        <div 
        className={`${message.sender !== selectedChatData.contact._id 
                  ? "bg-[#8417ff]/5 text-[#ffffff]/90 border-[#8417ff]/50" 
                  : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block rounded p-4 my-1 max-w-[50%] break-words`}
                  style={{whiteSpace: "pre-wrap"}}
        >
        {message.content}
      </div>)}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-scroll scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}/>
    </div>
  );
};

export default MessageContainer;