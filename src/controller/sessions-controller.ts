// Importa os tipos 'Request' e 'Response' do Express, usados para lidar com requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a instância do Prisma Client para interagir com o banco de dados
import { prisma } from "@/database/prisma";

// Importa as configurações de autenticação, incluindo o segredo e o tempo de expiração do token JWT
import { authConfig } from "@/configs/auth";

// Importa a função 'sign' do jsonwebtoken para gerar tokens JWT
import { sign } from "jsonwebtoken";

// Importa a classe personalizada de erro usada para tratar exceções controladas
import { AppError } from "@/utils/app-error";

// Importa a função 'compare' do bcrypt para comparar senhas em texto puro com suas versões hash
import { compare } from "bcrypt";

// Importa o Zod, uma biblioteca para validação de dados de entrada
import { z } from "zod";

// Define a classe SessionsController, responsável pela criação de sessões de autenticação
class SessionsController {
  // Método assíncrono para criar uma nova sessão de autenticação
  async create(req: Request, res: Response) {
    // Define o esquema de validação do corpo da requisição usando Zod
    const bodySchema = z.object({
      email: z.string().email(), // O campo 'email' deve ser uma string em formato de email válido
      password: z.string().min(6), // O campo 'password' deve ser uma string com pelo menos 6 caracteres
    });

    // Valida e desestrutura os dados do corpo da requisição
    const { email, password } = bodySchema.parse(req.body);

    // Busca o usuário no banco de dados pelo email
    const user = await prisma.user.findFirst({
      where: { email }, // Condição: o campo 'email' deve corresponder ao fornecido
    });

    // Se o usuário não for encontrado, lança um erro de autenticação (401 - Unauthorized)
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compara a senha fornecida com a senha armazenada no banco de dados (hash)
    const passwordMatched = await compare(password, user.password);

    // Se as senhas não coincidirem, lança um erro de autenticação
    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401);
    }

    // Extrai o segredo e o tempo de expiração do token JWT a partir da configuração de autenticação
    const { secret, expiresIn } = authConfig.jwt;

    // Gera um token JWT contendo o papel do usuário e definindo o tempo de expiração
    const token = sign(
      { role: user.role ?? "customer" }, // O payload contém o papel do usuário (padrão: "customer")
      secret, // O segredo usado para assinar o token
      {
        subject: user.id, // Associa o token ao ID do usuário
        expiresIn, // Define o tempo de expiração do token
      }
    );

    // Remove o campo 'password' do objeto do usuário antes de enviá-lo na resposta
    const { password: hashedPassword, ...userWithoutPassword } = user;

    // Retorna o token JWT e os dados do usuário (sem a senha) em formato JSON
    return res.json({ token, user: userWithoutPassword });
  }
}

// Exporta a classe SessionsController para ser usada em outras partes da aplicação
export { SessionsController };
