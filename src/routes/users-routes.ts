// Importa a função 'Router' do Express para definir rotas de forma modular
import { Router } from "express";

// Importa o controlador responsável por gerenciar operações relacionadas a usuários
import { UsersController } from "@/controller/users-controller";

// Cria uma nova instância de rotas do Express para as rotas relacionadas a usuários
const usersRoutes = Router();

// Cria uma instância do controlador de usuários
const usersController = new UsersController();

/*
 * Define a rota POST para criação de um novo usuário.
 * - Rota: POST /users
 * - Controlador: 'create' do UsersController
 * - Função: Recebe os dados do novo usuário no corpo da requisição (nome, email, senha),
 *   valida as informações e cria um novo registro no banco de dados.
 */
usersRoutes.post("/", usersController.create);

// Exporta o módulo de rotas de usuários para ser usado na aplicação principal
export { usersRoutes };
