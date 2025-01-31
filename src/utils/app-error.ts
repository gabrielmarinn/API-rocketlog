// Define a classe AppError, usada para representar erros personalizados na aplicação
class AppError {
  // Propriedade pública para armazenar a mensagem do erro
  message: string;

  // Propriedade pública para armazenar o código de status HTTP relacionado ao erro
  statusCode: number;

  /*
   * Construtor da classe, responsável por inicializar as propriedades 'message' e 'statusCode'.
   * - Por padrão, o statusCode é 400 (Bad Request), mas pode ser alterado ao instanciar o erro.
   */
  constructor(message: string, statusCode: number = 400) {
    // Atribui a mensagem do erro à propriedade 'message'
    this.message = message;

    // Atribui o código de status à propriedade 'statusCode'
    this.statusCode = statusCode;
  }
}

// Exporta a classe AppError para ser usada em outras partes da aplicação
export { AppError };
