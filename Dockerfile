# imagem base
FROM node:20

# Diretório onde ficará a aplicação
WORKDIR /app

# Copia a pasta do código font
COPY . .

ENV DB_HOST='assembleia-mysql'

# Executa o comando para baixar as dependências
RUN npm install

# Executa o comando de Build
RUN npm run build

CMD ["node", "dist/main.js"]

