// Declara um namespace customizado para o módulo 'Express'
declare namespace Express {
  /*
   * Estende a interface 'Request' do Express para incluir uma nova propriedade 'user'.
   * Isso permite que a aplicação reconheça que a propriedade 'req.user' está disponível nas requisições.
   */
  export interface Request {
    /*
     * Propriedade opcional 'user' que será usada para armazenar informações sobre o usuário autenticado.
     * - É opcional (indicada pelo '?' após 'user') porque nem todas as requisições precisam ter um usuário autenticado.
     */
    user?: {
      id: string; // O ID do usuário autenticado (geralmente recuperado do token JWT)
      role: string; // O papel do usuário (por exemplo: "admin", "customer", "sale")
    };
  }
}
