// Importa a função 'Router' do Express para definir rotas de forma modular e centralizada
import { Router } from "express";

// Importa os módulos de rotas específicas para usuários, sessões, entregas e logs de entregas
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { deliveriesRoutes } from "./deliveries-routes";
import { deliveryLogsRoutes } from "./delivery-logs-routes";

// Cria uma nova instância de rotas do Express, que servirá como o roteador principal da aplicação
const routes = Router();

/*
 * Define a rota base para o módulo de usuários.
 * - Todas as rotas relacionadas a usuários (ex.: criação, listagem) estarão disponíveis em "/users".
 */
routes.use("/users", usersRoutes);

/*
 * Define a rota base para o módulo de sessões (autenticação).
 * - Todas as rotas relacionadas ao login de usuários estarão disponíveis em "/sessions".
 */
routes.use("/sessions", sessionsRoutes);

/*
 * Define a rota base para o módulo de entregas.
 * - Todas as rotas relacionadas a entregas estarão disponíveis em "/deliveries".
 * - Inclui funcionalidades como criação de entregas, listagem e atualização de status.
 */
routes.use("/deliveries", deliveriesRoutes);

/*
 * Define a rota base para o módulo de logs de entregas.
 * - Todas as rotas relacionadas ao registro de logs de entregas estarão disponíveis em "/delivery-logs".
 * - Inclui funcionalidades como criação e visualização de logs.
 */
routes.use("/delivery-logs", deliveryLogsRoutes);

// Exporta o roteador principal para ser utilizado na aplicação principal
export { routes };
