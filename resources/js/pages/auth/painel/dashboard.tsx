import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Disc, Layers } from 'lucide-react';

interface BarChartProps {
    data: Array<{ label: string; value: number }>;
    height?: number;
}

const BarChart = ({ data, height = 200 }: BarChartProps) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barWidth = 100 / (data.length * 1.5);
    const chartHeight = height - 40;

    return (
        <div className="flex flex-col gap-4">
            <div style={{ height: `${height}px` }} className="flex items-flex-end justify-center gap-2">
                {data.map((item, index) => (
                    <div
                        key={`${item.label}-${index}`}
                        className="flex flex-col items-center gap-1"
                        style={{ width: `${barWidth}%` }}
                    >
                        <div className="w-full flex items-flex-end justify-center" style={{ height: `${chartHeight}px` }}>
                            <div
                                className="bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 hover:opacity-80"
                                style={{
                                    width: '100%',
                                    height: `${(item.value / maxValue) * chartHeight}px`,
                                    minHeight: item.value > 0 ? '4px' : '0px',
                                }}
                                title={`${item.label}: ${item.value.toLocaleString()}`}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground text-center whitespace-nowrap w-full overflow-hidden text-ellipsis">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => (
    <Card className="p-4">
        <CardContent>
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs text-muted-foreground">{title}</div>
                    <div className="text-2xl font-semibold mt-1">{value}</div>
                </div>
                <Icon className="w-8 h-8 text-primary/80" />
            </div>
        </CardContent>
    </Card>
);

interface DonutSegment {
    label: string;
    value: number;
    color: string;
}

interface DonutChartProps {
    segments: DonutSegment[];
    size?: number;
    strokeWidth?: number;
}

const DonutChart = ({ segments, size = 120, strokeWidth = 24 }: DonutChartProps) => {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((sum, seg) => sum + seg.value, 0);

    let cumulativeOffset = 0;

    return (
        <div className="flex items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map((segment, index) => {
                    const portion = segment.value / total;
                    const dashLength = portion * circumference;
                    const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
                    const strokeDashoffset = -cumulativeOffset;

                    cumulativeOffset += dashLength;

                    return (
                        <circle
                            key={`${segment.label}-${index}`}
                            r={radius}
                            cx={center}
                            cy={center}
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform={`rotate(-90 ${center} ${center})`}
                            strokeLinecap="butt"
                        />
                    );
                })}
            </svg>

            <div className="flex flex-col gap-1">
                {segments.map((segment, index) => (
                    <div key={`legend-${segment.label}-${index}`} className="flex items-center gap-2 text-sm">
                        <span
                            style={{ backgroundColor: segment.color }}
                            className="w-3 h-3 rounded-sm"
                        />
                        <span className="text-muted-foreground">{segment.label}</span>
                        <span className="font-semibold ml-auto">{segment.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface TopGrain {
    name: string;
    analyses: number;
}

interface TopGrainsCardProps {
    grains: TopGrain[];
    totalAnalyses: number;
}

const TopGrainsCard = ({ grains, totalAnalyses }: TopGrainsCardProps) => (
    <Card className="p-4 lg:col-span-2">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-muted-foreground">Top grãos</div>
                    <div className="text-lg font-semibold">Tipos mais analisados</div>
                </div>
                <Badge variant="secondary">Top 3</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-3">
                {grains.map((grain) => {
                    const percentage = ((grain.analyses / totalAnalyses) * 100).toFixed(1);

                    return (
                        <div key={grain.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-semibold">
                                    {grain.name[0]}
                                </div>
                                <div>
                                    <div className="font-semibold">{grain.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Análises: {grain.analyses.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="font-semibold">{percentage}%</div>
                        </div>
                    );
                })}
            </div>
        </CardContent>
    </Card>
);

interface DashboardProps {
    stats?: {
        totalUsers: number;
        totalOperators: number;
        totalAnalyses: number;
        grainsAnalyzed: number;
    };
    userDistribution?: {
        admin: number;
        support: number;
        operator: number;
    };
    topGrains?: TopGrain[];
    monthlyAnalyses?: Array<{ label: string; value: number }>;
}

export default function Dashboard({
    stats,
    userDistribution,
    topGrains,
    monthlyAnalyses,
}: DashboardProps) {
    if (!stats || !userDistribution || !topGrains || !monthlyAnalyses) {
        return (
            <AuthenticatedLayout header="Dashboard">
                <Head title="Dashboard" />
                <div className="w-full mx-auto flex items-center justify-center h-96">
                    <p className="text-muted-foreground">Carregando dados do dashboard...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const userSegments: DonutSegment[] = [
        { label: 'Admin', value: userDistribution.admin, color: '#1A6E3C' },
        { label: 'Suporte', value: userDistribution.support, color: '#E0A439' },
        { label: 'Operador', value: userDistribution.operator, color: '#11AADF' },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="w-full mx-auto flex flex-col gap-6 px-2 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Usuários totais"
                        value={stats.totalUsers.toLocaleString()}
                        icon={Users}
                    />
                    <StatCard
                        title="Operadores cadastrados"
                        value={stats.totalOperators.toLocaleString()}
                        icon={Layers}
                    />
                    <StatCard
                        title="Análises totais"
                        value={stats.totalAnalyses.toLocaleString()}
                        icon={Activity}
                    />
                    <StatCard
                        title="Grãos analisados"
                        value={stats.grainsAnalyzed.toLocaleString()}
                        icon={Disc}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <TopGrainsCard
                        grains={topGrains}
                        totalAnalyses={stats.totalAnalyses}
                    />

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
                            <Badge variant="secondary">{monthlyAnalyses.length} meses</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <BarChart data={monthlyAnalyses} height={250} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
