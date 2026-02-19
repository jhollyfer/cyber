import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { PASSWORD_REGEX } from '@/lib/constants';
import { signUpSchema } from '@/lib/schemas';

export const Route = createFileRoute('/_public/sign-up/')({
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: 'Cadastro - CyberGuardian' },
      { name: 'description', content: 'Crie sua conta gratuita no CyberGuardian e comece a aprender sobre seguranca da informacao' },
      { property: 'og:title', content: 'Cadastro - CyberGuardian' },
      { property: 'og:description', content: 'Crie sua conta gratuita no CyberGuardian e comece a aprender sobre seguranca da informacao' },
      { property: 'og:type', content: 'website' },
    ],
  }),
});

function phoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length > 0) {
    return `(${digits}`;
  }
  return '';
}

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      password: '',
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      const phoneDigits = value.phone.replace(/\D/g, '');

      if (phoneDigits.length !== 11) {
        toast.error('O telefone deve ter exatamente 11 digitos.');
        return;
      }

      const parsed = signUpSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(parsed.error.errors[0].message);
        return;
      }

      try {
        await signUp(value.name, phoneDigits, value.password);
        navigate({ to: '/' });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message ?? 'Erro ao criar conta. Tente novamente.');
        } else {
          toast.error('Erro ao criar conta. Tente novamente.');
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">CyberGuardian</h1>
          </div>
          <p className="text-muted-foreground">Crie sua conta para comecar</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="name">
                  Nome
                </Label>
                <form.Field
                  name="name"
                  validators={{
                    onBlur: z.string().min(1, 'Nome obrigatorio'),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="mt-1.5"
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs mt-1.5">
                          {typeof field.state.meta.errors[0] === 'string' ? field.state.meta.errors[0] : field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </>
                  )}
                </form.Field>
              </div>

              <div>
                <Label htmlFor="phone">
                  Telefone
                </Label>
                <form.Field
                  name="phone"
                  validators={{
                    onBlur: z.string().min(1, 'Telefone obrigatorio'),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(phoneMask(e.target.value))}
                        onBlur={field.handleBlur}
                        maxLength={15}
                        className="mt-1.5"
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs mt-1.5">
                          {typeof field.state.meta.errors[0] === 'string' ? field.state.meta.errors[0] : field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </>
                  )}
                </form.Field>
              </div>

              <div>
                <Label htmlFor="password">
                  Senha
                </Label>
                <form.Field
                  name="password"
                  validators={{
                    onChange: z
                      .string()
                      .min(6, 'Senha deve ter no minimo 6 caracteres')
                      .regex(PASSWORD_REGEX, 'Senha deve ter 1 maiuscula, 1 minuscula, 1 numero e 1 caractere especial'),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Crie uma senha forte"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="mt-1.5"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs mt-1.5">
                          {typeof field.state.meta.errors[0] === 'string' ? field.state.meta.errors[0] : field.state.meta.errors[0]?.message}
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs mt-1.5">
                        Minimo 6 caracteres: 1 maiuscula, 1 minuscula, 1 numero, 1 especial
                      </p>
                    </>
                  )}
                </form.Field>
              </div>

              <form.Subscribe selector={(state) => [state.isSubmitting, state.values.password] as const}>
                {([isSubmitting, password]) => (
                  <Button
                    type="submit"
                    disabled={isSubmitting || (password.length > 0 && !PASSWORD_REGEX.test(password))}
                    className="w-full"
                  >
                    {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Ja tem uma conta?{' '}
              <Link
                to="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
