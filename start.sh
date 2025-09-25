#!/bin/bash

cd server

# 가상 환경 활성화
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "가상 환경이 이미 활성화되어 있습니다: $VIRTUAL_ENV"
else
    echo "가상 환경을 활성화합니다..."
    source ./bin/activate
fi
 
# 파라미터에 따라 실행 모드 분기
if [ "$1" == "prod" ]; then
# 운영 모드: gunicorn을 백그라운드에서 실행
    echo "운영(production) 모드로 gunicorn 서버를 백그라운드에서 시작합니다..."
    # 기존 gunicorn 프로세스가 있다면 종료
    pkill -f "gunicorn: master [main:app]"
    # nohup을 사용하여 gunicorn을 백그라운드에서 실행
    # 로그는 gunicorn.log 파일에 저장됩니다.
    # nohup gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app --host 0.0.0.0 --port 8000 > gunicorn.log 2>&1 &
    nohup gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:8000 > gunicorn.log 2>&1 &

    echo "서버가 백그라운드에서 실행 중입니다. 'ps aux | grep gunicorn'으로 확인하세요."
else
    # 개발 모드: uvicorn을 포그라운드에서 실행
    echo "개발(dev) 모드로 uvicorn 서버를 시작합니다..."
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
fi