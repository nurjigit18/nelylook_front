(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/front_nely/app/(auth)/register/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front_nely/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
/* --- keep your humanizeErrors, toE164, validatePassword helpers as-is --- */ function humanizeErrors(data) {
    if (!data) return "Ошибка регистрации. Попробуйте снова.";
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (data.errors) {
        const errs = [];
        for (const [field, messages] of Object.entries(data.errors)){
            const map = {
                email: "Email",
                phone: "Телефон",
                password: "Пароль",
                first_name: "Имя"
            };
            const label = map[field] || field;
            if (Array.isArray(messages)) errs.push(`${label}: ${messages.join(", ")}`);
            else if (typeof messages === "string") errs.push(`${label}: ${messages}`);
        }
        return errs.length ? errs.join("\n") : "Ошибка валидации.";
    }
    const lines = [];
    for (const [k, v] of Object.entries(data)){
        if (k === "message") continue;
        const map = {
            email: "Email",
            phone: "Телефон",
            password: "Пароль",
            first_name: "Имя"
        };
        const label = map[k] || k;
        if (Array.isArray(v)) lines.push(`${label}: ${v.join(", ")}`);
        else if (typeof v === "string") lines.push(`${label}: ${v}`);
    }
    return lines.length ? lines.join("\n") : "Ошибка регистрации. Попробуйте снова.";
}
function toE164(input, defaultCountry = "KG") {
    const digits = input.replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) {
        const d = digits.replace(/[^\d]/g, "");
        return d.length >= 8 && d.length <= 15 ? digits : null;
    }
    const local = digits.replace(/\D/g, "");
    if (defaultCountry === "KG") {
        if (local.length === 9) return `+996${local}`;
        if (local.length === 10 && local.startsWith("0")) return `+996${local.slice(1)}`;
    }
    return null;
}
function validatePassword(password) {
    if (password.length < 8) return {
        isValid: false,
        error: "Пароль должен содержать минимум 8 символов"
    };
    if (!/[A-Z]/.test(password)) return {
        isValid: false,
        error: "Пароль должен содержать хотя бы одну заглавную букву"
    };
    if (!/[a-z]/.test(password)) return {
        isValid: false,
        error: "Пароль должен содержать хотя бы одну строчную букву"
    };
    if (!/\d/.test(password)) return {
        isValid: false,
        error: "Пароль должен содержать хотя бы одну цифру"
    };
    return {
        isValid: true,
        error: null
    };
}
function RegisterPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPw, setShowPw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPw, setShowConfirmPw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [passwordError, setPasswordError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // success states
    const [registered, setRegistered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [verificationSent, setVerificationSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sendError, setSendError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function loginAndSendVerification(userEmail, userPassword) {
        setSendError(null);
        try {
            // Step 1: Login to get access token
            console.log("🔐 Starting login for:", userEmail);
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword
                })
            });
            console.log("📡 Login response status:", loginRes.status);
            const loginData = await loginRes.json().catch((err)=>{
                console.error("❌ Failed to parse login JSON:", err);
                return {};
            });
            console.log("📦 Full login response data:", JSON.stringify(loginData, null, 2));
            console.log("🔑 Available keys:", Object.keys(loginData));
            if (!loginRes.ok) {
                console.error("❌ Login failed with status:", loginRes.status);
                setSendError("Не удалось войти для отправки письма подтверждения.");
                setVerificationSent(false);
                return;
            }
            // Try multiple possible token field names
            const accessToken = loginData.access || loginData.token || loginData.access_token || loginData.accessToken;
            console.log("🎫 Token search results:");
            console.log("   - loginData.access:", loginData.access ? "✅ Found" : "❌ Not found");
            console.log("   - loginData.token:", loginData.token ? "✅ Found" : "❌ Not found");
            console.log("   - loginData.access_token:", loginData.access_token ? "✅ Found" : "❌ Not found");
            console.log("   - Final accessToken:", accessToken ? "✅ Found" : "❌ Not found");
            if (!accessToken) {
                console.error("❌ No token found in any expected field!");
                console.error("Available data:", loginData);
                setSendError("Не удалось получить токен доступа. Проверьте консоль для деталей.");
                setVerificationSent(false);
                return;
            }
            console.log("✅ Access token obtained:", accessToken.substring(0, 20) + "...");
            console.log("📧 Sending verification email...");
            // Step 2: Send verification email with token
            const verifyRes = await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: userEmail
                })
            });
            console.log("📬 Verification response status:", verifyRes.status);
            const verifyData = await verifyRes.json().catch((err)=>{
                console.error("❌ Failed to parse verification JSON:", err);
                return {};
            });
            console.log("📦 Verification response data:", verifyData);
            if (!verifyRes.ok) {
                console.error("❌ Verification failed:", verifyRes.status, verifyData);
                setSendError(humanizeErrors(verifyData));
                setVerificationSent(false);
                return;
            }
            console.log("✅ Verification email sent successfully!");
            setVerificationSent(true);
        } catch (error) {
            console.error("❌ Unexpected error in loginAndSendVerification:", error);
            setSendError("Произошла непредвиденная ошибка. Проверьте консоль.");
            setVerificationSent(false);
        }
    }
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        if (password !== confirmPassword) {
            setErr("Пароли не совпадают");
            setLoading(false);
            return;
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setErr(passwordValidation.error);
            setLoading(false);
            return;
        }
        const phoneE164 = toE164(phone);
        if (!phoneE164) {
            setErr("Введите корректный номер телефона (пример: +996700123456 или 700123456).");
            setLoading(false);
            return;
        }
        const [first_name, ...rest] = name.trim().split(/\s+/);
        // 1) Register
        const reg = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                first_name: first_name || "",
                phone: phoneE164
            })
        });
        const regData = await reg.json().catch(()=>({}));
        if (!reg.ok) {
            setErr(humanizeErrors(regData));
            setLoading(false);
            return;
        }
        setRegistered(true);
        // 2) Login and send verification
        await loginAndSendVerification(email, password);
        setLoading(false);
    }
    const handlePasswordChange = (value)=>{
        setPassword(value);
        if (value.length > 0) {
            const validation = validatePassword(value);
            setPasswordError(validation.error);
        } else {
            setPasswordError(null);
        }
    };
    const showForm = !registered;
    const showResult = registered;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-dvh",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-[calc(50%-50vw)] w-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[80dvh]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative min-h-[40dvh] md:min-h-[100dvh]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/carousel2.jpg",
                                alt: "Nely Look — регистрация",
                                fill: true,
                                sizes: "(min-width: 768px) 50vw, 100vw",
                                className: "object-cover object-center",
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                lineNumber: 238,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-14",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full max-w-[480px]",
                                children: showForm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl md:text-3xl font-semibold",
                                            children: "Создайте профиль Nely Look"
                                        }, void 0, false, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-neutral-600",
                                            children: "Зарегистрируйтесь для персонализированного шоппинга"
                                        }, void 0, false, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 254,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: onSubmit,
                                            className: "mt-6 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-sm font-medium",
                                                            children: "Ваше имя"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70",
                                                            type: "text",
                                                            autoComplete: "name",
                                                            placeholder: "Имя Фамилия",
                                                            required: true,
                                                            value: name,
                                                            onChange: (e)=>setName(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 259,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-sm font-medium",
                                                            children: "Телефон"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 271,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70",
                                                            type: "tel",
                                                            inputMode: "tel",
                                                            autoComplete: "tel",
                                                            placeholder: "+996700123456 или 700123456",
                                                            required: true,
                                                            value: phone,
                                                            onChange: (e)=>setPhone(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 272,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-xs text-neutral-500",
                                                            children: "Можно в формате +996700123456 или локально 700123456 (авто-нормализация)."
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 282,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-sm font-medium",
                                                            children: "Ваш Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70",
                                                            type: "email",
                                                            inputMode: "email",
                                                            autoComplete: "email",
                                                            placeholder: "Введите ваш e-мейл",
                                                            required: true,
                                                            value: email,
                                                            onChange: (e)=>setEmail(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 289,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-sm font-medium",
                                                            children: "Пароль"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 302,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    className: `w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 ${passwordError ? "border-red-300 focus:ring-red-500" : "focus:ring-black/70"}`,
                                                                    type: showPw ? "text" : "password",
                                                                    autoComplete: "new-password",
                                                                    placeholder: "Минимум 8 символов",
                                                                    required: true,
                                                                    value: password,
                                                                    onChange: (e)=>handlePasswordChange(e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 304,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    "aria-label": showPw ? "Скрыть пароль" : "Показать пароль",
                                                                    onClick: ()=>setShowPw((s)=>!s),
                                                                    className: "absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500",
                                                                    children: showPw ? "🙈" : "👁️"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 315,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 25
                                                        }, this),
                                                        passwordError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-xs text-red-600",
                                                            children: passwordError
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 324,
                                                            columnNumber: 43
                                                        }, this),
                                                        !passwordError && password.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-xs text-green-600",
                                                            children: "✓ Пароль соответствует требованиям"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 326,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-xs text-neutral-500",
                                                            children: "Минимум 8 символов, 1 заглавная буква, 1 строчная буква и 1 цифра"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-sm font-medium",
                                                            children: "Подтвердите пароль"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    className: "w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-black/70",
                                                                    type: showConfirmPw ? "text" : "password",
                                                                    autoComplete: "new-password",
                                                                    placeholder: "Повторите пароль",
                                                                    required: true,
                                                                    value: confirmPassword,
                                                                    onChange: (e)=>setConfirmPassword(e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    "aria-label": showConfirmPw ? "Скрыть пароль" : "Показать пароль",
                                                                    onClick: ()=>setShowConfirmPw((s)=>!s),
                                                                    className: "absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500",
                                                                    children: showConfirmPw ? "🙈" : "👁️"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 345,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 23
                                                }, this),
                                                err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm whitespace-pre-line text-red-600",
                                                    children: err
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 31
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "w-full rounded-lg bg-black py-2 text-white disabled:opacity-60",
                                                    disabled: loading || !!passwordError,
                                                    children: loading ? "Регистрируем…" : "Зарегистрироваться"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 358,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 256,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "my-6 flex items-center gap-3 text-xs text-neutral-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-px flex-1 bg-neutral-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 23
                                                }, this),
                                                " Или продолжить через",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-px flex-1 bg-neutral-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 366,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "flex w-full items-center justify-center gap-3 rounded-lg border px-3 py-2",
                                            type: "button",
                                            onClick: ()=>alert("Подключите Google OAuth"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "18",
                                                    height: "18",
                                                    viewBox: "0 0 24 24",
                                                    "aria-hidden": "true",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M21.35 11.1H12v2.9h5.3c-.23 1.5-1.8 4.4-5.3 4.4A6.3 6.3 0 1 1 17.7 7.9l2.06-2.06A9.05 9.05 0 1 0 12 21a9 9 0 0 0 9.35-9.9Z",
                                                        fill: "currentColor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 23
                                                }, this),
                                                "Google"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 370,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-6 text-center text-sm",
                                            children: [
                                                "Уже есть профиль? ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/login",
                                                    className: "font-medium underline",
                                                    children: "Войти"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 380,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-4 text-center text-xs text-neutral-500",
                                            children: [
                                                "Регистрируясь, вы соглашаетесь с",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/terms",
                                                    className: "underline",
                                                    children: "Условиями использования"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 23
                                                }, this),
                                                " и",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/privacy",
                                                    className: "underline",
                                                    children: "Политикой конфиденциальности"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 383,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-8 h-8 text-green-600",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                lineNumber: 393,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 392,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-semibold",
                                                    children: "Регистрация успешна!"
                                                }, void 0, false, {
                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 23
                                                }, this),
                                                verificationSent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 text-sm text-neutral-600",
                                                            children: [
                                                                "Мы отправили письмо для подтверждения на ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 403,
                                                                    columnNumber: 70
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: email
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 404,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 mt-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: "/login",
                                                                    className: "block w-full rounded-lg bg-black py-2 text-white hover:bg-neutral-800 transition-colors",
                                                                    children: "Перейти ко входу"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: "/send-verification",
                                                                    className: "block w-full text-center rounded-lg border py-2 hover:bg-neutral-50 transition-colors",
                                                                    children: "Отправить повторно"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 410,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-neutral-500 mt-2",
                                                            children: "Не получили письмо? Проверьте папку «Спам» или отправьте повторно."
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 414,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 text-sm text-neutral-600",
                                                            children: "Письмо подтверждения не удалось отправить."
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 27
                                                        }, this),
                                                        sendError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-red-600 whitespace-pre-line",
                                                            children: sendError
                                                        }, void 0, false, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 mt-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "w-full rounded-lg bg-black py-2 text-white hover:bg-neutral-800 transition-colors",
                                                                    onClick: ()=>loginAndSendVerification(email, password),
                                                                    children: "Попробовать отправить снова"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: "/login",
                                                                    className: "block w-full text-center rounded-lg border py-2 hover:bg-neutral-50 transition-colors",
                                                                    children: "Перейти ко входу"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                                    lineNumber: 431,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                                            lineNumber: 424,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                            lineNumber: 398,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                    lineNumber: 390,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                                lineNumber: 250,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                    lineNumber: 235,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
                lineNumber: 234,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
            lineNumber: 233,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/front_nely/app/(auth)/register/page.tsx",
        lineNumber: 232,
        columnNumber: 5
    }, this);
}
_s(RegisterPage, "rKXVvGJIJcsfOeqo6QKKp8SUYTc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$front_nely$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = RegisterPage;
var _c;
__turbopack_context__.k.register(_c, "RegisterPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/front_nely/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/front_nely/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=front_nely_9214b335._.js.map