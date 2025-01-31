// Importa a aplicação principal do Express, configurada com middlewares, rotas e tratamento de erros
import { app } from "./app";

/*
 * Define a porta na qual o servidor será executado.
 * - Aqui, a porta 3333 é usada, mas em uma aplicação real, poderia ser configurada com uma variável de ambiente.
 * - Exemplo usando variável de ambiente: const PORT = process.env.PORT || 3333;
 */
const PORT = 3333;

/*
 * Inicia o servidor Express e o faz escutar na porta especificada.
 * - O método 'listen' é assíncrono e começa a ouvir requisições na porta fornecida.
 * - A função de callback é executada quando o servidor é iniciado com sucesso.
 */
app.listen(PORT, () =>
  // Exibe uma mensagem no console indicando que o servidor está em execução e em qual porta
  console.log(`Server is running on port ${PORT}`)
);
