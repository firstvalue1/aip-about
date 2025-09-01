
from routes.routes import router  # 라우터 import

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import SQLALCHEMY_DATABASE_URI

app = FastAPI()

app.include_router(router)  # 라우터 등록


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