import getServerSession from "next-auth";
import { authConfig } from "@/auth.config";
import {
    createNotification,
    getNotificationsByRecipient,
    getNotificationsBySender,
    getAllNotifications,
} from "@/app/services/notificationService";
import { User } from "@/app/models/Users";

// GET handler for retrieving notifications
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authConfig);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Please log in to access this resource." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const url = new URL(request.url);
        const recipient = url.searchParams.get("recipient") || "";
        const sender = url.searchParams.get("sender") || "";
        const type = url.searchParams.get("type") || "";
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "10", 10);

        const validParameters = [
            "recipient",
            "recipientType",
            "sender",
            "senderType",
            "type",
            "message",
            "read",
            "readAt",
            "metadata",
            "frequency",
            "turnedOn",
            "page",
            "limit"
        ];
        const invalidParams = Array.from(url.searchParams.keys()).filter(
            (param) => !validParameters.includes(param)
        );

        if (invalidParams.length > 0) {
            return new Response(
                JSON.stringify({ error: `Invalid parameters: ${invalidParams.join(", ")}` }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        let result;

        if (!recipient && !sender) {
            // No parameters: Return all notifications
            result = await getAllNotifications("", page, limit);
        } else if (recipient) {
            // Validate if recipient exists
            const recipientExists = await User.findById(recipient).lean();
            if (!recipientExists) {
                return new Response(
                    JSON.stringify({ error: "Recipient not found." }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            // Fetch by recipient
            result = await getNotificationsByRecipient(recipient, type, page, limit)

        } else if (sender) {
            // Validate if sender exists
            const senderExists = await User.findById(sender).lean();
            if (!senderExists) {
                return new Response(
                    JSON.stringify({ error: "Sender not found." }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            // Fetch by sender
            result = await getNotificationsBySender(sender, type, page, limit);
        }

        if (!result || result.notifications.length === 0) {
            return new Response(
                JSON.stringify({ error: "No notifications found matching the given criteria." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching notifications:", errorMessage || error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch notifications." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();

        const {
            recipient,
            recipientType,
            sender,
            senderType = "User",      // Default senderType to "User"
            type,
            message,
            metadata,
            frequency = "instant",   // Default to "instant"
            turnedOn = false         // Default to false
        } = body;

        // Validate required fields
        if (!recipient || !recipientType || !sender || !type || !message) {
            return new Response(
                JSON.stringify({ error: "Missing required fields for notification creation." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the recipient exists
        const recipientExists = await User.findById(recipient).lean();
        if (!recipientExists) {
            return new Response(
                JSON.stringify({ error: "Recipient not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create the notification
        const notification = await createNotification(
            recipient,
            recipientType,
            sender,
            senderType,
            type,
            message,
            metadata,
            frequency,
            turnedOn
        );

        return new Response(JSON.stringify(notification), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error creating notification:", errorMessage || error);
        return new Response(
            JSON.stringify({ error: "Failed to create notification." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
