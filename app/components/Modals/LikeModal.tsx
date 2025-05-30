import { ILike } from "@/app/models/Like";
import { X } from "lucide-react";
import { useEffect } from "react";
import UserLikeRow from "../UserLikeRow";


type Props = {
  isVisible: boolean;
  likes: ILike[];
  onClose: () => void;
};

export default function LikeModal({isVisible, likes, onClose}: Props) {

  // Lock backgrounnd when modal is visible
  useEffect(() => {
    if(isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset';
    }
  }, [isVisible])

  if(!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">     
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg" style={{ height: '500px' }}>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>

        <div style={{ height: '300px', overflowY: 'auto', overflowX:'hidden'}}>
          {
            likes.length == 0 ? 
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg flex justify-center" style={{ boxShadow: "var(--shd, 0 1px 4px rgba(0, 0, 0, 0.6))" }}>
              <h1 className="welcome-heading text-[25px] lg:text-[20px] text-white lg:text-black">
                No Likes
              </h1>
            </div> 
            :
            likes.map((like) => {
              return (
                <UserLikeRow key={like._id.toString()} like={like}/>
                  
              );
            })
          }
        </div>
      </div>
    </div>
  );

}