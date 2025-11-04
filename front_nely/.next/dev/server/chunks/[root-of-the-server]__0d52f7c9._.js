module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/front_nely/app/api/auth/me/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/auth/me/route.ts
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
async function GET(request) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const accessToken = cookieStore.get('access_token')?.value;
        console.log('🔍 /api/auth/me called');
        console.log('🍪 All cookies:', cookieStore.getAll().map((c)=>c.name));
        console.log('🔑 Access token exists:', !!accessToken);
        if (accessToken) {
            console.log('🔑 Access token preview:', accessToken.substring(0, 30) + '...');
        }
        if (!accessToken) {
            console.log('❌ No access token found in cookies');
            return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                detail: 'Не авторизован'
            }, {
                status: 401
            });
        }
        console.log('📡 Calling Django /auth/me/...');
        const res = await fetch(`${BACKEND_URL}/auth/me/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        console.log('📥 Django /auth/me/ response status:', res.status);
        if (!res.ok) {
            const errorText = await res.text();
            console.log('❌ Django error response:', errorText);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch  {
                errorData = {
                    detail: errorText
                };
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(errorData, {
                status: res.status
            });
        }
        const data = await res.json();
        console.log('✅ User fetched successfully:', data);
        // Handle the APIResponse wrapper
        const userData = data.data || data;
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(userData);
    } catch (error) {
        console.error('❌ Error in /api/auth/me:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            detail: 'Ошибка сервера',
            error: String(error)
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const accessToken = cookieStore.get('access_token')?.value;
        if (!accessToken) {
            console.log('❌ No access token for PATCH /me');
            return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                detail: 'Не авторизован'
            }, {
                status: 401
            });
        }
        const body = await request.json();
        console.log('📝 Updating user profile:', body);
        const res = await fetch(`${BACKEND_URL}/auth/me/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) {
            console.log('❌ Profile update failed:', data);
            return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
                status: res.status
            });
        }
        console.log('✅ Profile updated successfully');
        // Handle the APIResponse wrapper
        const userData = data.data || data;
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(userData);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            detail: 'Ошибка сервера',
            error: String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d52f7c9._.js.map