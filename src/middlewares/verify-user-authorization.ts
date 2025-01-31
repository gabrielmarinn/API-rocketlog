// Importa os tipos 'Request', 'Response' e 'NextFunction' do Express, usados para lidar com requisições e o fluxo intermediário de middleware
import { Request, Response, NextFunction } from "express";

// Importa a classe personalizada de erro usada para lançar exceções controladas
import { AppError } from "@/utils/app-error";

/*
 * Função middleware para verificar se o usuário autenticado possui uma autorização válida.
 * Recebe um array de papéis (roles) permitidos como parâmetro.
 */
function verifyUserAuthorization(role: string[]) {
  /*
   * Retorna um middleware que verifica se o usuário possui o papel necessário.
   */
  return (req: Request, res: Response, next: NextFunction) => {
    // Verifica se o objeto 'req.user' existe, ou seja, se o usuário está autenticado
    if (!req.user) {
      throw new AppError("Unauthorized", 401); // Se não estiver autenticado, lança um erro de autorização
    }

    // Verifica se o papel do usuário está incluído no array de papéis permitidos
    if (!role.includes(req.user.role)) {
      throw new AppError("Unauthorized", 401); // Se não for permitido, lança um erro de autorização
    }

    // Se todas as verificações forem bem-sucedidas, continua para a próxima função no fluxo de middleware
    return next();
  };
}

// Exporta a função verifyUserAuthorization para ser usada em rotas protegidas
export { verifyUserAuthorization };
