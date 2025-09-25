
from routes.invest_routes import router as invest_routes  # 라우터 import
from routes.devidends_routes import router as dividends_router  # 라우터 import
from models.db_init import flask_app

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import logging.config

app = FastAPI()

# Flask-SQLAlchemy의 쿼리 로깅 비활성화
flask_app.config["SQLALCHEMY_ECHO"] = False

app.include_router(invest_routes)  # 라우터 등록
app.include_router(dividends_router)  # 라우터 등록


# CORS 설정
origins = [
    "http://localhost:5173",  # 개발 환경
    "http://aipeoples.iptime.org",  # 배포 환경
    # "https://your-production-domain.com", # 운영 환경 도메인 추가
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# 개발/운영 환경 모두 지원
if __name__ == "__main__":
    import uvicorn
    # 개발용 서버 실행
    uvicorn.run(app, host="0.0.0.0", port=8000)
