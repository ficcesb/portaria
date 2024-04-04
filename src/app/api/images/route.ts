import { googleApi } from "@/services/driverApi";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageStream = formData.get('file') as File;
  const name = formData.get('name') as string;

  try {
    const driveId = await googleApi({imageStream, name})

    if(!driveId || driveId === undefined) {
      throw new Error("Deu ruim ai")
    }

    return Response.json({id: driveId, url: `https://drive.google.com/uc?export=view&id=${driveId}`})
  }
  catch (err) {
    console.log(err)
    return new Response(`Error: ${JSON.stringify(err)}`, {
      status: 500,
      statusText: "Error uploading image"
    })
  }
}