Config Server
```
export const PORT = process.env.PORT!;
export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL!;
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET!;
export const RESEND_API_KEY = process.env.RESEND_API_KEY!;
```

.env.example server
```
DATABASE_URL=""
NODE_ENV = "development"
GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET = ""
PORT = 
FRONTEND_URL = ""
BETTER_AUTH_URL=""
BETTER_AUTH_SECRET = ""
RESEND_API_KEY=""
```

Config Client
```
export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL!;
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL!;
```

.env.example client
```
VITE_API_BASE_URL = "" (Backend URL)
VITE_FRONTEND_URL = ""
```

