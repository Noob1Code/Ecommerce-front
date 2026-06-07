module.exports = {
  forbidden: [
    {
      name: 'restricao-fachada-publica-features',
      comment: 'Garante que módulos externos só acessem a feature pelo arquivo index.ts (barrel)',
      severity: 'error',
      from: { path: '^src/features/([^/]+)' },
      to: {
        path: '^src/features/([^/]+)',
        pathNot: '^src/features/$1|src/features/[^/]+/index\.ts'
      }
    },
    {
      name: 'isolamento-da-camada-shared',
      comment: 'A camada shared deve ser visualmente pura; proibido importar lógica de negócio',
      severity: 'error',
      from: { path: '^src/shared' },
      to: { path: '^src/features|^src/app' }
    },
    {
      name: 'isolamento-da-camada-services',
      comment: 'A camada de infraestrutura técnica global não pode acoplar regras de negócio',
      severity: 'error',
      from: { path: '^src/services' },
      to: { path: '^src/features|^src/app' }
    }
  ]
};
/*
 rodar o comando para verificar se esta corretamente usando os modulos de forma certa --> 
 npm run type-check  (Execute o teste estático global para validarmos as alterações)
 npm run architecture:verify (E execute a barreira de governança que implementámos anteriormente para validar os limites de camadas)

 */