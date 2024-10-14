# 1 - Execução do backend
-Instalar Nodejs v18 ou superior e MySQL;
-Instalar a linha de comando sequelize-cli por meio do comando `npm install -g sequelize-cli`, sem as aspas;
-Clonar repositório backend, branch master;
-Na raiz do projeto backend, criar o arquivo .env de acordo com o exemplo .env.sample (os campos já preenchidos em .env.sample são campos obrigatórios)
-Executar na raiz do projeto backend o comando `npm install`, sem as aspas;
-Executar na raiz do projeto backend o comando `npm run migrate`, sem as aspas;
-Executar `npm start` para iniciar o backend.

# 2 - Executar backend e frontend unificado
-Colocar build do frontend na raiz do projeto backend
-Executar o comando `npm start`
Obs.: as urls que eram acessadas na aplicação localhost:3000, agora serão acessadas no domínio do backend. Exemplo: http://localhost:8888/login em vez de http://localhost:3000/login

# 3 - Execução dos testes unitários
-Executar o comando `npm test`, sem as aspas, na raiz do projeto backend.