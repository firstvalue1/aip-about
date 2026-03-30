from fastapi import APIRouter, status, HTTPException
from fastapi.responses import FileResponse
import edge_tts
import logging
import os

from models.db_init import db, flask_app
from models.aip_vocabs import VocabsModel
import uuid
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List

from sqlalchemy import func

# 로깅 설정
logger = logging.getLogger(__name__)

class VocabBase(BaseModel):
    kanji: str
    # 필드들을 Optional로 변경하거나 기본값을 설정하여 422 오류 방지
    furigana: Optional[str] = ""
    meaning: Optional[str] = ""
    language: Optional[str] = "ja"
    memorize_yn: Optional[str] = "N"

class VocabCreate(VocabBase):
    pass

class Vocab(VocabBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)

class VocabActionResponse(BaseModel):
    status: str
    id: str

router = APIRouter(prefix="/api/vocabs", tags=["aip_vocabs"])


@router.get("/", response_model=List[Vocab], summary="Get All Vocabs")
async def get_vocabs():
    with flask_app.app_context():
        try:
            # DB에서 직접 정렬 (date 필드가 VocabsModel에 존재한다고 가정)
            vocabs = VocabsModel.query.order_by(VocabsModel.last_update_date.desc()).all()

            # Pydantic 모델을 사용하여 명시적으로 데이터를 변환
            return [Vocab.model_validate(vocab) for vocab in vocabs]
        except Exception as e:
            logger.error(f"Failed to fetch vocabs: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching vocabulary list."
            )

@router.post(
    "/save"
    , response_model=VocabActionResponse
    , status_code=status.HTTP_201_CREATED
)
async def add_vocabs(vocabs: VocabCreate):
    try:
        with flask_app.app_context():
            new_id = uuid.uuid4()
            new_vocab = VocabsModel(
                id=new_id,
                kanji=vocabs.kanji,
                furigana=vocabs.furigana,
                meaning=vocabs.meaning,
                language=vocabs.language,
                memorize_yn=vocabs.memorize_yn,
                last_update_date=func.now()
            )
            new_vocab.save()
            return {"status": "vocab added", "id": str(new_id)}
    except Exception as e:
        logger.error(f"Failed to add vocab: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail="An error occurred while saving the vocabulary.")
    
@router.delete("/delete/{id}")
async def delete_vocabs(id: str):
    try:
        with flask_app.app_context():
            vocab = VocabsModel.get_by_id(id)
            if vocab:
                db.session.delete(vocab)
                # 오디오파일도 삭제한다.
                audio_dir = "audio"
                filename = os.path.join(audio_dir, f"{id}.mp3")
                if os.path.exists(filename):
                    os.remove(filename)

                db.session.commit()
                return {"status": "vocab deleted"}
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vocab not found")
    except Exception as e:
        logger.error(f"Failed to delete vocab: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail="An error occurred while deleting the vocabulary."
                            )
    
@router.get("/tts")
async def get_tts(id: uuid.UUID, text: str):
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)

    # id를 파일명으로 사용하여 캐싱 처리
    filename = os.path.join(audio_dir, f"{id}.mp3")

    # 파일이 없는 경우에만 생성
    if not os.path.exists(filename):
        communicate = edge_tts.Communicate(text, "ja-JP-NanamiNeural")
        await communicate.save(filename)

    return FileResponse(filename, media_type="audio/mpeg")