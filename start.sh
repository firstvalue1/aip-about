#!/bin/bash

cd server

if [[ "$VIRTUAL_ENV" != "" ]]; then
echo "가상 환경이 이미 활성화되어 있습니다: $VIRTUAL_ENV"
else
# 가상 환경 활성화
echo "가상 환경을 활성화합니다..."
source ./bin/activate
fi

uvicorn main:app --reload