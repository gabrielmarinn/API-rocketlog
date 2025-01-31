// Importa o objeto 'env' do arquivo "../env"
import { env } from "../env";

/*
 * Exporta uma configuração de autenticação (authConfig) que será usada em outros arquivos.
 * Este objeto contém a configuração para autenticação baseada em JSON Web Token (JWT).
 */
export const authConfig = {
  jwt: {
    /*
     * Define o segredo utilizado para assinar e verificar os tokens JWT.
     * O valor do segredo está sendo lido a partir de uma variável de ambiente 'JWT_SECRET'.
     * Isso é uma boa prática para proteger informações sensíveis.
     */
    secret: env.JWT_SECRET,

    /*
     * Define o tempo de expiração do token JWT.
     * Aqui, o token é configurado para expirar em "1d" (1 dia).
     * Após expirar, o usuário precisará gerar um novo token para continuar autenticado.
     */
    expiresIn: "1d",
  },
};
