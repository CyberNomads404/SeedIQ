<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classification;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalUsers      = User::count();
        $totalOperators  = User::whereHas('roles', fn($q) => $q->where('name', 'Operador(a)'))->count();
        $totalAnalyses   = Classification::count();
        $grainsAnalyzed  = Classification::where('status', 'completed')->whereHas('result')->count();

        $roleMap = [
            'Administrador(a)' => 'admin',
            'Suporte'          => 'support',
            'Operador(a)'      => 'operator',
        ];

        $userDistribution = User::with('roles')
            ->get()
            ->flatMap(fn($user) => $user->roles->pluck('name'))
            ->countBy()
            ->mapWithKeys(fn($count, $role) => [
                $roleMap[$role] ?? strtolower($role) => $count
            ]);

        $distribution = [
            'admin'    => $userDistribution['admin'] ?? 0,
            'support'  => $userDistribution['support'] ?? 0,
            'operator' => $userDistribution['operator'] ?? 0,
        ];

        $topGrains = Classification::with('category')
            ->get()
            ->groupBy(fn($c) => $c->category ? $c->category->name : null)
            ->map(fn($items, $name) => [
                'name'     => $name,
                'analyses' => $items->count()
            ])
            ->sortByDesc('analyses')
            ->take(3)
            ->values()
            ->toArray();

        $currentYear  = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        $monthNames = [
            1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr',
            5 => 'Mai', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
            9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez',
        ];

        $classificationsByMonth = Classification::whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(fn($item) => $item->created_at->month)
            ->map(fn($group) => $group->count());

        $monthlyAnalyses = collect(range(1, $currentMonth))->map(function ($month) use ($monthNames, $classificationsByMonth) {
            return [
                'label' => $monthNames[$month],
                'value' => $classificationsByMonth[$month] ?? 0,
            ];
        })->toArray();

        return Inertia::render('auth/painel/dashboard', [
            'stats' => [
                'totalUsers'     => $totalUsers,
                'totalOperators' => $totalOperators,
                'totalAnalyses'  => $totalAnalyses,
                'grainsAnalyzed' => $grainsAnalyzed,
            ],
            'userDistribution' => $distribution,
            'topGrains'        => $topGrains ?: null,
            'monthlyAnalyses'  => $monthlyAnalyses,
        ]);
    }
}
