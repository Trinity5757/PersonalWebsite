import Link from "next/link";
import { ILike } from "../models/Like";

type Props = {
  like: ILike;
}

export default function UserLikeRow({like}: Props) {
  return (
    <Link href={`/members/${like.userId.username}`}>
      <div className="card-body p-3 hover:bg-gray-100 hover:text-gray-600 rounded transition duration-300" style={{ boxShadow: "var(--shd, 0 1px 2px rgba(0, 0, 0, 0.6))" }}>
        <div className="flex gap-4 items-center">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={like.userId.avatar_image} alt={like.userId.username} title={like.userId?.username} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{like.userId.username}</h3>
            <div className="flex gap-2 items_center">
              <p>10 followers</p>
              ·
              <p>2 Teams</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
      
  );
}