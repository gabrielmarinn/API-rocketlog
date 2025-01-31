// Importa os tipos 'Request', 'Response' e 'NextFunction' do Express, usados para lidar com requisições e o fluxo intermediário de middleware
import { Request, Response, NextFunction } from "express";

// Importa a classe personalizada de erro, usada para lançar erros controlados na aplicação
import { AppError } from "@/utils/app-error";

// Importa o tipo de erro 'ZodError', que é gerado quando a validação com Zod falha
import { ZodError } from "zod";

/*
 * Função de middleware para tratamento de erros centralizado.
 * Essa função captura erros lançados durante o processamento das requisições
 * e envia uma resposta HTTP adequada ao cliente.
 */
export function errorHandling(
  err: any, // O erro capturado
  req: Request, // A requisição atual
  res: Response, // A resposta a ser enviada ao cliente
  next: NextFunction // A função que passa para o próximo middleware, se necessário
) {
  // Verifica se o erro é uma instância da classe personalizada 'AppError'
  if (err instanceof AppError) {
    // Retorna uma resposta HTTP com o código de status e a mensagem do erro
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Verifica se o erro é uma instância de 'ZodError' (erro de validação)
  if (err instanceof ZodError) {
    // Retorna uma resposta HTTP com o status 400 (Bad Request) e os detalhes dos erros de validação
    return res.status(400).json({
      message: "validation error", // Mensagem genérica de erro de validação
      issues: err.format(), // Detalhes formatados dos erros de validação
    });
  }

  // Para outros erros não tratados, retorna uma resposta HTTP com status 500 (Internal Server Error)
  return res.status(500).json({ message: err.message });
}
