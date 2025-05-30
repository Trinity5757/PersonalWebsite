import getServerSession from "next-auth";
import { authConfig } from "@/auth.config";
import {
    getNotificationById,
    updateNotificationById,
    deleteNotificationById,
} from "@/app/services/notificationService";

// GET handler for retrieving a notification by ID
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authConfig);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Please log in to access this resource." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { id } = await context.params;

        const notification = await getNotificationById(id);

        if (!notification) {
            return new Response(
                JSON.stringify({ error: "Notification not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(notification), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching notification by ID:", errorMessage);
        return new Response(
            JSON.stringify({ error: "Failed to fetch notification." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// PUT handler for updating a notification by ID
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authConfig);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Please log in to access this resource." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { id } = await context.params;
        const updatedData = await request.json();

        if (!id || !updatedData) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: id or updatedData." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const updatedNotification = await updateNotificationById(id, updatedData);

        if (!updatedNotification) {
            return new Response(
                JSON.stringify({ error: "Notification not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(updatedNotification), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error updating notification:", errorMessage);
        return new Response(
            JSON.stringify({ error: "Failed to update notification." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// DELETE handler for deleting a notification by ID
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authConfig);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Unauthorized: Please log in to access this resource." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { id } = await context.params;

        const deletedNotification = await deleteNotificationById(id);

        if (!deletedNotification) {
            return new Response(
                JSON.stringify({ error: "Notification not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify(deletedNotification), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        console.error("Error deleting notification:", errorMessage);

        return new Response(
            JSON.stringify({ error: "Failed to delete notification." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
