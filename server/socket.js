import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = ( server ) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        for(const [userId, socketId] of userSocketMap.entries()) {
            if(socketId === socket.id) {
                userSocketMap.delete(userId);
                // console.log(`User with userId: ${userId} disconnected`);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        if (!message.sender || !message.recipient) {
            console.error("Error: 'sender' or 'recipient' is missing in message data.");
            console.log(message);
            return;
        }

        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

        if(recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }

        if(senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if(userId) {
            userSocketMap.set(userId, socket.id);
            // console.log(`User connected with socket id: ${socket.id}`);
        }
        else {
            console.log("UserId not found in socket query");
        }
        
        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};


export default setupSocket;