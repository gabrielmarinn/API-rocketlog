// Importa o módulo 'supertest', usado para fazer requisições HTTP simuladas durante os testes
import request from "supertest";

// Importa a instância do Prisma Client para manipular o banco de dados nos testes
import { prisma } from "@/database/prisma";

// Importa a aplicação principal do Express, que será usada para testar os endpoints
import { app } from "@/app";

/*
 * Descreve o conjunto de testes relacionados ao SessionsController
 * - O bloco "describe" agrupa os testes relacionados a autenticação (sessões).
 */
describe("SessionsController", () => {
  // Variável que armazenará o ID do usuário criado durante os testes
  let user_id: string;

  /*
   * Função que será executada após todos os testes deste conjunto serem concluídos.
   * - Aqui, ela exclui o usuário de teste do banco de dados para manter o ambiente limpo.
   */
  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  /*
   * Define um teste que verifica se é possível autenticar um usuário e obter um token de acesso.
   */
  it("should authenticate and get access token", async () => {
    /*
     * Faz uma requisição POST para criar um novo usuário.
     * - Envia os dados do usuário no corpo da requisição.
     */
    const userResponse = await request(app).post("/users").send({
      name: "Auth Test User", // Nome do usuário de teste
      email: "auth_test_user@example.com", // Email do usuário de teste
      password: "password123", // Senha do usuário de teste
    });

    // Armazena o ID do usuário recém-criado para uso posterior e exclusão no cleanup
    user_id = userResponse.body.id;

    /*
     * Faz uma requisição POST para o endpoint de autenticação (sessões).
     * - Envia as credenciais do usuário para obter um token de acesso.
     */
    const sessionResponse = await request(app).post("/sessions").send({
      email: "auth_test_user@example.com", // Email do usuário para autenticação
      password: "password123", // Senha do usuário para autenticação
    });

    /*
     * Verifica se a resposta do endpoint de autenticação tem o status HTTP 200 (sucesso).
     */
    expect(sessionResponse.status).toBe(200);

    /*
     * Verifica se o corpo da resposta contém um token válido.
     * - Usa o matcher `expect.any(String)` para confirmar que o token é uma string.
     */
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });
});
