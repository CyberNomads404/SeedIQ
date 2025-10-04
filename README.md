# 🚀 Base de Projetos com Laravel

Bem-vindo ao **Base de Projetos com Laravel**! 🎯 

## 🛠️ Tecnologias Utilizadas
- 🐘 **Laravel** - Framework backend robusto
- 🐳 **Docker** - Containerização do ambiente
- 🏔️ **Alpine.js** - Interatividade leve e eficiente
- ⚛️ **React** - Interface moderna e responsiva

## 📖 Sumário
- [🚀 Base de Projetos com Laravel](#-base-de-projetos-com-laravel)
  - [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [📖 Sumário](#-sumário)
  - [🚀 Instalação](#-instalação)
  - [📌 Comandos Essenciais](#-comandos-essenciais)
  - [📂 Estrutura do Projeto](#-estrutura-do-projeto)
  - [📞 Contato](#-contato)

## 🚀 Instalação
Siga os passos abaixo para configurar e iniciar o projeto:

1️⃣ **Clone o repositório:**
```sh
git clone https://github.com/piedro404/seed_iq.git
cd seed_iq
```

2️⃣ **Execute o script de configuração inicial:**
```sh
./dev-setup.sh
```

3️⃣ **Suba os contêineres do projeto com Sail:**
```sh
./vendor/bin/sail up -d
```

4️⃣ **Instale as dependências do Laravel:**
```sh
./vendor/bin/sail composer install
```

5️⃣ **Execute as migrações do banco de dados:**
```sh
./vendor/bin/sail artisan migrate
```

6️⃣ **Popule o banco de dados com dados iniciais:**
```sh
./vendor/bin/sail artisan db:seed --class=DatabaseSeeder
```

7️⃣ **Acesse o projeto no navegador:**
```
http://localhost
```

## 📌 Comandos Essenciais
- **Recontruir o Banco + Seeder**
  ```sh
    ./vendor/bin/sail artisan migrate:fresh --seed
  ```
- **Parar os contêineres:**
  ```sh
  ./vendor/bin/sail down
  ```
- **Acessar o terminal do contêiner:**
  ```sh
  ./vendor/bin/sail shell
  ```
- **Executar testes:**
  ```sh
  ./vendor/bin/sail artisan test
  ```

## 📂 Estrutura do Projeto
- **app/** 🐘 - Código Laravel e Livewire
- **resources/** ⚛️ - Código React
- **database/** 🗄️ - Scripts e migrações do banco
- **docker/** 🐳 - Configurações Docker

## 📞 Contato
🔗 Entre em contato para mais informações: [pedro.henrique.martins404@gmail.com](pedro.henrique.martins404@gmail.com)

🚀 **Agora o sistema está para modificar e utilizar!** 🎉
