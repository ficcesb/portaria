import { MongoDB } from '@/services/mongoDB';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const con = (await MongoDB.getConnection())
                .db('portaria_faceid')
                .collection('alunos');

  const formData = await req.formData();

  const cpf = formData.get('cpf');
  const matricula = formData.get('matricula');
  const name = formData.get('name');
  const urlImage = formData.get('url_image');

  try {
    const _cpf = await con.findOne({ cpf: cpf}) 

    
    if(_cpf) {
      return new Response("Usuário já foi cadastrado", { status: 400 })
    }

    const data = {
      cpf,
      matricula,
      name,
      urlImage,
    }


    try {
      await con.insertOne(data);

      return new Response(JSON.stringify(data), { status : 201});
    } catch (err) {
      return new Response(`Internal Server Error: ${err}`, { status : 500})
    }

  }
  catch (err) {
    return new Response(`Internal Server Error: ${err}`, { status : 500})
  }
}

export async function PUT(req: NextRequest, res: Response) {
  const con = (await MongoDB.getConnection())
                .db('portaria_faceid')
                .collection('alunos');

  const formData = await req.formData();

  const cpf = formData.get('cpf') as string;
  const matricula = formData.get('matricula') as string;
  const name = formData.get('name') as string;
  const urlImage = formData.get('url_image') as string;

  try {
    const _cpf = await con.findOne({ cpf: cpf}) 
    
    if(!_cpf) {
      return new Response('error: aluno not created', { status : 400 })
    }

    const data = {
      matricula,
      name,
      urlImage,
    }

    try {
      const d = await con.updateOne({_id: _cpf._id}, {$set: data});

      return Response.json({status : 204});
    } catch (err) {
      con.deleteOne(_cpf);

      return new Response(`Internal Server Error: ${err}`, { status : 500})
    }

  }
  catch (err) {
    return new Response(`Internal Server Error: ${err}`, { status : 500})
  }
}