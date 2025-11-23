import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Users, Activity, Disc, Layers } from 'lucide-react';

function BarChart({ data = [], height = 200 }: any) {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d: any) => d.value), 1);
    const barWidth = 100 / (data.length * 1.5);

    return (
        <div className="flex flex-col gap-4">
            <div style={{ height: `${height}px` }} className="flex items-flex-end justify-center gap-2">
                {data.map((d: any, i: number) => (
                    <div key={i} className="flex flex-col items-center gap-1" style={{ width: `${barWidth}%` }}>
                        <div className="w-full flex items-flex-end justify-center" style={{ height: `${height - 40}px` }}>
                            <div
                                className="bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 hover:opacity-80"
                                style={{
                                    width: '100%',
                                    height: `${(d.value / maxValue) * (height - 40)}px`,
                                    minHeight: d.value > 0 ? '4px' : '0px',
                                }}
                                title={`${d.label}: ${d.value.toLocaleString()}`}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground text-center whitespace-nowrap w-full overflow-hidden text-ellipsis">
                            {d.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatCard({ title, value, delta, icon: Icon, className = '' }: any) {
    return (
        <Card className={`p-4 ${className}`}>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs text-muted-foreground">{title}</div>
                        <div className="text-2xl font-semibold mt-1">{value}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-8 h-8 text-primary/80" />}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DonutChart({ segments = [], size = 120, strokeWidth = 24 }: any) {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((s: number, seg: any) => s + seg.value, 0) || 1;
    let offset = 0;

    return (
        <div className="flex items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map((seg: any, i: number) => {
                    const portion = seg.value / total;
                    const dash = portion * circumference;
                    const strokeDasharray = `${dash} ${circumference - dash}`;
                    const strokeDashoffset = -offset;
                    offset += dash;
                    return (
                        <circle
                            key={i}
                            r={radius}
                            cx={center}
                            cy={center}
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform={`rotate(-90 ${center} ${center})`}
                            strokeLinecap="butt"
                        />
                    );
                })}
                <circle r={radius - strokeWidth / 2} cx={center} cy={center} fill="transparent" />
            </svg>
            <div className="flex flex-col">
                {segments.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                        <span style={{ background: s.color }} className="w-3 h-3 rounded-sm inline-block" />
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-semibold ml-2">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const mock = {
        users: {
            total: 1240,
            admin: 12,
            support: 34,
            operator: 1194,
        },
        totalAnalyses: 58240,
        grainsAnalyzed: 1245000,
        operatorsOnline: 342,
        recentAnalyses: [120, 140, 130, 160, 170, 150, 180, 200, 190, 210, 230, 220],
        topGrains: [
            { name: 'Soja', analyses: 21000 },
            { name: 'Milho', analyses: 17500 },
            { name: 'Trigo', analyses: 9500 },
        ],
        pendingAnalyses: 520,
        successRate: 96.3,
        monthlyAnalyses: [
            { label: 'Jan', value: 4200 },
            { label: 'Fev', value: 3800 },
            { label: 'Mar', value: 5100 },
            { label: 'Abr', value: 4600 },
            { label: 'Mai', value: 5800 },
            { label: 'Jun', value: 4900 },
            { label: 'Jul', value: 6200 },
            { label: 'Ago', value: 5300 },
            { label: 'Set', value: 6100 },
            { label: 'Out', value: 5700 },
            { label: 'Nov', value: 4300 },
        ],
    };

    const userSegments = [
        { label: 'Admin', value: mock.users.admin, color: '#0ea5a4' },
        { label: 'Suporte', value: mock.users.support, color: '#f59e0b' },
        { label: 'Operador', value: mock.users.operator, color: '#2563eb' },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="w-full mx-auto flex flex-col gap-6 px-2 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Usuários totais" value={mock.users.total} delta={3.4} icon={Users} />
                    <StatCard title="Operadores cadastrados" value={mock.users.operator} delta={1.2} icon={Layers} />
                    <StatCard title="Análises totais" value={mock.totalAnalyses.toLocaleString()} delta={2.1} icon={Activity} />
                    <StatCard title="Grãos analisados" value={mock.grainsAnalyzed.toLocaleString()} delta={0.8} icon={Disc} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="p-4 lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Top grãos</div>
                                    <div className="text-lg font-semibold">Tipos mais analisados</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Últimos 30 dias</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                {mock.topGrains.map((g: any) => (
                                    <div key={g.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">{g.name[0]}</div>
                                            <div>
                                                <div className="font-semibold">{g.name}</div>
                                                <div className="text-sm text-muted-foreground">Análises: {g.analyses.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="font-semibold">{((g.analyses / mock.totalAnalyses) * 100).toFixed(1)}%</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="p-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">Distribuição de usuários</div>
                                    <div className="text-lg font-semibold">Por tipo</div>
                                </div>
                                <Badge variant="secondary">Atualizado</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DonutChart segments={userSegments} />
                        </CardContent>
                    </Card>
                </div>

                <Card className="p-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Análises por mês</div>
                                <div className="text-lg font-semibold">Evolução em 2025</div>
                            </div>
                            <Badge variant="secondary">11 meses</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <BarChart data={mock.monthlyAnalyses} height={250} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
