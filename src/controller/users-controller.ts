// Importa os tipos 'Request' e 'Response' do Express, usados para lidar com requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a instância do Prisma Client para realizar operações no banco de dados
import { prisma } from "@/database/prisma";

// Importa a classe personalizada de erro usada para tratar exceções controladas
import { AppError } from "@/utils/app-error";

// Importa a função 'hash' do bcrypt para criptografar a senha
import { hash } from "bcrypt";

// Importa o Zod, uma biblioteca para validação de dados de entrada
import { z } from "zod";

// Define a classe UsersController, responsável por gerenciar a criação de usuários
class UsersController {
  // Método assíncrono para criar um novo usuário
  async create(req: Request, res: Response) {
    // Define o esquema de validação do corpo da requisição usando Zod
    const bodySchema = z.object({
      name: z.string().trim().min(3), // O campo 'name' deve ser uma string com pelo menos 3 caracteres, sem espaços extras
      email: z.string().email(), // O campo 'email' deve ser uma string no formato de email válido
      password: z.string().min(6), // O campo 'password' deve ser uma string com pelo menos 6 caracteres
    });

    // Valida e desestrutura os dados do corpo da requisição
    const { name, email, password } = bodySchema.parse(req.body);

    // Verifica se já existe um usuário com o mesmo email no banco de dados
    const userWithSameEmail = await prisma.user.findFirst({
      where: { email }, // Busca o usuário com base no email fornecido
    });

    // Se um usuário com o mesmo email for encontrado, lança um erro
    if (userWithSameEmail) {
      throw new AppError("User with same email already exists");
    }

    // Criptografa a senha usando bcrypt com fator de custo 8
    const hashedPassword = await hash(password, 8);

    // Cria um novo usuário no banco de dados com os dados fornecidos
    const user = await prisma.user.create({
      data: {
        name, // Nome do usuário
        email, // Email do usuário
        password: hashedPassword, // Senha criptografada
      },
    });

    // Desestrutura e remove o campo 'password' antes de retornar o usuário na resposta
    const { password: _, ...userWithoutPassword } = user;

    // Retorna uma resposta HTTP com status 201 (Created) e os dados do usuário sem a senha
    return res.status(201).json(userWithoutPassword);
  }
}

// Exporta a classe UsersController para ser usada em outras partes da aplicação
export { UsersController };
