import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import Confetti from "react-confetti";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import mailImage from "@/assets/images/verify-email.svg";
import errorImage from "@/assets/images/error.svg";
import passwordImage from "@/assets/images/password.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import resetPasswordFormSchema from "@/schemas/form-reset-password-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

type ResetPasswordForm = typeof resetPasswordFormSchema._type;

export default function ForgotPassword() {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const userParam = params.get('user');

    const [step, setStep] = useState<'request' | 'validate' | 'reset' | 'success' | 'error'>(
        tokenParam && userParam ? 'validate' : 'request'
    );
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    const [email, setEmail] = useState('');

    const resetForm = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    useEffect(() => {
        if (step === 'validate' && tokenParam && userParam) {
            setStatus('loading');
            axios.post('/api/auth/validation-reset-password', {
                token: tokenParam,
                user_id: userParam,
            })
                .then(res => {
                    if (res.data.status === 'success') {
                        setStep('reset');
                        setStatus('idle');
                    } else {
                        setStep('error');
                        setMessage(res.data.message || 'Token inválido ou expirado.');
                    }
                })
                .catch(err => {
                    setStep('error');
                    setMessage(err.response?.data?.message || 'Token inválido ou expirado.');
                });
        }
    }, [step, tokenParam, userParam]);

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        axios.post('/api/auth/forgot-password', { email })
            .then(res => {
                setStatus('success');
                setMessage(res.data.message || 'Enviamos um link para redefinir sua senha!');
                setRequestSent(true);
            })
            .catch(err => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Erro ao enviar e-mail. Tente novamente.');
            });
    };

    const handleReset = (values: ResetPasswordForm) => {
        setStatus('loading');
        setMessage('');
        axios.post('/api/auth/reset-password', {
            token: tokenParam,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
        })
            .then(res => {
                setStatus('success');
                setStep('success');
                setMessage(res.data.message || 'Senha redefinida com sucesso!');
            })
            .catch(err => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Erro ao redefinir a senha.');
            });
    };

    const handleResend = () => {
        window.location.href = '/auth/forgot-password';
    };

    return (
        <>
            <Head title="Esqueceu a senha?" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-4xl">
                    <div className={cn("flex flex-col gap-6")}>
                        <Card className="overflow-hidden shadow-xl border-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                <div className="flex flex-col items-center justify-center p-10 gap-4 min-h-[350px] text-center">
                                    {/* Solicitar e-mail */}
                                    {step === 'request' && (
                                        <form onSubmit={handleRequest} className="w-full flex flex-col items-center gap-3">
                                            <h2 className="text-2xl font-bold mb-2">Recuperar senha</h2>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                Informe seu e-mail para receber o link de redefinição.
                                            </p>
                                            <Input
                                                id="forgot-email"
                                                type="email"
                                                required
                                                placeholder="seu@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="max-w-xs"
                                                disabled={status === 'loading' || requestSent}
                                            />
                                            <Button
                                                type="submit"
                                                className="w-full max-w-xs"
                                                disabled={status === 'loading' || requestSent}
                                            >
                                                {status === 'loading'
                                                    ? <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                                                    : 'Enviar link'}
                                            </Button>
                                            {status === 'error' && (
                                                <div className="text-xs text-red-600">{message}</div>
                                            )}
                                            {status === 'success' && (
                                                <div className="text-xs text-green-600">{message}</div>
                                            )}
                                        </form>
                                    )}

                                    {/* Validação do token */}
                                    {step === 'validate' && (
                                        <div>
                                            <Loader2 className="animate-spin text-orange-500 w-12 h-12 mb-4 mx-auto" />
                                            <h2 className="text-2xl font-bold mb-2">Validando link...</h2>
                                            <p className="text-muted-foreground text-sm">Aguarde um instante.</p>
                                        </div>
                                    )}

                                    {/* Redefinir senha */}
                                    {step === 'reset' && (
                                        <Form {...resetForm}>
                                            <form onSubmit={resetForm.handleSubmit(handleReset)} className="w-full flex flex-col items-center gap-3">
                                                <h2 className="text-2xl font-bold mb-2">Nova senha</h2>
                                                <FormField control={resetForm.control} name="email" render={({ field }) => (
                                                    <FormItem className="w-full max-w-xs">
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="Seu e-mail"
                                                                autoComplete="email"
                                                                {...field}
                                                                disabled={status === 'loading'}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={resetForm.control} name="password" render={({ field }) => (
                                                    <FormItem className="w-full max-w-xs">
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Nova senha"
                                                                autoComplete="new-password"
                                                                {...field}
                                                                disabled={status === 'loading'}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={resetForm.control} name="password_confirmation" render={({ field }) => (
                                                    <FormItem className="w-full max-w-xs">
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Confirme a nova senha"
                                                                autoComplete="new-password"
                                                                {...field}
                                                                disabled={status === 'loading'}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <Button
                                                    type="submit"
                                                    className="w-full max-w-xs"
                                                    disabled={status === 'loading'}
                                                >
                                                    {status === 'loading'
                                                        ? <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                                                        : 'Redefinir senha'}
                                                </Button>
                                                {status === 'error' && (
                                                    <div className="text-xs text-red-600">{message}</div>
                                                )}
                                            </form>
                                        </Form>
                                    )}

                                    {/* Sucesso */}
                                    {step === 'success' && (
                                        <>
                                            <Confetti width={window.innerWidth} height={window.innerHeight} />
                                            <CheckCircle className="text-green-600 w-14 h-14 mb-4 animate-bounce" />
                                            <h2 className="text-2xl font-bold mb-2">Senha redefinida!</h2>
                                            <p className="text-muted-foreground text-sm">{message}</p>
                                        </>
                                    )}

                                    {/* Erro */}
                                    {step === 'error' && (
                                        <>
                                            <XCircle className="text-red-600 w-14 h-14 mb-4 animate-shake" />
                                            <h2 className="text-2xl font-bold mb-2">Erro</h2>
                                            <p className="text-muted-foreground text-sm">{message}</p>
                                            <Button
                                                variant="outline"
                                                className="mt-4 flex items-center gap-2"
                                                onClick={handleResend}
                                            >
                                                Enviar novamente <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <div className="relative hidden bg-muted md:block">
                                    <img
                                        src={
                                            step === 'error'
                                                ? errorImage
                                                : step === 'reset'
                                                ? passwordImage
                                                : mailImage
                                        }
                                        alt={
                                            step === 'error'
                                                ? "Erro ao redefinir senha"
                                                : step === 'reset'
                                                ? "Redefinir senha"
                                                : "Recuperação de senha"
                                        }
                                        className="absolute inset-0 h-full w-full object-contain p-10 transition-all duration-300"
                                        draggable={false}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <style>
                {`
                @keyframes shake {
                    0% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-8px); }
                    80% { transform: translateX(8px); }
                    100% { transform: translateX(0); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
                `}
            </style>
        </>
    );
}
