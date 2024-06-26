'use client'

import { ThreeDots } from 'react-loader-spinner'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatCpf } from "@/lib/mask";
import { validationSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Success from "@/components/ui/success";
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import Link from 'next/link';

type SubmitFormData = {
  cpf: string;
  name: string;
  matricula?: string;
  file?: any;
  url_image?: string;
}

type StateData = "CREATED" | "PROGRESSING" | "SUCCESS" | "UPLOADED" | "ERROR" | "START"

export default function Home() {
  const [dialogModal, setDialogModal] = useState(false);
  const [state, setState] = useState<StateData>("START");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<FileList>({} as FileList);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      cpf: undefined,
      name: undefined
    },
  })

  function onSubmit(e: SubmitFormData) {
    setState("PROGRESSING")
  }

  useEffect(() => {
    setIsLoading(state === "PROGRESSING" || state === "CREATED" || state === "UPLOADED")
  }, [state, isLoading])

  useEffect(() => {
    const fetchAll = async () => {
      if(state === "PROGRESSING"){
        const dataForm = new FormData();
        const data = Object.values({...form.getValues()})
        
        Object.keys(form.getValues()).forEach((key,i) => {
          if(key !== "file"){
            dataForm.append(key, data[i]);
          }
        })

        const result = await fetch("/api/alunos", {
          method: "POST",
          body: dataForm
        })
  
        if(result.status === 201) {
          setState("CREATED");
        }
  
        if(result.status === 400) {
          const txtError = await result.text()
  
          setState(() => "ERROR");
          form.setError("cpf", {type: "error", message: txtError});
  
          setIsLoading(false);
        }
      }

      if(state === "CREATED"){ 
        const formData = new FormData();
        
        formData.append("file", file[0]);
        formData.append("name", form.getValues().name)
        
        const driverRes = await fetch("/api/images", {
          method: "POST",
          body: formData
        }).then(response => response);
        
        if(driverRes.status === 200){
          const data = await driverRes.json();
  
          form.setValue("url_image", data.url)
          
          setState("UPLOADED");
        } 

        if(driverRes.status === 500 || driverRes.status === 400){
          setState("ERROR");
        }
      }
      
      if(state === "UPLOADED"){
        const formData = new FormData();
        const data = Object.values({...form.getValues()})
      
        Object.keys(form.getValues()).forEach((key,i) => {
          if(key !== "file"){
            formData.append(key, data[i]);
          }
        })
          
        const updateRes = await fetch("/api/alunos", {
          method: "PUT",
          body: formData
        }).then((response) => response);
        
        if(updateRes.status === 200) {

          setDialogModal(true);
          setState("SUCCESS");
        }
            
        if(updateRes.status === 500 || updateRes.status === 400){
          const d = await updateRes.text();
          
          setState("ERROR");
        }
          
      }
    }

    fetchAll();
  }, [state, dialogModal]);

  function handleChange(e: any) {
    const { value } = e.target;
    e.target.value = formatCpf(value);

    form.setValue("cpf", e.target.value);
  }

  return (
    <div className='flex h-screen justify-between' style={{flexDirection: 'column'}}>
      <main className="w-full flex flex-col items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[350px] max-sm:px-4 pt-20 pb-20">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ex: 12345678900" {...field} 
                      onChange={handleChange} 
                      maxLength={14}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 12345678900" {...field} type="text"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Matricula</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 12345678 (Opcional)" {...field} type="text" required={false}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem 
                  className="flex w-full justify-between items-center gap-12 mb-12"
                >
                  <FormLabel className="whitespace-nowrap mt-2">Enviar foto</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" type="file" accept="image/png,image/jpg,image/jpeg" onChange={(e) => {if(e.target.files) setFile(e.target.files)}} required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-12">
              <Button disabled={state=== "PROGRESSING" || state === "CREATED" || state === "UPLOADED"} type="submit" className="w-full py-4">
                {!isLoading && "Realizar cadastro"}
                <ThreeDots
                  visible={isLoading}
                  height="30"
                  width="30"
                  color="#fff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </Button>
            </div>
          </form>
      </Form>
        <Dialog open={dialogModal} onOpenChange={setDialogModal}>
        <DialogContent className="max-sm:h-svh flex flex-col justify-between" >
          <DialogHeader className="max-sm:flex-1"> 
            <DialogDescription className="flex max-sm:flex-1 flex-col items-center justify-center">
              <Success className="w-[80%] h-auto"/>
              <h1 className="font-bold text-2xl text-black">🎉 Parabéns! 🎉</h1>
              <p className="text-center text-lg mt-4 mb-2 px-2">Se cadastro foi realizado com sucesso! Já estamos de olho e em breve já será possível ingressar via leitura facial.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" className="w-full max-sm:py-5 max-sm:text-lg mb-4" onClick={() => setDialogModal(false)}>Voltar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
    <footer className='flex w-full justify-center py-8 border-t-[1px]'>
      <Link href="http://links.nalissongomes.me" target="_blank" className='cursor-pointer text-stone-400 text-sm font-light whitespace-pre'>Developed by <span className='text-slate-900 text-sm font-normal'>Nalisson Gomes</span></Link>
    </footer>
    </div>
  );
}
