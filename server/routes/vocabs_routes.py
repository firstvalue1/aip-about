from fastapi import APIRouter, status, HTTPException
from fastapi.responses import FileResponse
import edge_tts

from models.db_init import db, flask_app
from models.aip_vocabs import VocabsModel
import uuid
from pydantic import BaseModel
from datetime import date
from typing import Optional

from sqlalchemy import func


class VocabsCreate(BaseModel):
    kanju: str
    furigana: str
    meaning: str
    language: str
    momorize_yn: str

class VocabsResponse(BaseModel):
    id: str

router = APIRouter(prefix="/api/vocabs", tags=["aip_vocabs"])


@router.get("/vocabs")
async def get_vocabs():
    with flask_app.app_context():
        vocabs = VocabsModel.get_all()
        vocabs_list = []
        for inv in vocabs:
            # __dict__를 사용해 객체의 속성을 딕셔너리로 변환
            inv_dict = inv.__dict__
            vocabs_list.append(inv_dict)
            
        return sorted(vocabs_list, key=lambda x: x["last_update_date"], reverse=True)
    
@router.post(
    "/set/vocabs"
    , response_model=VocabsResponse
    , status_code=status.HTTP_201_CREATED
)
async def add_vocabs(vocabs: VocabsCreate):
    try:
        with flask_app.app_context():
            new_vocab = VocabsModel(
                id=uuid.uuid4(),
                kanji=vocabs.kanji,
                furigana=vocabs.furigana,
                meaning=vocabs.meaning,
                language=vocabs.language,
                momorize_yn=vocabs.momorize_yn,
                last_update_date=func.now()
            )
            new_vocab.save()
            return {"status": "vocab added", "id": str(new_vocab.id)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=str(e)
                            )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=str(e)
                            )
    
@router.delete("/delete/vocabs/{id}")
async def delete_vocabs(id: str):
    try:
        with flask_app.app_context():
            vocab = VocabsModel.get_by_id(id)
            if vocab:
                db.session.delete(vocab)
                db.session.commit()
                return {"status": "vocab deleted"}
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=str(e)
                            )
    
@router.get("/tts")
async def get_tts(text: str):
    filename = f"audio/{uuid.uuid4()}.mp3"
    communicate = edge_tts.Communicate(text, "ja-JP-NanamiNeural")
    await communicate.save(filename)
    return FileResponse(filename, media_type="audio/mpeg")