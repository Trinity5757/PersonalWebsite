// app/api/sign-cloudinary-params/route.ts
import  cloudinary  from "@/app/lib/config/cloudinary";


export async function POST(request: Request) {
    const body = await request.json();
    const { paramsToSign } = body;
   
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    
    return Response.json({ signature });
}