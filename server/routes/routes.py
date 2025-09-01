from fastapi import APIRouter
from models.db_init import flask_app
from models.aip_invest import InvestModel


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
            # id, amount 등 필요한 필드의 타입 변환
                # inv_dict["id"] = str(inv_dict["id"])
                # inv_dict["amount"] = float(inv_dict["amount"])
                
            # get_all 메서드에서 반환되는 InvestModel 객체 리스트를 딕셔너리로 변환할 때,
            # 각 객체의 속성(attribute)을 수동으로 하나씩 지정하지 않고, 
            # 객체의 __dict__  메서드를 활용해 더 효율적으로 처리할 수 있어요.
            # 소스 구성 
            # investments_list = [
            #     {
            #         "id": str(inv.id),
            #         "invest_date": inv.invest_date,
            #         "amount": float(inv.amount),
            #         "description": inv.description
            #         }
            #         for inv in investments
            # ]

            investments_list.append(inv_dict)
            
        return sorted(investments_list, key=lambda x: x["invest_date"], reverse=True)