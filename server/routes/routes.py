from fastapi import APIRouter, status, HTTPException
from models.db_init import flask_app
from models.aip_invest import InvestModel
import uuid
from pydantic import BaseModel
from datetime import date
from typing import Optional


class InvestmentCreate(BaseModel):
    invest_date: date
    amount: float  # For financial data, consider using Decimal for better precision
    description: Optional[str] = None

class InvestmentResponse(BaseModel):
    status: str
    id: str


router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/invest")
async def get_investments():
    with flask_app.app_context():
        investments = InvestModel.get_all()
        investments_list = []
        for inv in investments:
            # __dict__를 사용해 객체의 속성을 딕셔너리로 변환
            inv_dict = inv.__dict__
            investments_list.append(inv_dict)
            
        return sorted(investments_list, key=lambda x: x["invest_date"], reverse=True)
    
@router.post(
    "/set/invest"
    , response_model=InvestmentResponse
    , status_code=status.HTTP_201_CREATED
)
async def add_investment(inventment: InvestmentCreate):
    try:
        with flask_app.app_context():
            new_invest = InvestModel(
                id=uuid.uuid4(),
                invest_date=inventment.invest_date,
                amount=inventment.amount,
                description=inventment.description
            )
            new_invest.save()
            return {"status": "investment added", "id": str(new_invest.id)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=str(e)
                            )
    
