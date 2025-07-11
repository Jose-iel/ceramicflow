# Otimização de Requisições ao Endpoint `/rest/v1/profiles`

## Problema Identificado

O sistema estava fazendo **múltiplas requisições desnecessárias** para o endpoint `/rest/v1/profiles` devido a:

### 1. **Duplicação de Lógica**

- Cada serviço (`EmployeesService`, `OperationsService`, `VehiclesService`, `SalesService`, etc.) implementava o mesmo método `getCurrentUserCeramicId()`
- Todos faziam a mesma consulta: `SELECT ceramic_id FROM profiles WHERE id = auth.uid()`
- **Resultado**: A mesma informação era buscada múltiplas vezes

### 2. **Falta de Cache**

- Cada chamada para qualquer método de serviço resultava em uma nova requisição ao banco
- Não havia reutilização da informação já buscada
- **Resultado**: Desperdício de recursos e latência desnecessária

### 3. **Redundância com AuthService**

- O `AuthService.getCurrentProfile()` já buscava o perfil completo
- Os outros serviços ignoravam isso e faziam suas próprias consultas
- **Resultado**: Informações duplicadas sendo buscadas simultaneamente

## Solução Implementada

### 1. **ProfileCacheService Centralizado**

Criado o arquivo `src/integrations/supabase/api/profile-cache.ts` que:

- **Cache Inteligente**: Armazena o perfil e ceramic_id em memória por 5 minutos
- **Validação de Usuário**: Limpa automaticamente o cache quando o usuário muda
- **Métodos Otimizados**:
  - `getCurrentUserCeramicId()`: Busca apenas o ceramic_id com cache
  - `getCurrentProfile()`: Busca o perfil completo com cache
  - `clearCache()`: Limpa o cache (usado no logout)
  - `invalidateCache()`: Força nova busca na próxima chamada
  - `updateCache()`: Atualiza cache após modificações

### 2. **Refatoração dos Serviços**

Todos os serviços foram atualizados para usar o `ProfileCacheService`:

**Antes:**

```typescript
static async getCurrentUserCeramicId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('ceramic_id')
    .eq('id', session.user.id)
    .single();

  if (!profile?.ceramic_id) {
    throw new Error('Usuário não possui cerâmica associada');
  }

  return profile.ceramic_id;
}
```

**Depois:**

```typescript
static async getCurrentUserCeramicId(): Promise<string> {
  return ProfileCacheService.getCurrentUserCeramicId();
}
```

### 3. **Integração com AuthService**

- `AuthService.getCurrentProfile()` agora usa o cache
- Limpeza automática do cache no logout
- Cache é invalidado nas mudanças de estado de autenticação

### 4. **Arquivos Atualizados**

- ✅ `src/integrations/supabase/api/profile-cache.ts` (novo)
- ✅ `src/integrations/supabase/api/auth.ts`
- ✅ `src/integrations/supabase/api/employees.ts`
- ✅ `src/integrations/supabase/api/operations.ts`
- ✅ `src/integrations/supabase/api/sales.ts`
- ✅ `src/integrations/supabase/api/vehicles.ts`
- ✅ `src/integrations/supabase/api/wood.ts`
- ✅ `src/integrations/supabase/api/clay-consumptions.ts`
- ✅ `src/integrations/supabase/api/maintenances.ts`
- ✅ `src/integrations/supabase/hooks/use-auth.tsx`

## Benefícios da Otimização

### 1. **Redução Drástica de Requisições**

- **Antes**: Cada operação = 1 requisição para profiles
- **Depois**: 1 requisição para profiles a cada 5 minutos (ou mudança de usuário)

### 2. **Melhoria de Performance**

- Redução de latência nas operações
- Menos carga no banco de dados Supabase
- Menor consumo de recursos de rede

### 3. **Maior Eficiência**

- Cache inteligente que se adapta às mudanças de usuário
- Reutilização de dados já carregados
- Invalidação automática quando necessário

### 4. **Melhor UX**

- Operações mais rápidas
- Menos tempo de espera para o usuário
- Interface mais responsiva

## Exemplo de Impacto

**Cenário**: Usuário navega pela dashboard e visualiza:

- Veículos (1 req)
- Funcionários (1 req)
- Operações (1 req)
- Vendas (1 req)
- Manutenções (1 req)

**Antes**: 5 requisições para `/rest/v1/profiles`
**Depois**: 1 requisição para `/rest/v1/profiles` (compartilhada)

**Redução**: 80% menos requisições!

## Monitoramento

Para monitorar a eficácia da otimização:

1. **Network Tab**: Verifique as requisições para `/rest/v1/profiles`
2. **Cache Hits**: O cache deve reutilizar dados por 5 minutos
3. **Performance**: Operações devem estar mais rápidas

## Manutenção Futura

- **Adicionar novos serviços**: Use `ProfileCacheService.getCurrentUserCeramicId()`
- **Invalidar cache**: Use `ProfileCacheService.invalidateCache()` após atualizações de perfil
- **Ajustar tempo de cache**: Modifique `CACHE_DURATION` conforme necessário
