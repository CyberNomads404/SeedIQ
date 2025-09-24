import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import config from "@/constants/config";
import logo from "@/assets/images/logo.png";

interface Quest2LayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
}

export default function Quest2Layout({ children, title, subtitle, icon, className }: Quest2LayoutProps) {
    return (
        <div className={cn("min-h-screen bg-white dark:bg-slate-900 transition-colors", className)}>
            {/* Header com navegação */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt={`Logo ${config.app_name}`}
                                className="w-8 h-8 rounded-lg"
                            />
                            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {config.app_name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center">
                        {icon && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                                {icon}
                            </div>
                        )}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg sm:text-xl text-blue-100 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-slate-900 transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    {children}
                </div>
            </div>
        </div>
    );
}
