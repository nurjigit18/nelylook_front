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
"[project]/front_nely/app/api/catalog/categories/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/catalog/categories/route.ts
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/server.js [app-route] (ecmascript)");
;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
async function GET(request) {
    try {
        const url = `${BACKEND_URL}/catalog/categories/`;
        console.log('📡 Fetching categories from Django:', url);
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            console.error('❌ Django error:', res.status);
            const errorData = await res.json().catch(()=>({
                    detail: 'Failed to fetch categories'
                }));
            return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(errorData, {
                status: res.status
            });
        }
        const data = await res.json();
        console.log('✅ Django response received:', JSON.stringify(data).substring(0, 200));
        // Handle different response formats:
        // 1. Paginated: { count, results: [...] }
        // 2. APIResponse: { status, data: [...] }
        // 3. Direct array: [...]
        let categories;
        if (data.results && Array.isArray(data.results)) {
            categories = data.results; // ← Paginated response
            console.log('📊 Found paginated results:', categories.length);
        } else if (data.data && Array.isArray(data.data)) {
            categories = data.data; // ← APIResponse wrapper
            console.log('📊 Found data wrapper:', categories.length);
        } else if (Array.isArray(data)) {
            categories = data; // ← Direct array
            console.log('📊 Found direct array:', categories.length);
        } else {
            console.error('❌ Unexpected response format:', Object.keys(data));
            categories = [];
        }
        console.log('📊 Returning categories:', categories.length);
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(categories);
    } catch (error) {
        console.error('❌ Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            detail: 'Server error',
            error: String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9485c7cf._.js.map