# dotatryhard_node                
## project structure
```                    
dotatryhard_node/
    package-lock.json
    README.md
    Dockerfile
    tsconfig.json
    package.json
    yarn.lock
    nodemon.json
    docker-compose.yml
    src/
        infos.ts
        ranking.ts
        index.ts
        player.ts
        interface/
            profile.ts
            matchDetails.ts
            matchHistory.ts
        components/
            Steam/
                profiles.ts
                upDateProfiles.ts
                matchDetails.ts
                matchHistory.ts
                _index.ts
            query/
                matchIds.ts
                avgGlobal.ts
            lists/
                regions.ts
                itens.ts
                ability.ts
                heros.ts
            Math/
                rankingRate.ts
        class/
            Server.ts
            Db.ts
            Revalidate.ts                
```
## Sumário do Projeto

**Objetivo:** Este projeto cria uma API RESTful que fornece dados de jogadores e partidas de Dota 2.  Ele utiliza cache para otimizar o desempenho e integra-se com APIs externas (como a Steam API e OpenDota API) para obter informações de perfis de jogadores e detalhes de partidas.  A aplicação utiliza Node.js, Express.js, Sequelize (para interação com banco de dados MariaDB), e outras bibliotecas para processamento de dados e manipulação de arquivos.

**Dependências:** cors, dotenv, express, jszip, mariadb, node-fetch, sequelize, steamid, sucrase (e dependências de desenvolvimento correspondentes).

**Arquitetura:** A aplicação utiliza uma arquitetura baseada em microsserviços, com diferentes módulos responsáveis por tarefas específicas (recuperação de dados de jogadores, processamento de partidas, gerenciamento de cache, etc.).  Utiliza banco de dados MariaDB para persistência de dados e Docker Compose para orquestração de contêineres (um para a aplicação Node.js e outro para o banco de dados).

**Pipeline:**  (A descrição do pipeline precisa ser preenchida.  Deverá incluir etapas como desenvolvimento, teste, construção e implantação da aplicação).


**Funcionalidades:** A API expõe endpoints para:

* Recuperar informações de perfis de jogadores (incluindo dados do Steam).
* Obter histórico de partidas para um determinado jogador.
* Buscar detalhes de partidas específicas (estatísticas dos jogadores, resultados, etc.).
* Gerar rankings de jogadores com base em suas estatísticas.

**Instalação:**

1. Clonar o repositório.
2. Instalar as dependências usando o gerenciador de pacotes npm ou yarn.
3. Criar um arquivo `.env` com as configurações de ambiente (credenciais de API, informações do banco de dados, etc.).
4. Executar o servidor.


**Uso:**  (A descrição de como usar a API precisa ser preenchida, detalhando como acessar os diferentes endpoints e os formatos dos dados retornados).
                
                