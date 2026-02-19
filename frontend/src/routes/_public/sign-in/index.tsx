import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { signInSchema } from '@/lib/schemas';

export const Route = createFileRoute('/_public/sign-in/')({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: 'Entrar - CyberGuardian' },
      { name: 'description', content: 'Entre na sua conta CyberGuardian para continuar aprendendo sobre ciberseguranca' },
      { property: 'og:title', content: 'Entrar - CyberGuardian' },
      { property: 'og:description', content: 'Entre na sua conta CyberGuardian para continuar aprendendo sobre ciberseguranca' },
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

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      phone: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = signInSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(parsed.error.errors[0].message);
        return;
      }

      const phoneDigits = value.phone.replace(/\D/g, '');

      try {
        await signIn(phoneDigits, value.password);
        navigate({ to: '/' });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message ?? 'Erro ao fazer login. Tente novamente.');
        } else {
          toast.error('Erro ao fazer login. Tente novamente.');
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
          <p className="text-muted-foreground">Entre na sua conta para continuar</p>
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
                    onBlur: z.string().min(1, 'Senha obrigatoria'),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
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

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Nao tem uma conta?{' '}
              <Link
                to="/sign-up"
                className="text-primary hover:underline font-medium"
              >
                Criar conta
              </Link>
            </p>

            <Button variant="outline" size="sm" asChild>
              <Link to="/ranking">
                <span className="text-lg">{'\u{1F3C6}'}</span>
                Ver Ranking
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
