// Importa a função 'Router' do Express para definir rotas de forma modular
import { Router } from "express";

// Importa o controlador responsável por gerenciar sessões (login, autenticação)
import { SessionsController } from "@/controller/sessions-controller";

// Cria uma nova instância de rotas do Express
const sessionsRoutes = Router();

// Cria uma instância do controlador de sessões
const sessionsController = new SessionsController();

/*
 * Define a rota POST para autenticação de usuários.
 * - Rota: POST /sessions
 * - Controlador: 'create' do SessionsController
 * - Função: Recebe as credenciais do usuário (email e senha), valida as informações e retorna um token JWT.
 */
sessionsRoutes.post("/", sessionsController.create);

// Exporta o módulo de rotas de sessões para ser usado na aplicação principal
export { sessionsRoutes };
