# REalimenta

Projeto escolar para apoiar o planejamento da merenda e reduzir o desperdício de alimentos.

## Arquitetura

- **Front-end:** React + TypeScript + Vite + Tailwind CSS
- **Back-end:** Node.js + Express
- **Banco de dados:** SQLite
- **Autenticação:** senhas protegidas com `bcryptjs`

O front-end usa `/api/...`; o Vite encaminha essas requisições para a API na porta 3001. Assim, a aplicação funciona corretamente no GitHub Codespaces sem URLs fixas de `localhost` no navegador.

## Executar no GitHub Codespaces

1. Crie o repositório da equipe e envie **o conteúdo desta pasta para a raiz**.
2. Abra **Code → Codespaces → Create codespace on main**.
3. Aguarde o `npm install` automático do `.devcontainer`.
4. Execute:

```bash
npm start
```

5. Abra a porta **5173** em **PORTS**.

`npm start` inicia simultaneamente:

- Vite/React na porta **5173**
- API Express/SQLite na porta **3001**

## Credenciais de demonstração

### Aluno

- RA: `123456`
- Senha: `123456`

Também é possível clicar em **Criar acesso** e cadastrar outro aluno.

### Administrador

- Usuário: `admin`
- Senha: `admin123`

> Essas credenciais são apenas para a demonstração escolar. Em produção, use segredos e um fluxo de autenticação mais robusto.

## O que funciona nesta versão

- criação de cadastro de aluno no SQLite;
- login de aluno por RA e senha;
- senha armazenada como hash;
- login de administrador;
- cardápio do dia;
- cadastro, edição e exclusão de cardápios no painel ADM;
- votação “vou consumir / não vou consumir”;
- um voto por RA por dia;
- contagem dos votos do dia;
- banco criado automaticamente em `backend/realimenta.db`.

## Testar a API

Com `npm start` em execução, abra outro terminal:

```bash
./scripts/testar-api.sh
```

Ou:

```bash
curl http://localhost:3001/api/status
```

## Banco de dados

O arquivo do banco é criado automaticamente em:

```text
backend/realimenta.db
```

Ele **não deve ser enviado ao GitHub**, por isso está no `.gitignore`.

Tabelas criadas:

- `students`
- `admins`
- `meals`
- `votes`

## Observação sobre GitHub Pages

GitHub Pages publica apenas o front-end estático. Ele não executa Node.js/Express nem mantém um SQLite persistente. Para colocar o sistema completo na internet posteriormente, o backend precisará ser hospedado e o banco deverá ser migrado para um serviço persistente/online.
