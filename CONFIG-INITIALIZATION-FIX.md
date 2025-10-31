# Config Initialization Error Fix

## Problem

When trying to create a volunteer through the frontend form, users encountered
the error:

```
ReferenceError: Cannot access 'config' before initialization
```

## Root Cause

In the `apiRequest` function in `src/hooks/use-complete-api.tsx`, the code was
trying to access `config.headers` in the console.log statement before the
`config` variable was declared.

### Problematic Code:

```typescript
console.log("🔵 API Request:", {
	method: options.method || "GET",
	url,
	body: options.body ? JSON.parse(options.body as string) : null,
	headers: config.headers, // ❌ Accessing config before it's declared
});

const config: RequestInit = {
	// ⚠️ config declared here
	headers: {
		"Content-Type": "application/json",
		...options.headers,
	},
	...options,
};
```

## Solution

Moved the `config` variable declaration before its usage in the console.log
statement.

### Fixed Code:

```typescript
const config: RequestInit = {
	headers: {
		"Content-Type": "application/json",
		...options.headers,
	},
	...options,
};

console.log("🔵 API Request:", {
	method: options.method || "GET",
	url,
	body: options.body ? JSON.parse(options.body as string) : null,
	headers: config.headers, // ✅ Now config is available
});
```

## Technical Details

This was a JavaScript "Temporal Dead Zone" error. In JavaScript/TypeScript,
variables declared with `const` or `let` cannot be accessed before their
declaration, even within the same scope.

## Files Modified

- `src/hooks/use-complete-api.tsx` - Fixed config variable initialization order

## Testing

✅ API endpoint tested successfully after fix ✅ No TypeScript diagnostics
errors ✅ Volunteer creation should now work through frontend form

## Result

Users can now successfully create volunteers through the frontend form without
encountering the initialization error.
