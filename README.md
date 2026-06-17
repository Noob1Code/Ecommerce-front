# Configuração de IPs Antes do Deploy

_Guia de orientação técnica detalhando a substituição de chaves e endereços de IP necessários para o correto funcionamento da conexão do Front-end._

---

## Visão geral

Este documento descreve o procedimento obrigatório de alteração das chaves de IP no código-fonte do front-end antes de realizar o deploy do sistema. O objetivo é garantir que a aplicação aponte para os endpoints e servidores corretos no ambiente de produção, evitando falhas de comunicação (CORS ou erros de conexão) com o back-end. 

Este guia é voltado para os desenvolvedores e responsáveis pela esteira de deploy do projeto.

## Pontos Principais

- **Comunicação Front-Back:** Ajuste das URLs base e proxies para que a integração com o back-end funcione fora do ambiente local.
- **Atenção às Linhas Exatas:** As alterações são pontuais e devem respeitar os arquivos mapeados para não quebrar a compilação.
- **Arquivos Identificados:** O mapeamento abrange configurações do bundler (Vite), adaptadores de domínio (Mappers) e componentes de interface (Backoffice).

---

## Arquivos que Devem ser Alterados

Com base na estrutura de diretórios do projeto, os três arquivos a seguir possuem dependências diretas de IP e devem ser atualizados manualmente antes de subir a aplicação:

### 1. Configuração do Vite
* **Caminho do arquivo:** `../vite.config.ts` *(localizado na pasta raiz, uma pasta antes de `src`)*
* **Linha para alteração:** Linha 11
* **Contexto:** Ajuste do IP do servidor, configurações de host ou regras de proxy de desenvolvimento/build.

### 2. Mapper de Produtos
* **Caminho do arquivo:** `src/features/products/domain/product.mapper.ts`
* **Linha para alteração:** Linha 15
* **Contexto:** Atualização do IP responsável por mapear ou formatar as URLs de dados do produto (ex: imagens, links de APIs específicas).

### 3. Painel de Backoffice de Produtos
* **Caminho do arquivo:** `src/features/products/components/ProductBackoffice.tsx`
* **Linha para alteração:** Linha 411
* **Contexto:** Correção do IP de requisição direta ou endpoint específico de gerenciamento dentro do componente.

---

_Última atualização: 2026-06-17_
