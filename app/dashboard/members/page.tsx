"use client";
import UserFeed from "@/app/components/Feeds/UserFeed";

export default function MembersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Members Page</h1>
            <p>Users</p>
            <UserFeed />

        </div>
    );
}