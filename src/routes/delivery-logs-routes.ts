// Importa a função 'Router' do Express para definir rotas de forma modular
import { Router } from "express";

// Importa o controlador responsável por criar e exibir logs de entregas
import { DeliveryLogsController } from "@/controller/deliveries-log-controller";

// Importa o middleware que verifica se o usuário está autenticado
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

// Importa o middleware que verifica se o usuário possui a autorização necessária
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

// Cria uma nova instância de rotas do Express
const deliveryLogsRoutes = Router();

// Cria uma instância do controlador de logs de entregas
const deliveryLogsController = new DeliveryLogsController();

/*
 * Rota POST para criar um novo log de entrega.
 * - Rota: POST /delivery-logs
 * - Middlewares:
 *    - ensureAuthenticated: Verifica se o usuário está autenticado.
 *    - verifyUserAuthorization(["sale"]): Permite acesso apenas para usuários com o papel "sale" (vendedores).
 * - Controlador: 'create' do DeliveryLogsController
 */
deliveryLogsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  deliveryLogsController.create
);

/*
 * Rota GET para exibir os detalhes de um log de entrega específico.
 * - Rota: GET /delivery-logs/:delivery_id/show
 * - Middlewares:
 *    - ensureAuthenticated: Verifica se o usuário está autenticado.
 *    - verifyUserAuthorization(["sale", "customer"]): Permite acesso a vendedores ("sale") e clientes ("customer").
 * - Controlador: 'show' do DeliveryLogsController
 */
deliveryLogsRoutes.get(
  "/:delivery_id/show",
  ensureAuthenticated,
  verifyUserAuthorization(["sale", "customer"]),
  deliveryLogsController.show
);

// Exporta o módulo de rotas para ser usado na aplicação principal
export { deliveryLogsRoutes };
