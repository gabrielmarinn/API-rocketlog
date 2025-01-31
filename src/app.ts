// Importa o framework 'express' para criar o servidor web e gerenciar as requisições HTTP
import express from "express";

// Importa o módulo 'express-async-errors' para capturar erros assíncronos automaticamente em middlewares e rotas
import "express-async-errors";

// Importa o roteador principal que contém todas as rotas da aplicação
import { routes } from "./routes";

// Importa o middleware de tratamento de erros centralizado
import { errorHandling } from "./middlewares/error-handling";

// Cria uma instância da aplicação Express
const app = express();

/*
 * Adiciona um middleware para interpretar o corpo das requisições no formato JSON.
 * - Necessário para que as requisições POST, PUT e PATCH que enviam dados no corpo possam ser lidas.
 */
app.use(express.json());

/*
 * Registra o roteador principal, que contém todas as rotas da aplicação.
 * - As rotas podem incluir recursos como '/users', '/sessions', '/deliveries', etc.
 */
app.use(routes);

/*
 * Middleware de tratamento de erros global.
 * - Captura erros lançados durante o processamento das requisições e envia respostas adequadas.
 * - Esse middleware é especialmente útil para lidar com erros personalizados (ex.: 'AppError').
 */
app.use(errorHandling);

// Exporta a instância da aplicação para ser utilizada no servidor principal ou nos testes
export { app };
