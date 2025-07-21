# 📝 **FORM PATTERNS - CeramicFlow**

> **⚠️ CONSTITUTIONAL LAW:** Padrões obrigatórios para todos os formulários. Implementação inconsistente será rejeitada.

---

## 🎯 **FORM ARCHITECTURE CONSTITUTION**

### **Artigo I - Technology Stack (OBRIGATÓRIO)**

#### **Stack Obrigatória**

- **React Hook Form** - Gerenciamento de state
- **Zod** - Validation schemas
- **@hookform/resolvers/zod** - Integration
- **shadcn/ui Form components** - UI base

```typescript
// ✅ IMPORTS OBRIGATÓRIOS para todo form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
```

---

## 📋 **VALIDATION SCHEMA PATTERNS**

### **Artigo II - Schema Templates (OBRIGATÓRIOS)**

#### **Entity Schemas**

```typescript
// ✅ TEMPLATE para entidades
const createEmployeeSchema = z.object({
  // Required fields
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo').trim(),

  role: z.enum(['admin', 'manager', 'operator'], {
    errorMap: () => ({ message: 'Selecione um cargo válido' }),
  }),

  ceramic_id: z.string().uuid('ID do ceramic inválido'),

  // Optional fields
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .optional()
    .or(z.literal('')),

  email: z.string().email('Email inválido').toLowerCase().optional().or(z.literal('')),

  contact: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),

  // Date fields
  admission_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .optional()
    .or(z.literal('')),
});

// ✅ SEMPRE criar schema para update
const updateEmployeeSchema = createEmployeeSchema.partial();

// ✅ EXPORT schemas
export { createEmployeeSchema, updateEmployeeSchema };
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;
```

#### **Common Field Patterns**

```typescript
// ✅ PADRÕES REUTILIZÁVEIS
export const commonFields = {
  // Text fields
  name: z.string().min(2).max(100).trim(),
  description: z.string().max(500).trim().optional().or(z.literal('')),

  // Numbers
  positiveNumber: z.number().positive('Deve ser maior que zero'),
  currency: z.number().min(0).multipleOf(0.01),

  // Dates
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  optionalDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal('')),

  // Documents
  cpf: z
    .string()
    .regex(/^\d{11}$/)
    .optional()
    .or(z.literal('')),
  cnpj: z
    .string()
    .regex(/^\d{14}$/)
    .optional()
    .or(z.literal('')),

  // Contact
  email: z.string().email().toLowerCase().optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\d{10,11}$/)
    .optional()
    .or(z.literal('')),

  // Files
  image: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Arquivo muito grande')
    .refine(file => ['image/jpeg', 'image/png'].includes(file.type), 'Tipo inválido'),
};
```

---

## 🏗️ **FORM COMPONENT PATTERNS**

### **Artigo III - Form Template (OBRIGATÓRIO)**

```typescript
// ✅ TEMPLATE OBRIGATÓRIO para forms
interface EntityFormProps {
  entity?: Entity;  // Para edição
  onSave: (data: CreateEntityFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityForm({ entity, onSave, onCancel, isLoading = false }: EntityFormProps) {
  const form = useForm<CreateEntityFormData>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: {
      name: entity?.name || '',
      role: entity?.role || 'operator',
      ceramic_id: entity?.ceramic_id || '',
      // ... outros campos
    }
  });

  const onSubmit = (data: CreateEntityFormData) => {
    onSave(data);
  };

  // Reset form quando entity muda
  useEffect(() => {
    if (entity) {
      form.reset({
        name: entity.name,
        role: entity.role,
        // ... outros campos
      });
    }
  }, [entity, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Text Field Pattern */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome..."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Field Pattern */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field Pattern */}
        <FormField
          control={form.control}
          name="admission_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Admissão</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? "Salvando..." : entity ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## 📱 **DIALOG FORM PATTERNS**

### **Artigo IV - Dialog Integration (OBRIGATÓRIO)**

```typescript
// ✅ TEMPLATE para forms em dialogs
interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: Entity;
  onSave: (data: CreateEntityFormData) => void;
}

export function EntityDialog({ open, onOpenChange, entity, onSave }: EntityDialogProps) {
  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntity();

  const handleSave = (data: CreateEntityFormData) => {
    if (entity) {
      updateEntity.mutate({ id: entity.id, ...data }, {
        onSuccess: () => {
          onOpenChange(false);
          toast({ title: "Atualizado com sucesso!" });
        }
      });
    } else {
      createEntity.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          toast({ title: "Criado com sucesso!" });
        }
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isLoading = createEntity.isPending || updateEntity.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {entity ? 'Editar' : 'Novo'} Funcionário
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do funcionário.
          </DialogDescription>
        </DialogHeader>

        <EntityForm
          entity={entity}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎛️ **ADVANCED FORM PATTERNS**

### **Artigo V - Complex Forms (Para casos especiais)**

#### **Multi-step Forms**

```typescript
// ✅ Para forms complexos com steps
export function MultiStepEntityForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<ComplexEntityFormData>({
    resolver: zodResolver(complexEntitySchema),
    mode: 'onChange', // Validate on change para steps
  });

  const steps = [
    { title: 'Informações Básicas', fields: ['name', 'role'] },
    { title: 'Contato', fields: ['email', 'phone'] },
    { title: 'Documentos', fields: ['cpf', 'documents'] },
  ];

  const validateStep = async (stepIndex: number) => {
    const fieldsToValidate = steps[stepIndex].fields;
    return await form.trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  // Implementation continues...
}
```

#### **Dynamic Forms**

```typescript
// ✅ Para forms com campos dinâmicos
export function DynamicEntityForm() {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dynamicFields',
  });

  const addField = () => {
    append({ name: '', value: '' });
  };

  // Implementation continues...
}
```

---

## 🚫 **FORBIDDEN PRACTICES**

### **❌ NUNCA FAZER:**

```typescript
// ❌ Form sem validation
const handleSubmit = (e) => {
  e.preventDefault();
  const data = new FormData(e.target);  // Sem validation
  api.create(Object.fromEntries(data));
};

// ❌ State manual para forms
const [name, setName] = useState('');
const [email, setEmail] = useState('');  // Use React Hook Form

// ❌ Validation manual
if (!name || name.length < 2) {
  setError('Nome inválido');  // Use Zod
}

// ❌ Error handling inconsistente
const onError = (error) => {
  alert(error.message);  // Use toast
};

// ❌ Submit sem loading state
<Button type="submit">Salvar</Button>  // Sem disabled/loading

// ❌ Forms sem TypeScript
const handleSubmit = (data) => {  // Sem tipos
  // ...
};
```

---

## ✅ **ERROR HANDLING PATTERNS**

### **Artigo VI - Error Display (OBRIGATÓRIO)**

```typescript
// ✅ Error handling padrão
const handleSubmit = (data: CreateEntityFormData) => {
  createEntity.mutate(data, {
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Funcionário criado com sucesso.',
      });
      onOpenChange(false);
    },
    onError: error => {
      // Log error for debugging
      console.error('Create entity error:', error);

      // Show user-friendly message
      toast({
        title: 'Erro ao criar funcionário',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });
};

// ✅ Server validation errors
const handleServerErrors = (error: any) => {
  if (error.code === 'validation_error' && error.details) {
    // Set field-specific errors
    Object.entries(error.details).forEach(([field, message]) => {
      form.setError(field as keyof CreateEntityFormData, {
        message: message as string,
      });
    });
  }
};
```

---

## 📋 **FORM CHECKLIST (Pré-PR)**

### **Structure Requirements**

- [ ] Form usa React Hook Form + Zod
- [ ] Schema de validação definido
- [ ] Types exportados do schema
- [ ] Error handling implementado
- [ ] Loading states adequados

### **UX Requirements**

- [ ] Labels claras e descritivas
- [ ] Placeholders informativos
- [ ] Validation em tempo real
- [ ] Mensagens de erro específicas
- [ ] Submit disabled durante loading

### **Accessibility Requirements**

- [ ] Labels associadas aos inputs
- [ ] Error messages com aria-describedby
- [ ] Focus management adequado
- [ ] Keyboard navigation funcional

### **Performance Requirements**

- [ ] Default values otimizados
- [ ] Validation mode apropriado
- [ ] Re-renders minimizados
- [ ] Memory leaks prevenidos

---

## 🎯 **FORM UTILITIES (Obrigatórios)**

### **Default Values Helper**

```typescript
// ✅ Helper para default values consistentes
export const getEntityDefaults = (entity?: Partial<Entity>): CreateEntityFormData => ({
  name: entity?.name || '',
  role: entity?.role || 'operator',
  ceramic_id: entity?.ceramic_id || '',
  cpf: entity?.cpf || '',
  email: entity?.email || '',
  contact: entity?.contact || '',
  admission_date: entity?.admission_date ? new Date(entity.admission_date).toISOString().split('T')[0] : '',
});
```

### **Form State Helper**

```typescript
// ✅ Helper para form state management
export const useFormWithDefaults = <T>(schema: z.ZodSchema<T>, defaultValues: T, deps: any[] = []) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, deps);

  return form;
};
```

---

**📝 Todo formulário no projeto DEVE seguir estes padrões. Implementações inconsistentes serão rejeitadas automaticamente.**
