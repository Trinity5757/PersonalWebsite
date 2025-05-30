import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div>
      <main className="flex flex-col items-center justify-center gap-2 h-[100vh]">
        <FaceFrownIcon className="w-10 text-gray-400" />
        <h2 className="text-xl font-semibold text-black">Page under construction</h2>
        <p>Could not find the request.</p>
        <Link
          href="/home"
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        >
          Return Home
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
