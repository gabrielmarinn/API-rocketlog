// Importa o 'zod', uma biblioteca de validação e parsing de dados
import { z } from "zod";

/*
 * Define o esquema de validação das variáveis de ambiente usando 'z.object'.
 * - Cada propriedade representa uma variável de ambiente esperada, com seu respectivo tipo e validação.
 */
const envSchema = z.object({
  /*
   * DATABASE_URL deve ser uma string no formato de URL válida.
   * - Usada para definir a conexão com o banco de dados (por exemplo, PostgreSQL ou MySQL).
   */
  DATABASE_URL: z.string().url(),

  /*
   * JWT_SECRET deve ser uma string.
   * - Este segredo é usado para assinar e verificar tokens JWT.
   * - Ele deve ser seguro e privado, evitando exposição pública.
   */
  JWT_SECRET: z.string(),
});

/*
 * Valida as variáveis de ambiente definidas em 'process.env' usando o esquema definido.
 * - Se alguma variável estiver ausente ou inválida, 'zod' lançará uma exceção.
 * - Caso todas as variáveis sejam válidas, elas são retornadas como um objeto tipado.
 */
export const env = envSchema.parse(process.env);
