import { Webhook } from "svix";
import User from "../models/user.js";

export const clerkWebhook = async (req, res) => {
    try {
        // Get the headers
        const svix_id = req.headers["svix-id"];
        const svix_timestamp = req.headers["svix-timestamp"];
        const svix_signature = req.headers["svix-signature"];

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing required Svix headers"
            });
        }

        // Create a new Svix instance with your webhook secret
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        let evt;

        // Verify the webhook
        try {
            evt = wh.verify(req.rawBody, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return res.status(400).json({
                success: false,
                message: "Error verifying webhook"
            });
        }

        // Handle the webhook
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const eventType = evt.type;

        switch (eventType) {
            case 'user.created': {
                // Check if user already exists
                const existingUser = await User.findById(id);
                if (existingUser) {
                    console.log("User already exists:", id);
                    return res.status(200).json({ message: "User already exists" });
                }

                const userData = {
                    _id: id,
                    email: email_addresses[0].email_address,
                    name: `${first_name} ${last_name}`,
                    image: image_url,
                    resume: ''
                };

                try {
                    await User.create(userData);
                    console.log("User Created:", id);
                    return res.status(200).json({ message: "User created successfully" });
                } catch (error) {
                    console.error("Error creating user:", error);
                    return res.status(400).json({ success: false, message: "Error creating user" });
                }
            }

            case 'user.updated': {
                const userData = {
                    email: email_addresses[0].email_address,
                    name: `${first_name} ${last_name}`,
                    image: image_url,
                };
                
                try {
                    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
                    if (!updatedUser) {
                        return res.status(404).json({ success: false, message: "User not found" });
                    }
                    console.log("User Updated:", id);
                    return res.status(200).json({ message: "User updated successfully" });
                } catch (error) {
                    console.error("Error updating user:", error);
                    return res.status(400).json({ success: false, message: "Error updating user" });
                }
            }

            case 'user.deleted': {
                try {
                    const deletedUser = await User.findByIdAndDelete(id);
                    if (!deletedUser) {
                        return res.status(404).json({ success: false, message: "User not found" });
                    }
                    console.log("User Deleted:", id);
                    return res.status(200).json({ message: "User deleted successfully" });
                } catch (error) {
                    console.error("Error deleting user:", error);
                    return res.status(400).json({ success: false, message: "Error deleting user" });
                }
            }

            default: {
                return res.status(400).json({ success: false, message: "Unsupported webhook event" });
            }
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(400).json({ success: false, message: "Webhook Error: " + error.message });
    }
}