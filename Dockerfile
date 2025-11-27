FROM php:8.4-fpm

# Instala dependências do sistema e Node.js (Node 18)
RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg \
        build-essential \
        pkg-config \
        libonig-dev \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libzip-dev \
        libxml2-dev \
        unzip \
        git \
    ; \
    # configura e instala gd separadamente (requer libpng/libjpeg/libfreetype)
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j"$(nproc)" gd zip pdo_mysql mysqli; \
    # instala mbstring depois (usa oniguruma via pkg-config)
    docker-php-ext-install -j"$(nproc)" mbstring; \
    # instala Node.js (Node 18)
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -; \
    apt-get install -y --no-install-recommends nodejs; \
    apt-get clean; rm -rf /var/lib/apt/lists/*

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
