import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import Confetti from "react-confetti";
import { Loader2, CheckCircle, XCircle, Info, Mail } from "lucide-react";
import mailImage from "@/assets/images/verify-email.svg";
import errorImage from "@/assets/images/error.svg";

export default function VerifyEmail() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle');
    const [message, setMessage] = useState('');
    const [showResend, setShowResend] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = params.get('user');
        const hash = params.get('hash');
        const expires = params.get('expires');
        const signature = params.get('signature');

        if (!user || !hash || !expires || !signature) {
            setStatus('idle');
            setShowResend(true);
            return;
        }

        setStatus('loading');
        setMessage('');

        const url = route('verification.verify', {
            id: user,
            hash,
            expires,
            signature,
        });

        axios.get(url)
            .then(res => {
                if (res.data.status === 'success') {
                    setStatus('success');
                    setMessage(res.data.message || 'Seu e-mail foi verificado com sucesso!');
                    setShowResend(false);
                } else if (
                    res.data.message?.toLowerCase().includes('já verificado') ||
                    res.status === 409
                ) {
                    setStatus('already');
                    setMessage(res.data.message);
                    setShowResend(false);
                } else {
                    setStatus('error');
                    setMessage(res.data.message || 'Erro ao verificar seu e-mail.');
                    setShowResend(true);
                }
            })
            .catch(err => {
                if (err.response?.status === 409) {
                    setStatus('already');
                    setMessage(err.response?.data?.message || 'Erro ao verificar seu e-mail.');
                    setShowResend(false);
                } else {
                    setStatus('error');
                    setMessage(err.response?.data?.message || 'Erro ao verificar seu e-mail.');
                    setShowResend(true);
                }
            });
    }, []);

    const [email, setEmail] = useState('');
    const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
    const [resendMsg, setResendMsg] = useState('');

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        setResendStatus('sending');
        setResendMsg('');
        const url = route('verification.resend', { email });

        axios.post(url)
            .then(res => {
                setResendStatus('sent');
                setResendMsg(res.data.message || 'E-mail de verificação reenviado com sucesso!');
            })
            .catch(err => {
                setResendStatus('fail');
                setResendMsg(err.response?.data?.message || 'Erro ao reenviar o e-mail. Verifique o e-mail digitado.');
            });
    };

    const titleClasses = "text-3xl font-bold mb-2 text-center";
    const descClasses = "text-muted-foreground text-sm text-center";

    const renderFeedback = () => {
        switch (status) {
            case 'idle':
                return (
                    <>
                        <Mail className="text-orange-500 w-12 h-12 mb-4" />
                        <h2 className={titleClasses}>Verificar e-mail</h2>
                        <p className={descClasses}>
                            Digite seu e-mail abaixo para receber um link de verificação.
                        </p>
                    </>
                );
            case 'loading':
                return (
                    <>
                        <Loader2 className="animate-spin text-orange-500 w-12 h-12 mb-4" />
                        <h2 className={titleClasses}>Verificando seu e-mail...</h2>
                        <p className={descClasses}>Por favor, aguarde enquanto processamos sua verificação.</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <Confetti width={window.innerWidth} height={window.innerHeight} />
                        <CheckCircle className="text-green-600 w-14 h-14 mb-4 animate-bounce" />
                        <h2 className={titleClasses}>Conta verificada! 🎉</h2>
                        <p className={descClasses}>{message}</p>
                    </>
                );
            case 'already':
                return (
                    <>
                        <Info className="text-blue-500 w-14 h-14 mb-4" />
                        <h2 className={titleClasses}>E-mail já verificado</h2>
                        <p className={descClasses}>{message}</p>
                    </>
                );
            case 'error':
                return (
                    <>
                        <XCircle className="text-red-600 w-14 h-14 mb-4 animate-shake" />
                        <h2 className={titleClasses}>Erro na verificação</h2>
                        <p className={descClasses}>{message}</p>
                        <div className="mt-4 text-xs text-muted-foreground text-center">
                            Ocorreu um erro no sistema ao validar seu e-mail.<br />
                            Você pode solicitar um novo link abaixo.
                        </div>
                    </>
                );
        }
    };

    return (
        <>
            <Head title="Verificação de E-mail" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-5xl">
                    <div className={cn("flex flex-col gap-6")}>
                        <Card className="overflow-hidden shadow-xl border-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                <div className="flex flex-col items-center justify-center p-10 gap-4 min-h-[350px] text-center">
                                    {renderFeedback()}
                                    {showResend && (
                                        <form onSubmit={handleResend} className="w-full mt-6 flex flex-col items-center gap-3">
                                            <label htmlFor="resend-email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {status === 'idle'
                                                    ? 'Digite seu e-mail para receber o link de verificação:'
                                                    : 'Digite seu e-mail para receber um novo link:'
                                                }
                                            </label>
                                            <Input
                                                id="resend-email"
                                                type="email"
                                                required
                                                placeholder="seu@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="max-w-xs"
                                                disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                                            />
                                            <Button
                                                type="submit"
                                                className="w-full max-w-xs"
                                                disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                                            >
                                                {resendStatus === 'sending'
                                                    ? <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                                                    : status === 'idle'
                                                        ? 'Enviar link de verificação'
                                                        : 'Reenviar e-mail'
                                                }
                                            </Button>
                                            {resendMsg && (
                                                <div className={cn(
                                                    "text-xs text-center",
                                                    resendStatus === 'sent' ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {resendMsg}
                                                </div>
                                            )}
                                        </form>
                                    )}
                                </div>
                                <div className="relative hidden bg-muted md:block">
                                    <img
                                        src={status === 'error' ? errorImage : mailImage}
                                        alt={status === 'error' ? "Erro ao verificar e-mail" : "Email verification illustration"}
                                        className="absolute inset-0 h-full w-full object-contain p-10 transition-all duration-300"
                                        draggable={false}
                                        style={{
                                            filter: status === 'error' ? 'none' : undefined,
                                            opacity: status === 'error' ? 1 : 1,
                                        }}
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
