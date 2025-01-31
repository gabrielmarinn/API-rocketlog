// Importa os tipos 'Request', 'Response' e 'NextFunction' do Express, usados para lidar com requisições e o fluxo intermediário de middleware
import { Request, Response, NextFunction } from "express";

// Importa a função 'verify' do jsonwebtoken para verificar e decodificar o token JWT
import { verify } from "jsonwebtoken";

// Importa as configurações de autenticação, como o segredo do token JWT
import { authConfig } from "@/configs/auth";

// Importa a classe personalizada de erro para tratar exceções controladas
import { AppError } from "@/utils/app-error";

// Define a interface 'TokenPayload', que representa o formato esperado do token decodificado
interface TokenPayload {
  role: string; // O papel (role) do usuário, por exemplo: "customer", "admin"
  sub: string; // O identificador do usuário (geralmente, o 'id')
}

// Middleware que garante que o usuário está autenticado antes de permitir o acesso à rota
function ensureAuthenticated(
  req: Request, // A requisição atual
  res: Response, // A resposta enviada ao cliente
  next: NextFunction // A função para continuar para o próximo middleware ou rota
) {
  try {
    // Obtém o cabeçalho de autorização da requisição (onde o token JWT é enviado)
    const authHeader = req.headers.authorization;

    // Se o cabeçalho de autorização não for encontrado, lança um erro de autenticação
    if (!authHeader) {
      throw new AppError("JWT token not found", 401);
    }

    // Divide o cabeçalho de autorização e extrai o token (o formato esperado é: "Bearer <token>")
    const [, token] = authHeader.split(" ");

    // Verifica e decodifica o token JWT usando o segredo definido nas configurações
    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;

    // Adiciona as informações do usuário autenticado à requisição (para acesso em rotas protegidas)
    req.user = {
      id: user_id, // O ID do usuário extraído do token
      role, // O papel do usuário extraído do token
    };

    // Continua para o próximo middleware ou rota protegida
    return next();
  } catch (err) {
    // Se houver algum erro (token inválido ou outra falha), lança um erro de autenticação
    throw new AppError("Invalid JWT token", 401);
  }
}

// Exporta a função ensureAuthenticated para ser usada como middleware em rotas protegidas
export { ensureAuthenticated };
