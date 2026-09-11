from dotenv import load_dotenv
from pathlib import Path

from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH)

SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
if not SQLALCHEMY_DATABASE_URI:
    raise RuntimeError(f"SQLALCHEMY_DATABASE_URI 환경 변수가 설정되지 않았습니다. .env 위치: {ENV_PATH}")

flask_app = Flask(__name__)
flask_app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
flask_app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(flask_app)