from fastapi import APIRouter, status, HTTPException
from models.db_init import flask_app
from models.aip_dividends import DividendsModel
import uuid
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List
from decimal import Decimal
import logging

# 로깅 설정
logger = logging.getLogger(__name__)

# Pydantic 모델 정의
class DividendsBase(BaseModel):
    date: date
    # 금융 데이터는 float의 부동 소수점 오류를 피하기 위해 Decimal 사용을 권장합니다.
    amount: Decimal
    description: Optional[str] = None

class DividendsCreate(DividendsBase):
    pass

class Dividends(DividendsBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)

class DividendsResponse(BaseModel):
    status: str
    id: str


router = APIRouter(prefix="/api/dividends", tags=["api_dividends"])

@router.get("/", response_model=List[Dividends], summary="Get All Dividends", tags=["Dividends"])
async def get_dividends():
    with flask_app.app_context():
        # DB에서 직접 정렬하는 것이 가장 효율적입니다.
        # 예: investments = InvestModel.query.order_by(InvestModel.invest_date.desc()).all()
        dividends = DividendsModel.query.order_by(DividendsModel.date.desc()).all()

        # __dict__ 대신 Pydantic 모델을 사용하여 명시적으로 데이터를 변환합니다.
        # 이는 SQLAlchemy의 내부 상태(_sa_instance_state)가 노출되는 것을 방지합니다.
        dividends_list = [Dividends.model_validate(div) for div in dividends]
        return dividends_list
    
@router.post(
    "/save",
    response_model=DividendsResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a New Dividends",
    tags=["dividends"]
)
async def add_dividends(dividends: DividendsCreate):
    """새로운 배당 내역을 추가합니다."""
    try:
        with flask_app.app_context():
            # id는 데이터베이스에서 자동 생성(예: auto-increment, UUID default)되도록 하는 것이 일반적입니다.
            new_dividends = DividendsModel(
                id=uuid.uuid4(),
                date=dividends.date,
                amount=dividends.amount,
                description=dividends.description
            )
            new_dividends.save()
            # id가 UUID 객체일 경우를 대비해 str로 변환
            return {"status": "dividends added", "id": str(dividends.id)}
    except Exception as e:
        # 서버 로그에 자세한 에러를 기록합니다.
        logger.error(f"Failed to add dividends: {e}", exc_info=True)
        # 클라이언트에게는 내부 구현 세부사항을 노출하지 않습니다.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An internal server error occurred while adding the dividends."
        )
    
