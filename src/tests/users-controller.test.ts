// Importa o módulo 'supertest', usado para fazer requisições HTTP simuladas durante os testes
import request from "supertest";

// Importa a instância do Prisma Client para manipular o banco de dados nos testes
import { prisma } from "@/database/prisma";

// Importa a aplicação principal do Express, que será usada para testar os endpoints
import { app } from "@/app";

/*
 * Descreve o conjunto de testes relacionados ao UsersController.
 * - O bloco "describe" agrupa os testes relacionados ao gerenciamento de usuários.
 */
describe("UsersController", () => {
  // Variável que armazenará o ID do usuário criado durante os testes
  let user_id: string;

  /*
   * Função executada após todos os testes deste conjunto serem concluídos.
   * - Aqui, ela exclui o usuário de teste do banco de dados para manter o ambiente limpo.
   */
  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  /*
   * Teste para verificar se um novo usuário pode ser criado com sucesso.
   */
  it("should create a new user successfully", async () => {
    // Faz uma requisição POST para o endpoint /users, criando um novo usuário
    const response = await request(app).post("/users").send({
      name: "Test User", // Nome do usuário
      email: "testuser@example.com", // Email do usuário
      password: "password123", // Senha do usuário
    });

    // Verifica se a resposta tem status 201 (Created)
    expect(response.status).toBe(201);

    // Verifica se o corpo da resposta contém a propriedade 'id'
    expect(response.body).toHaveProperty("id");

    // Verifica se o nome do usuário retornado na resposta está correto
    expect(response.body.name).toBe("Test User");

    // Armazena o ID do usuário recém-criado para ser usado posteriormente e para limpeza
    user_id = response.body.id;
  });

  /*
   * Teste para verificar se ocorre um erro ao tentar criar um usuário com um email já existente.
   */
  it("should throw an error if user with same email already exists", async () => {
    // Tenta criar um usuário com o mesmo email que o usuário criado no teste anterior
    const response = await request(app).post("/users").send({
      name: "Duplicate User", // Nome do usuário duplicado
      email: "testuser@example.com", // Email duplicado
      password: "password123", // Senha
    });

    // Verifica se a resposta tem status 400 (Bad Request)
    expect(response.status).toBe(400);

    // Verifica se a mensagem de erro está correta
    expect(response.body.message).toBe("User with same email already exists");
  });

  /*
   * Teste para verificar se ocorre um erro de validação ao enviar um email inválido.
   */
  it("should throw a validation error if email is invalid", async () => {
    // Tenta criar um usuário com um email inválido
    const response = await request(app).post("/users").send({
      name: "Test User", // Nome do usuário
      email: "invalid-email", // Email inválido
      password: "password123", // Senha
    });

    // Verifica se a resposta tem status 400 (Bad Request)
    expect(response.status).toBe(400);

    // Verifica se a mensagem de erro é "validation error"
    expect(response.body.message).toBe("validation error");
  });
});
