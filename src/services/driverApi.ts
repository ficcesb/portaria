import {google} from "googleapis"
import {GoogleAuth} from 'google-auth-library'
import { Readable } from "stream";


export async function googleApi({imageStream, name}:{imageStream: File, name: string}) {
  const auth = new GoogleAuth({
    keyFile: "./config/credentials.json",
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth, });

  const fileMetadata = {
    'name': name,
    'parents': [process.env.GD_DRIVER_FOLDER || ""]
  };
  
  try {
    const buffer = await imageStream.arrayBuffer()

    const media = {
      mimeType: imageStream.type,
      body: Readable.from(Buffer.from(buffer)),
    };
  
    const file = await service.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    return file.data.id;

  } catch (err) {
    throw new Error(`message: ${err}`)
  }

}