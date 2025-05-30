// app/services/notificationService.ts
import { connectDB } from '@/app/lib/connectDB';
import { Types } from 'mongoose';
import { Notification, INotification } from '@/app/models/Notifications';
// Get all notifications from a certain user
export const getAllNotifications = async (
    recipient: string,
    page = 1,
    limit = 10
) => {
    try {
        await connectDB();
        const skip = (page - 1) * limit;

        if (page < 1 || limit < 1) {
            throw new Error('Invalid page or limit');
        }

        const totalNotifications = await Notification.countDocuments();

        const notifications = await Notification.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        return {
            notifications,
            totalNotifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
    }
};

// Create a new notification
export async function createNotification(
    recipient: string,
    recipientType: 'User' | 'Page',
    sender: string,
    senderType: 'User' | 'Business' | 'Team',
    type: string,
    message: string,
    metadata?: Record<string, any>,
    frequency: "instant" | "daily" | "weekly" = "instant",
    turnedOn: boolean = false
) {
    try {
        await connectDB();

        // Validate the required fields
        if (!recipient || !recipientType || !sender || !senderType || !type || !message) {
            throw new Error('Missing required fields for notification creation');
        }

        // Create the notification
        const newNotification = new Notification({
            recipient,
            recipientType,
            sender,
            senderType,
            type,
            message,
            metadata,
            frequency,
            turnedOn
        });

        // Save the notification
        await newNotification.save();

        return newNotification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
    }
}
// Get a notification by ID
export async function getNotificationById(id: string) {
    try {
        await connectDB();
        if (!Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ID format: ${id}`);
        }

        console.log(`Fetching notification with ID: ${id}`);
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        const notification = await Notification.findById(id).lean();

        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;
    } catch (error) {
        console.error('Error fetching notification by ID:', error);
        throw new Error('Failed to fetch notification');
    }
}

// Update a notification by ID
export async function updateNotificationById(id: string, updatedData: Partial<INotification>) {
    try {
        await connectDB();

        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
        if (!objectId) {
            throw new Error('Invalid ID format');
        }

        const notification = await Notification.findByIdAndUpdate(
            objectId,
            updatedData,
            { new: true }
        );


        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;
    } catch (error) {
        console.error('Error updating notification:', error);
        throw new Error('Failed to update notification');
    }
}

// Delete a notification by ID
export async function deleteNotificationById(id: string) {
    try {
        await connectDB();

        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
        if (!objectId) {
            throw new Error('Invalid ID format');
        }

        const notification = await Notification.findByIdAndDelete(objectId);

        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw new Error('Failed to delete notification');
    }
}

// Get notifications by recipient
export async function getNotificationsByRecipient(
    recipient: string,
    type: string,
    page: number = 1,
    limit: number = 10
) {
    try {
        await connectDB();

        const skip = (page - 1) * limit;

        const recipientQuery = Types.ObjectId.isValid(recipient) ? new Types.ObjectId(recipient) : recipient;

        const query: Record<string, any> = { recipient: recipientQuery };
        if (type) {
            query.type = type; // Add type filter if provided
        }

        const notifications = await Notification.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();


        const totalNotifications = await Notification.countDocuments(query);

        return {
            notifications,
            totalNotifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: page,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching notifications by recipient:", error.message);
        } else {
            console.error("Error fetching notifications by recipient:", error);
        }
        throw new Error("Failed to fetch notifications by recipient");
    }
}

// get Notifications By Sender ID
export async function getNotificationsBySender(
    sender: string,
    type: string,
    page: number = 1,
    limit: number = 10
) {
    try {
        await connectDB();

        const skip = (page - 1) * limit;

        const senderQuery = Types.ObjectId.isValid(sender) ? new Types.ObjectId(sender) : sender;

        const query: Record<string, any> = { sender: senderQuery };
        if (type) {
            query.type = type;
        }

        const notifications = await Notification.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();


        const totalNotifications = await Notification.countDocuments(query);

        return {
            notifications,
            totalNotifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: page,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching notifications by sender:", error.message);
        } else {
            console.error("Error fetching notifications by sender:", error);
        }
        throw new Error("Failed to fetch notifications by sender");
    }
}
