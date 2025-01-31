// Importa a função 'Router' do Express para definir as rotas
import { Router } from "express";

// Importa o controlador responsável por criar e listar entregas
import { DeliveriesController } from "@/controller/deliveries-controller";

// Importa o controlador responsável por atualizar o status das entregas
import { DeliveriesStatusController } from "@/controller/deliveries-status-controller";

// Importa o middleware que verifica se o usuário está autenticado
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

// Importa o middleware que verifica se o usuário possui a autorização necessária
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

// Cria uma nova instância de rotas do Express
const deliveriesRoutes = Router();

// Cria uma instância do controlador de entregas
const deliveriesController = new DeliveriesController();

// Cria uma instância do controlador de status de entregas
const deliveriesStatusController = new DeliveriesStatusController();

/*
 * Aplica os middlewares de autenticação e autorização em todas as rotas definidas a partir deste ponto.
 * - 'ensureAuthenticated': Verifica se o usuário está autenticado.
 * - 'verifyUserAuthorization': Verifica se o usuário possui o papel "sale" (vendedor).
 */
deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(["sale"]));

/*
 * Rota POST para criar uma nova entrega.
 * - Rota: POST /deliveries
 * - Controlador: 'create' do DeliveriesController
 * - Requer autenticação e autorização para usuários com papel "sale".
 */
deliveriesRoutes.post("/", deliveriesController.create);

/*
 * Rota GET para listar todas as entregas.
 * - Rota: GET /deliveries
 * - Controlador: 'index' do DeliveriesController
 * - Retorna as entregas com os dados do usuário associado.
 */
deliveriesRoutes.get("/", deliveriesController.index);

/*
 * Rota PATCH para atualizar o status de uma entrega.
 * - Rota: PATCH /deliveries/:id/status
 * - Controlador: 'update' do DeliveriesStatusController
 * - Atualiza o status da entrega e registra o log da mudança.
 */
deliveriesRoutes.patch("/:id/status", deliveriesStatusController.update);

// Exporta o módulo de rotas para ser usado na aplicação principal
export { deliveriesRoutes };
