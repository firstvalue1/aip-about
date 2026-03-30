# aipeoples 회사관련 정보 및 관련 소스를 종합

- 맥에서 터미날로 볼륨변경 : cd /Volumes/DATA

## React + Vite

-  가상화 서버와 클라이언트 구성

python3 -m venv server

npm create vite@latest client

## uvicorn + FastAPI
uvicorn main:app --reload

## 명령어들
- pip freeze > requirements.txt
- pip install -r requirements.txt



# AIPEOPLES.IPTIME에 이관시
git과 연결되지 않고 수작업으로 이관했음.

 - CLIENT를 PC에서 BUILD후 FTP로 이관 ( 새로운 router가 추가되면 nginx conf 수정해야하는지 확인 필요 )
 - SERVER는 수정된 프로그램으로 이관 ( 필요시 가상환경에서 라이브러리 인스톨해야함. )