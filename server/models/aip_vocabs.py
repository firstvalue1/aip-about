#===================================================================================
#                      Copyright(c) 2026 AIPEOPELS
#  *
#  * Project            : 일본어 TTS 개발
#  * Source Description : 일본어 TTS 개발 모델
#  * Author             : PARK SEOK HO
#  * Version            : 1.0.0
#  * Created Date       : 2026-04-01
#  * Modified Date            : 
#  * Last modifier            :
#  * Updated content    : 최초 작성
#  *==================================================================================*/

from models.db_init import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy import func


class VocabsModel(db.Model):
    __tablename__ = 'aip_vocabs'
    __table_args__ = {'schema': 'aip'}

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kanji = db.Column(db.String)
    furigana = db.Column(db.String)
    meaning = db.Column(db.String)
    language = db.Column(db.String)
    momorize_yn = db.Column(db.String)
    last_update_date = db.Column(db.TIMESTAMP, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def save(self):
        db.session.add(self)
        db.session.commit()
        db.session.close()
    
    @classmethod
    def get_all(cls):
        return cls.query.all()
    
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    
