import {google} from "googleapis"
import {GoogleAuth} from 'google-auth-library'
import { Readable } from "stream";


export async function googleApi({imageStream, name}:{imageStream: File, name: string}) {
  const credentials = {
    type: process.env.GD_TYPE || "",
    project_id: process.env.GD_PROJECT_ID || "",
    private_key_id: process.env.GD_PRIVATE_KEY_ID || "",
    private_key: process.env.GD_PRIVATE_KEY || "",
    client_email: process.env.GD_CLIENT_EMAIL || "",
    client_id: process.env.GD_CLIENT_ID || "",
    auth_uri: process.env.GD_AUTH_URI || "",
    token_uri: process.env.GD_TOKEN_URI || "",
    auth_provider_x509_cert_url: process.env.GD_AUTH_PROVIDER || "",
    client_x509_cert_url: process.env.GD_CLIENT_X509 || "",
    universe_domain: process.env.GD_UNIVERSE_DOMAIN || "",
  }
  
  const auth = new GoogleAuth({
    credentials,
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