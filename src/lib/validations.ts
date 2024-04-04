import { z } from "zod";

export const validationCpf = (cpf: string) => {
  const cleanCpf = cpf.replace(/[^\d]/g, ''); // Remove non-digit characters from the CPF

  const digits = cleanCpf.split('').map(Number); // Convert each digit to a number

  if(digits.every(digit => {
    return digit === digits[0]
  })) return false; // Invalid CPF

  // Validate the first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) {
    digit = 0;
  }
  if (digit !== digits[9]) {
    return false; // Invalid CPF
  }

  // Validate the second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) {
    digit = 0;
  }
  if (digit !== digits[10]) {
    return false; // Invalid CPF
  }

  return true; // Valid CPF
};


export const validationSchema = z.strictObject({
  cpf: z
    .string({
      required_error: 'CPF é obrigatório.',
    })
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '');
      return replacedDoc.length >= 11;
    }, 'CPF deve conter no mínimo 11 números.')
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '');
      return replacedDoc.length >= 11 && validationCpf(doc);
    }, 'CPF inválido')
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '');
      return replacedDoc.length <= 14;
    }, 'CPF deve conter no máximo 14 números.'),
  name: z.string({
    required_error: 'Nome é obrigatório.',
  })
    .refine((doc) => {
      const replacedDoc = doc.replace(' ', '');
      return replacedDoc.length > 3;
    }, 'CPF deve conter no mínimo 3 caracteres.'),
  matricula: z.string({}).optional(),
  url_image: z.string({}).optional(),
  file: z.any().optional(),
});