import User from "../models/UserModel.js";
import createToken from "../utils/jwt.js";
import { compare } from "bcrypt";

export const signup = async (request, response, next) => {
    try {
        const {email, password} = request.body;
        if(!email || !password) {
            return response.status(400).send("Please enter all fields");
        }

        const user = await User.create({email, password});
        response.cookie("jwt", createToken(email, user.id), {
            maxAge : 3 * 24 * 60 * 60 * 1000,       // 3 days
            secure : true,
            sameSite : "None"
        });

        return response.status(201).json({user : {
            id: user.id,
            email: user.email,
            profileSetups: user.profileSetups,
        }});
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send("Internal Server Error Occured");
    }
};

export const login = async (request, response, next) => {
    try {
        const {email, password} = request.body;
        if(!email || !password) {
            return response.status(400).send("Please enter all fields");
        }

        const user = await User.findOne({email});
        if(!user) {
            return response.status(400).send("User does not exist");
        }

        const auth = await compare(password, user.password);
        if(!auth) {
            return response.status(400).send("Invalid credentials");
        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge : 3 * 24 * 60 * 60 * 1000,       // 3 days
            secure : true,
            sameSite : "None"
        });

        return response.status(200).json({
            user : {
                id: user.id,
                email: user.email,
                profileSetups: user.profileSetups,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send("Internal Server Error Occured");
    }
};

