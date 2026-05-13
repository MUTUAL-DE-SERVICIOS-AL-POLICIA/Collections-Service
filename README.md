## NOTA: Se debe tener NATS y GATEWAY LEVANTADOS

## 1. Clonar el repositorio

```bash
git clone https://github.com/MUTUAL-DE-SERVICIOS-AL-POLICIA/Collections-Service.git
```

## 2. Crear el archivo .env en base al .env.example
```bash
cp .env.example .env
```

## 3. Instalar las dependencias
```bash
pnpm install
```

## 4. Correr proyecto en modo desarrollo
```bash
pnpm run start:dev
```

## 5. Migraciones

### Crear una migracion
```bash
pnpm run migration:create -- src/database/migrations/NombreDeLaMigracion
```

Estructura usada para base de datos:
```bash
src/database/
├── config/
│   └── data-source.ts
├── migrations/
└── scripts/
    ├── create-migration.ts
    └── ensure-schema.ts
```

### Ver migraciones pendientes y ejecutadas
```bash
pnpm run migration:show
```

### Ejecutar migraciones
```bash
pnpm run migration:run
```

### Revertir la ultima migracion ejecutada
```bash
pnpm run migration:revert
```
