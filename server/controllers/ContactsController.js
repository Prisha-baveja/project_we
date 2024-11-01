import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
    try {
        const {searchTerm} = request.body;

        if(searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("Search Term is required");
        }

        const regexTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        const regex = new RegExp(regexTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id : { $ne: request.userId } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
                },
            ],          // if id!=userId then only show     ;    contains all contacts
        });

        return response.status(200).json({contacts});
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send("Internal Server Error Occured");
    }
};
