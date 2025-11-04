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
"[project]/front_nely/app/api/catalog/products/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/catalog/products/[id]/route.ts
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/server.js [app-route] (ecmascript)");
;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
async function GET(request, { params }) {
    try {
        const productId = params.id;
        console.log('🔍 Fetching product detail:', productId);
        // Fetch product details from Django
        const response = await fetch(`${BACKEND_URL}/catalog/products/${productId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            if (response.status === 404) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Product not found'
                }, {
                    status: 404
                });
            }
            console.error('❌ Django API error:', response.status);
            return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch product'
            }, {
                status: response.status
            });
        }
        const data = await response.json();
        const product = data.data || data;
        console.log('✅ Product fetched:', product.name);
        // Fetch related products
        let relatedProducts = [];
        try {
            const relatedResponse = await fetch(`${BACKEND_URL}/catalog/products/${productId}/related/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });
            if (relatedResponse.ok) {
                const relatedData = await relatedResponse.json();
                relatedProducts = (relatedData.data || relatedData.results || []).map((p)=>({
                        id: p.id,
                        href: `/catalog/products/${p.id}`,
                        imageSrc: p.images?.[0]?.url || '/placeholder.jpg',
                        imageAlt: p.name,
                        title: p.name,
                        sizeLabel: p.available_sizes?.map((s)=>s.name).join(' — ') || '',
                        priceFormatted: `${p.sale_price || p.base_price} сом`,
                        compareAtFormatted: p.sale_price ? `${p.base_price} сом` : undefined,
                        rating: p.rating || 4.5
                    }));
            }
        } catch (error) {
            console.warn('⚠️ Failed to fetch related products:', error);
        }
        // Transform product data for frontend
        const transformedProduct = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            base_price: product.base_price,
            sale_price: product.sale_price,
            description: product.description,
            short_description: product.short_description,
            rating: product.rating || 4.5,
            category_name: product.category_name,
            season_display: product.season_display,
            is_featured: product.is_featured,
            is_new_arrival: product.is_new_arrival,
            // Available colors
            available_colors: (product.available_colors || []).map((color)=>({
                    id: color.id,
                    name: color.name,
                    code: color.code || '#000000'
                })),
            // Available sizes
            available_sizes: (product.available_sizes || []).map((size)=>({
                    id: size.id,
                    name: size.name
                })),
            // Images
            images: (product.images || []).map((img)=>({
                    id: img.id,
                    url: img.url,
                    alt_text: img.alt_text || product.name,
                    is_primary: img.is_primary,
                    display_order: img.display_order,
                    color_id: img.color?.id
                })),
            // Variants for stock checking
            variants: product.variants || []
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            product: transformedProduct,
            relatedProducts
        });
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eb6703b5._.js.map