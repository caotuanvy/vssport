<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Các URI không cần xác thực CSRF.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Thêm API route nếu muốn bỏ qua, ví dụ:
        // 'api/*'
    ];
}
