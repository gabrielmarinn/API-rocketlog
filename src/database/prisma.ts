// Importa a classe 'PrismaClient' do pacote '@prisma/client', que permite interagir com o banco de dados
import { PrismaClient } from "@prisma/client";

/*
 * Cria e exporta uma instância do Prisma Client, configurada com opções de log.
 * Essa instância será usada em toda a aplicação para realizar operações no banco de dados.
 */
export const prisma = new PrismaClient({
  /*
   * Define a configuração de log de acordo com o ambiente de execução.
   * Se a aplicação estiver em produção (NODE_ENV === "production"), não serão exibidos logs.
   * Caso contrário, durante o desenvolvimento, o log das consultas ao banco de dados ("query") será exibido.
   * Isso é útil para depuração, pois permite monitorar as consultas executadas.
   */
  log: process.env.NODE_ENV === "production" ? [] : ["query"],
});
