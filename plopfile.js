export default function (plop) {
  // Criamos o gerador chamado "feature"
  plop.setGenerator('feature', {
    description: 'Gera uma nova feature completa seguindo a arquitetura estrita do projeto',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Qual o nome da nova feature (ex: reviews, coupons)?'
      }
    ],
    actions: [
      // 1. Camada de Domínio (Types)
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/domain/{{camelCase name}}.types.ts',
        templateContent: `export interface Backend{{pascalCase name}}ResponseDTO {\n  id: string;\n}\n\nexport interface {{pascalCase name}} {\n  id: string;\n}\n`
      },
      // 2. Camada de API (Endpoints)
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/api/{{camelCase name}}Endpoints.ts',
        templateContent: `export const {{constantCase name}}_ENDPOINTS = {\n  base: '/{{dashCase name}}',\n} as const;\n`
      },
      // 3. Camada de API (Métodos HTTP)
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/api/{{camelCase name}}Api.ts',
        templateContent: `import { httpClient } from '../../../services/api/httpClient';\nimport type { Backend{{pascalCase name}}ResponseDTO } from '../domain/{{camelCase name}}.types';\nimport { {{constantCase name}}_ENDPOINTS } from './{{camelCase name}}Endpoints';\n\nexport const fetch{{pascalCase name}}FromApi = async (): Promise<Backend{{pascalCase name}}ResponseDTO[]> => {\n  const response = await httpClient.get<Backend{{pascalCase name}}ResponseDTO[]>({{constantCase name}}_ENDPOINTS.base);\n  return response.data;\n};\n`
      },
      // 4. Camada do Controlador (Hook)
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/hooks/use{{pascalCase name}}Controller.ts',
        templateContent: `import { useState, useEffect } from 'react';\nimport { fetch{{pascalCase name}}FromApi } from '../api/{{camelCase name}}Api';\nimport type { {{pascalCase name}} } from '../domain/{{camelCase name}}.types';\n\nexport const use{{pascalCase name}}Controller = () => {\n  const [data, setData] = useState<{{pascalCase name}}[]>([]);\n  const [isLoaderActive, setIsLoaderActive] = useState(true);\n\n  useEffect(() => {\n    fetch{{pascalCase name}}FromApi()\n      .then((res) => {\n        const mapped = res.map((item) => ({\n          id: item.id,\n        }));\n        setData(mapped);\n      })\n      .finally(() => setIsLoaderActive(false));\n  }, []);\n\n  return {\n    data,\n    isLoaderActive,\n  };\n};\n`
      },
      // 5. Camada Visível (View)
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/components/{{pascalCase name}}Panel.tsx',
        templateContent: `import { use{{pascalCase name}}Controller } from '../hooks/use{{pascalCase name}}Controller';\nimport { Spinner, Card } from '../../../shared/components/ui';\n\nexport const {{pascalCase name}}Panel = () => {\n  const { data, isLoaderActive } = use{{pascalCase name}}Controller();\n\n  if (isLoaderActive) {\n    return <Spinner className="h-6 w-6 text-blue-600" />;\n  }\n\n  return (\n    <div className="space-y-4">\n      <h2 className="text-xl font-bold text-gray-900">{{pascalCase name}} Module</h2>\n      {data.map((item) => (\n        <Card key={item.id} className="p-4 bg-white border border-gray-100 rounded-lg">\n          <p className="text-sm text-gray-700">ID: {item.id}</p>\n        </Card>\n      ))}\n    </div>\n  );\n};\n`
      },
      // 6. Arquivo Barrel (Index para Fachada Pública)
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/index.ts',
        templateContent: `export { {{pascalCase name}}Panel } from './components/{{pascalCase name}}Panel';\nexport type { {{pascalCase name}} } from './domain/{{camelCase name}}.types';\n`
      }
    ]
  });
}