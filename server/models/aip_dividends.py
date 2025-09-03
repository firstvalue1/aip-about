
from models.db_init import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy import func

class DividendsModel(db.Model):
    __tablename__ = 'aip_dividends'
    __table_args__ = {'schema': 'aip'}

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = db.Column(db.DATE)
    amount = db.Column(db.Numeric)
    description = db.Column(db.String)
    attr1 = db.Column(db.String)
    attr2 = db.Column(db.String)
    created_date = db.Column(db.TIMESTAMP, default=func.now())
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