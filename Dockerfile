FROM php:8.4-fpm

# Instala dependências do sistema e Node.js (Node 18)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos do projeto para a imagem
COPY . .

# Instala as dependências do PHP (produção)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Instala as dependências do Node e gera assets
RUN npm install --production=false && npm run build

# Expondo a porta 80
EXPOSE 80

# Comando para iniciar o servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
