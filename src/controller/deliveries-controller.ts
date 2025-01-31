// Importa os tipos 'Request' e 'Response' do Express, usados para lidar com requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a instância do Prisma Client para realizar operações no banco de dados
import { prisma } from "@/database/prisma";

// Importa o Zod, uma biblioteca para validação de dados, usada para validar o corpo da requisição
import { z } from "zod";

// Define a classe DeliveriesController, que contém os métodos para gerenciar entregas
class DeliveriesController {
  // Método assíncrono para criar uma nova entrega
  async create(req: Request, res: Response) {
    // Define o esquema de validação para o corpo da requisição usando Zod
    const bodySchema = z.object({
      user_id: z.string().uuid(), // O campo 'user_id' deve ser uma string e ter formato UUID
      description: z.string(), // O campo 'description' deve ser uma string
    });

    // Faz a validação e desestrutura os dados validados do corpo da requisição
    const { user_id, description } = bodySchema.parse(req.body);

    // Cria um novo registro de entrega no banco de dados
    await prisma.delivery.create({
      data: {
        userId: user_id, // Define o ID do usuário associado à entrega
        description, // Descrição da entrega
      },
    });

    // Retorna uma resposta HTTP com status 201 (Created) e sem corpo
    return res.status(201).json();
  }

  // Método assíncrono para listar todas as entregas
  async index(req: Request, res: Response) {
    // Busca todas as entregas no banco de dados e inclui informações do usuário associado
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: {
          select: {
            name: true, // Inclui o nome do usuário
            email: true, // Inclui o email do usuário
          },
        },
      },
    });

    // Retorna as entregas encontradas como resposta em formato JSON
    return res.json(deliveries);
  }
}

// Exporta a classe DeliveriesController para ser utilizada em outras partes da aplicação
export { DeliveriesController };
