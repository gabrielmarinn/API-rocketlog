// Importa os tipos 'Request' e 'Response' do Express, usados para lidar com requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a instância do Prisma Client para realizar operações no banco de dados
import { prisma } from "@/database/prisma";

// Importa o Zod, uma biblioteca para validação de dados de entrada
import { z } from "zod";

// Define a classe DeliveriesStatusController, responsável por gerenciar atualizações no status das entregas
class DeliveriesStatusController {
  // Método assíncrono para atualizar o status de uma entrega
  async update(req: Request, res: Response) {
    // Define o esquema de validação dos parâmetros da URL usando Zod
    const paramsSchema = z.object({
      id: z.string().uuid(), // O parâmetro 'id' deve ser uma string no formato UUID
    });

    // Define o esquema de validação do corpo da requisição
    const bodySchema = z.object({
      status: z.enum(["processing", "shipped", "delivered"]), // O campo 'status' deve ser um dos valores permitidos
    });

    // Valida e desestrutura os parâmetros da URL
    const { id } = paramsSchema.parse(req.params);

    // Valida e desestrutura os dados do corpo da requisição
    const { status } = bodySchema.parse(req.body);

    // Atualiza o status da entrega no banco de dados
    await prisma.delivery.update({
      data: {
        status, // Atualiza o status da entrega com o valor enviado pelo cliente
      },
      where: {
        id, // Identifica a entrega pelo 'id' fornecido
      },
    });

    // Cria um novo log no banco de dados para registrar a alteração do status da entrega
    await prisma.deliveryLog.create({
      data: {
        deliveryId: id, // Associa o log à entrega correspondente
        description: status, // A descrição do log será o novo status
      },
    });

    // Retorna uma resposta HTTP sem corpo, indicando que a operação foi bem-sucedida
    return res.json();
  }
}

// Exporta a classe DeliveriesStatusController para ser usada em outras partes da aplicação
export { DeliveriesStatusController };
