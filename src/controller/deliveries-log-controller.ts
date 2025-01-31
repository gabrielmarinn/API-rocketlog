// Importa os tipos 'Request' e 'Response' do Express, usados para lidar com requisições e respostas HTTP
import { Request, Response } from "express";

// Importa a instância do Prisma Client para realizar operações no banco de dados
import { prisma } from "@/database/prisma";

// Importa o Zod, uma biblioteca para validação de dados de entrada
import { z } from "zod";

// Importa a classe personalizada de erro usada para tratar exceções controladas
import { AppError } from "@/utils/app-error";

// Define a classe DeliveryLogsController, responsável por gerenciar os logs de entrega
class DeliveryLogsController {
  // Método assíncrono para criar um novo log de entrega
  async create(req: Request, res: Response) {
    // Define o esquema de validação do corpo da requisição usando Zod
    const bodySchema = z.object({
      delivery_id: z.string().uuid(), // O campo 'delivery_id' deve ser uma string com formato UUID
      description: z.string(), // O campo 'description' deve ser uma string
    });

    // Valida e desestrutura os dados do corpo da requisição
    const { delivery_id, description } = bodySchema.parse(req.body);

    // Verifica se a entrega existe no banco de dados
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    // Se a entrega não for encontrada, lança um erro personalizado (404 - Não encontrado)
    if (!delivery) {
      throw new AppError("delivery not found", 404);
    }

    // Verifica se a entrega já foi finalizada e lança um erro, se necessário
    if (delivery.status === "delivered") {
      throw new AppError("this order has already been delivered");
    }

    // Se a entrega ainda estiver em processamento, não permite adicionar logs
    if (delivery.status === "processing") {
      throw new AppError("change status to shipped");
    }

    // Cria um novo log de entrega no banco de dados
    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id, // Associa o log à entrega
        description, // Descrição do log
      },
    });

    // Retorna uma resposta HTTP com status 201 (Created) e sem corpo
    return res.status(201).json();
  }

  // Método assíncrono para exibir os detalhes de uma entrega e seus logs
  async show(req: Request, res: Response) {
    // Define o esquema de validação dos parâmetros da URL
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(), // O parâmetro 'delivery_id' deve ser uma string no formato UUID
    });

    // Valida e desestrutura os parâmetros da URL
    const { delivery_id } = paramsSchema.parse(req.params);

    // Busca a entrega no banco de dados e inclui os dados do usuário e dos logs associados
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: {
        user: true, // Inclui informações do usuário associado à entrega
        logs: true, // Inclui os logs de entrega
      },
    });

    // Verifica se o usuário autenticado é um cliente e tenta acessar uma entrega de outro usuário
    if (req.user?.role === "customer" && req.user.id !== delivery?.userId) {
      throw new AppError("the user can only view their deliveries", 401); // Erro de autorização (401)
    }

    // Retorna os detalhes da entrega em formato JSON
    return res.json(delivery);
  }
}

// Exporta a classe DeliveryLogsController para ser usada em outras partes da aplicação
export { DeliveryLogsController };
