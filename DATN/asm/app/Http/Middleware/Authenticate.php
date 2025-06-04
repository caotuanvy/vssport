<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        if (Auth::guard($guards[0] ?? 'web')->check()) {
            return $next($request);
        }

        abort(401, 'Unauthenticated.');
    }
}
