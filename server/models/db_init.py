from dotenv import load_dotenv
load_dotenv()

from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask

SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
if not SQLALCHEMY_DATABASE_URI:
    raise RuntimeError("SQLALCHEMY_DATABASE_URI 환경 변수가 설정되지 않았습니다.")

flask_app = Flask(__name__)
flask_app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
flask_app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(flask_app)