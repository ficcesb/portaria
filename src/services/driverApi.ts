import {google} from "googleapis"
import {GoogleAuth} from 'google-auth-library'
import { Readable } from "stream";
import { credentials as getCredentials } from "../../config/credentials";

export async function googleApi({imageStream, name}:{imageStream: File, name: string}) {
  getCredentials()
  
  const auth = new GoogleAuth({
    keyFile: "./credentials.json",
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