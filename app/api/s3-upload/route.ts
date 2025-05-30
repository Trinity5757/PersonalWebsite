import { NextResponse, type NextRequest } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain', 'image/svg+xml', 'image/webp'];

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    }
});

async function uploadFileToS3(file: Buffer, folderName: string, fileName: string, fileType: string) {
   
    const sanitizedFolderName = (folderName || 'uploads').replace(/[^a-zA-Z0-9\-_.]/g, '_');
    const fileKey = `${sanitizedFolderName}/${fileName}`;

    console.log("Uploading file with key:", fileKey);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ContentType: fileType || 'application/octet-stream'  // fallback to default content type
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // return public S3 URL 
    const s3Url = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
    return s3Url;  
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (!allowedFileTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const s3Url = await uploadFileToS3(buffer, folder, file.name, file.type);

        return NextResponse.json({
            folder: folder,
            file_type: file.type,
            success: 'File uploaded successfully',
            secure_url: s3Url  
        }, { status: 200 });

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: 'Error uploading file ' }, { status: 500 });
    }
}
