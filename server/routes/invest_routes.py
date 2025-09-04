from fastapi import APIRouter, status, HTTPException
from models.db_init import flask_app
from models.aip_invest import InvestModel
import uuid
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List
from decimal import Decimal
import logging

# 로깅 설정
logger = logging.getLogger(__name__)

# Pydantic 모델 정의
class InvestmentBase(BaseModel):
    date: date
    # 금융 데이터는 float의 부동 소수점 오류를 피하기 위해 Decimal 사용을 권장합니다.
    amount: Decimal
    description: Optional[str] = None

"""InvestmentCreate는 InvestmentBase를 상속받아 추가적인 필드 없이 그대로 사용합니다.
pass는 "아무것도 하지 않고 그냥 지나가라"는 의미의 파이썬 문법입니다.
즉, InvestmentCreate 클래스는 InvestmentBase로부터 모든 것을 상속받은 후, 아무런 추가적인 필드나 로직을 정의하지 않는다는 뜻입니다.
"""

class InvestmentCreate(InvestmentBase):
    pass

class Investment(InvestmentBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)

class InvestmentResponse(BaseModel):
    status: str
    id: str


router = APIRouter(prefix="/api/invest", tags=["api_invest"])

@router.get("/", response_model=List[Investment], summary="Get All Investments", tags=["investments"])
async def get_investments():
    """
    모든 투자 내역을 날짜 역순으로 조회합니다.
    
    NOTE: 데이터베이스 수준에서 정렬(ordering) 및 페이지네이션(pagination)을 구현하면
    데이터 양이 많아질 경우 성능을 크게 향상시킬 수 있습니다.
    """
    with flask_app.app_context():
        # DB에서 직접 정렬하는 것이 가장 효율적입니다.
        # 예: investments = InvestModel.query.order_by(InvestModel.invest_date.desc()).all()
        investments = InvestModel.query.order_by(InvestModel.date.desc()).all()

        # __dict__ 대신 Pydantic 모델을 사용하여 명시적으로 데이터를 변환합니다.
        # 이는 SQLAlchemy의 내부 상태(_sa_instance_state)가 노출되는 것을 방지합니다.
        investments_list = [Investment.model_validate(inv) for inv in investments]
            
        # 정렬은 DB에서 하는 것이 가장 좋지만, 애플리케이션 레벨에서 수행해야 한다면 이 방식을 사용합니다.
        return investments_list
    
@router.post(
    "/save",
    response_model=InvestmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a New Investment",
    tags=["investments"]
)
async def add_investment(investment: InvestmentCreate):
    """새로운 투자 내역을 추가합니다."""
    try:
        with flask_app.app_context():
            print(investment)
            print(type(investment))
            new_id = uuid.uuid4()
            # id는 데이터베이스에서 자동 생성(예: auto-increment, UUID default)되도록 하는 것이 일반적입니다.
            new_invest = InvestModel(
                id=new_id,
                date=investment.date,
                amount=investment.amount,
                description=investment.description
            )
            new_invest.save()
            # id가 UUID 객체일 경우를 대비해 str로 변환
            return {"status": "investment added", "id": str(new_id)}
    except Exception as e:
        # 서버 로그에 자세한 에러를 기록합니다.
        logger.error(f"Failed to add investment: {e}", exc_info=True)
        # 클라이언트에게는 내부 구현 세부사항을 노출하지 않습니다.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An internal server error occurred while adding the investment."
        )
    
