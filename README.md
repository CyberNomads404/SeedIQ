<div align="center">

# 🌱 SeedIQ — Painel + API Central

Plataforma web de gestão e API central do ecossistema SeedIQ. Orquestra a comunicação entre o app mobile, o serviço de classificação por visão computacional e o painel administrativo.

![PHP](https://img.shields.io/badge/PHP_8.x-777BB4?style=flat&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

</div>

---

## 📸 Preview

| Dashboard | Lista de Classificações |
|-----------|------------------------|
| <img width="1615" height="826" alt="image (9)" src="https://github.com/user-attachments/assets/9adcde56-c005-4f97-963f-f5144f0365f0" /> | <img width="1901" height="911" alt="Captura de tela de 2026-04-13 23-04-45" src="https://github.com/user-attachments/assets/78df2b30-4822-4f6b-87fe-8f346d438497" /> |

| Lista de Categorias | Perfil do Usuário |
|----------------------|------------------|
| <img width="1901" height="911" alt="Captura de tela de 2026-04-13 23-04-38" src="https://github.com/user-attachments/assets/4142c2d2-bc5a-4c48-a2fc-a9a35ec5dc90" /> | <img width="1917" height="913" alt="Captura de tela de 2026-04-13 23-11-21" src="https://github.com/user-attachments/assets/fdf79deb-6544-4787-8481-dad965e4db2b" /> |

| Resultado da Análise  |
|---------------------|
| <img width="618" height="740" alt="Captura de tela de 2026-04-14 00-51-10" src="https://github.com/user-attachments/assets/6c83be7f-258b-4327-ab07-46d4aa7b0d72" /> |

---

## 📌 Sobre o projeto

O SeedIQ é um projeto acadêmico desenvolvido no último semestre do curso de Sistemas de Informação (2025.2), integrando três disciplinas: Programação para Dispositivos Móveis, Segurança e Auditoria de Sistemas e Computação Gráfica e Processamento de Imagens.

Este repositório contém o **Painel Administrativo** (React + Inertia.js) e a **API Central** (Laravel), responsáveis por orquestrar todo o ecossistema:

- Receber imagens enviadas pelo app mobile
- Enfileirar jobs para o serviço de classificação via webhook
- Persistir e servir os resultados
- Prover gestão de usuários, permissões e auditoria

O ecossistema completo é dividido em três repositórios:

| Parte | Repositório | Descrição |
|-------|-------------|-----------|
| 🖥️ Painel + API Central | este repositório | Gestão, dashboard e orquestração |
| 🔬 API de Classificação | [SeedIQ-AI](https://github.com/CyberNomads404/SeedIQ-AI) | Visão computacional com Python + OpenCV |
| 📱 App Mobile | [seediq_app](https://github.com/CyberNomads404/seediq_app) | App Flutter para operadores em campo |

---

## ⚙️ Tecnologias

- **Backend:** PHP 8.x, Laravel
- **Frontend:** React + Inertia.js, Vite
- **Banco de dados:** MySQL / PostgreSQL
- **Orquestração:** Docker + Docker Compose (Laravel Sail)
- **Armazenamento:** Supabase / S3

---

## 🔒 Segurança

O projeto segue práticas de Secure SDLC com:

- Controle de acesso baseado em papéis (RBAC) — Operador, Administrador e Suporte
- Modelagem de ameaças com STRIDE
- Conformidade com a LGPD
- Rate limiting nos endpoints
- Validação de tipo MIME em uploads
- Bcrypt para senhas
- Trilhas de auditoria completas com registro de IP, evento e timestamp

---

## 🔁 Fluxo de funcionamento

<img width="1471" height="904" alt="Diagrama Caso de Uso drawio" src="https://github.com/user-attachments/assets/fbf5b2c4-4a89-44e7-aa84-40ef4beec9dc" />

```
┌─────────────┐        ┌─────────────────┐        ┌──────────────────────┐
│  App Mobile │───────▶│   API Central   │───────▶│  API Classificação   │
│  (Flutter)  │        │    (Laravel)    │        │  (Python + OpenCV)   │
└─────────────┘        └────────┬────────┘        └──────────┬───────────┘
                                │         ◀─ webhook ────────┘
                                │
                       ┌────────▼────────┐
                       │     Painel      │
                       │  Administrativo │
                       │  (React+Inertia)│
                       └─────────────────┘
```

1. Operador captura foto no app e envia para a API Central
2. API Central persiste os metadados e enfileira o job para o serviço de classificação
3. Serviço de classificação processa a imagem e retorna o resultado via webhook
4. API Central grava o resultado e disponibiliza para o painel e o app
5. Painel exibe resultados, estatísticas e permite reanálises

---

## 🚀 Rodando localmente

Pré-requisitos: Docker e Docker Compose

```bash
# 1. Clonar o repositório
git clone https://github.com/CyberNomads404/SeedIQ.git
cd SeedIQ

# 2. Executar o script de setup
./dev-setup.sh

# 3. Subir os containers
./vendor/bin/sail up -d

# 4. Instalar dependências PHP
./vendor/bin/sail composer install

# 5. Rodar migrations e seeders
./vendor/bin/sail artisan migrate --seed

# 6. Instalar dependências JS e rodar o frontend
./vendor/bin/sail npm install --prefix resources
./vendor/bin/sail npm run dev --prefix resources
```

Acesse em: `http://localhost`

---

## 📖 Documentação da API

A documentação completa dos endpoints está disponível no Postman:

👉 [Acessar documentação](https://documenter.getpostman.com/view/44409413/2sB3QGuXTn)

---

## 👥 Equipe

Desenvolvido pela equipe **CyberNomads404** como Projeto Integrador do curso de Sistemas de Informação — 2025.2

- [@Erikli999](https://github.com/Erikli999) – Erikli999
- [@piedro404](https://github.com/piedro404) – Pedro Henrique Martins Borges
- [@thayna-bezerra](https://github.com/thayna-bezerra) – Thayna Bezerra

---

## 📬 Contato

pedro.henrique.martins404@gmail.com
