export const createChatSlice = (set, get) => ({
    selectedChatType : undefined,
    selectedChatData : undefined,
    selectedChatMessages : [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels : [],
    
    setSelectedChatType : (selectedChatType) => set({selectedChatType}),
    setSelectedChatData : (selectedChatData) => set({selectedChatData}),
    setSelectedChatMessages : (selectedChatMessages) => set({selectedChatMessages}),
    setDirectMessagesContacts: (directMessagesContacts) => set({directMessagesContacts}),
    setIsUploading: (isUploading) => set({isUploading}),
    setIsDownloading: (isDownloading) => set({isDownloading}),
    setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
    setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
    setChannels : (channels) => set({channels}),
    addChannel : (channel) => {
        const channels = get().channels;
        set({channels: [channel, ...channels]});
    },

    closedChat : () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
    }),

    resetChatState: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        // selectedChatMessages: [],
        directMessagesContacts: [],
    }),

    addMessage : (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;
        
        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient: 
                        selectedChatType === "channel" 
                        ? message.recipient 
                        : message.recipient._id,
                    sender: 
                        selectedChatType === "channel" 
                        ? message.sender 
                        : message.sender._id,
                },
            ],
        });
    },
});
