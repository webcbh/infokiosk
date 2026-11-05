import re

with open("src/main.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "import AdminDashboard from './AdminDashboard.tsx';",
    "import React, { Suspense } from 'react';\nconst AdminDashboard = React.lazy(() => import('./AdminDashboard.tsx'));"
)

content = content.replace(
    "<AdminDashboard />",
    "<Suspense fallback={<div className=\"flex items-center justify-center h-screen\"><div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-primary\"></div></div>}><AdminDashboard /></Suspense>"
)

with open("src/main.tsx", "w") as f:
    f.write(content)
