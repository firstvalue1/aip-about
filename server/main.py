
from routes.invest_routes import router as invest_routes  # 라우터 import
from routes.devidends_routes import router as dividends_router  # 라우터 import

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(invest_routes)  # 라우터 등록
app.include_router(dividends_router)  # 라우터 등록


# CORS 설정
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# Development server execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)