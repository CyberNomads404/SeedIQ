# 🚜✨ SeedIQ App — Plataforma de Análise de Grãos

SeedIQ é uma plataforma modular e animada para classificação e análise de grãos (milho, soja, etc.). O objetivo deste repositório é prover o painel administrativo central e a API central — responsáveis por orquestrar integrações entre o painel, a API de classificação (serviço que processa imagens) e o aplicativo móvel do operador em campo.

Este projeto compõe o MVP dividido em 3 partes integradas:

- 🖥️ Painel Web (este repositório) — aplicação React (Inertia + Laravel) para gerenciamento, visualização de classificações, usuários e monitoramento.
- 🔗 API Central (backend neste repositório em `app/`) — endpoints REST/JSON que servem o painel e o app móvel; autenticação, armazenamento e registros de classificação.
- 🧠 Serviço de Classificação (repositório separado) — API especializada em processamento de imagens e visão computacional que analisa imagens submetidas e retorna resultados (podendo ser local ou em nuvem).
- 📱 Aplicativo Móvel (repositório separado) — interface para operadores em campo (envio de imagens, visualização de resultados e histórico).

Visão resumida do objetivo:

> Desenvolver uma solução móvel e web que auxilie na classificação de grãos por imagem, integrando análise automática (CV) com um painel administrativo para controle e monitoramento.

## 📦 O que há neste repositório

- 🗂️ `app/` — backend Laravel com modelos, controllers, jobs e serviços. Contém a API central e o suporte ao painel Inertia.
- 🎛️ `resources/js/` — frontend React + Inertia (componentes, páginas e layouts do painel administrativo).
- 🗄️ `database/` — migrations e seeders.
- 🐳 `docker/` — imagens e configuração de containers (apache/nginx/php etc.).
- 🛣️ `routes/` — rotas web e api organizadas.

## ⚙️ Principais tecnologias

- Backend: PHP 8.x, Laravel
- Frontend: React + Inertia, Vite
- Banco: MySQL / Postgres (configurável via env)
- Orquestração: Docker / Docker Compose (opções com Sail)
- Processamento de imagens: serviço externo (repositório separado) que se comunica via API

## 🚀 Quickstart — desenvolvimento local

Pré-requisitos:

- 🐳 Docker & Docker Compose (ou Laravel Sail)
- 🔧 Node.js (para desenvolvimento frontend) — se preferir rodar fora do container

Passos rápidos (modo recomendado com Sail/docker):

```bash
# 1. Clonar repositório
git clone <SEU_REPO> seediq
cd seediq

# 2. Executar script de setup (configura .env, dependências básicas)
./dev-setup.sh

# 3. Subir containers
./vendor/bin/sail up -d

# 4. Instalar dependências PHP (se necessário dentro do container)
./vendor/bin/sail composer install

# 5. Rodar migrations e seeders
./vendor/bin/sail artisan migrate --seed

# 6. Instalar dependências JS e rodar front-end (dentro do workspace ou container)
./vendor/bin/sail npm install --prefix resources
./vendor/bin/sail npm run dev --prefix resources

# Acesse: http://localhost (ou porta configurada)
```

Observações:
- Se preferir rodar o frontend localmente (fora do container), rode `npm install` e `npm run dev` dentro de `resources/`.
- As rotas principais do painel usam Inertia; para chamadas externas (app móvel) utilize as rotas da API descritas em `routes/api/...`.

## Rotas e endpoints principais

- Web/painel: rotas em `routes/web/classifications.php` (Inertia)
- API central: rotas em `routes/api/classifications.php` — endpoints para criação/consulta/reanálise de classificações
- Webhooks / classificação: rotas em `routes/webhook/analyze` (integração com serviço de classificação)

> Nota: para detalhes das rotas, verifique os arquivos dentro da pasta `routes/`.

## Fluxo de trabalho (alto nível)

1. Operador no app móvel captura foto da amostra e envia para a API central.
2. API central persiste metadados e envia job para o Serviço de Classificação (via fila ou webhook).
3. Serviço de Classificação processa a imagem e retorna resultado (payload com contagens por classe: good, small, burned, bad_detection, etc.).
4. API central grava o resultado em `classification_results` e notifica painel (e/ou envia webhook ao app).
5. Painel exibe resultado, estatísticas e permite reanálises ou feedbacks manuais.

## Desenvolvimento do frontend

- Estrutura: `resources/js/pages` contém as páginas do painel. Componentes UI reutilizáveis estão em `resources/js/components/ui`.
- Comandos úteis (rodando dentro do container com Sail):

```bash
./vendor/bin/sail npm run dev --prefix resources
./vendor/bin/sail npm run build --prefix resources
```

## Execução de testes

PHP (Laravel):

```bash
./vendor/bin/sail artisan test
```

Javascript (se houver testes configurados):

```bash
./vendor/bin/sail npm run test --prefix resources
```

## Observações sobre integrações externas

- Serviço de Classificação: este repositório não contém a engine de visão computacional — ela vive em outro repositório/serviço. A comunicação ocorre via API (webhook ou requisição HTTP). Garanta chaves/rotas configuradas em `config/webhook.php` e variáveis de ambiente.
- Aplicativo móvel: também está em outro repositório; use a API central deste projeto para autenticação, envio de imagens e consulta de resultados.

## Boas práticas e dicas

- Para reduzir ruído em polling (página de detalhe de classificação), o painel usa polling condicional (só enquanto a classificação estiver em progresso) e trata rejeições para evitar erros no console.
- Resultados da análise podem vir em um payload dentro de `classification_result.payload`; o frontend tenta usar colunas explícitas (good, small, burned, etc.) e, se nulas, faz fallback para `payload.data.result`.

## Estrutura de pastas (resumo)

- `app/` — Laravel backend (Models, Controllers, Jobs)
- `resources/js/` — Frontend React + Inertia
- `database/` — Migrations e Seeders
- `routes/` — Rotas web/api/webhook
- `docker/` — Configs de container

## Contribuição

1. Abra uma issue descrevendo a mudança/bug
2. Crie uma branch a partir de `develop`
3. Faça PR com descrição e testes quando aplicável

## Contato

Para dúvidas e integrações: pedro.henrique.martins404@gmail.com

---
