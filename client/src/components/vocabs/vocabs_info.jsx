import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  List, 
  Input, 
  Button, 
  Form, 
  NavBar, 
  Toast, 
  SwipeAction, 
  Space,
  Selector
} from 'antd-mobile';
import { SoundOutline, DeleteOutline, PlayOutline } from 'antd-mobile-icons';

import { fetchVocabsData, saveVocabsData, deleteVocabsData, playTTSData } from '../api_service'; // API 호출 함수

function VocabsInfo() {
  const [vocabs, setVocabs] = useState([]);
  const [speed, setSpeed] = useState(0.8); // 기본 속도를 0.8로 설정
  const [form] = Form.useForm();

  useEffect(() => { fetchVocabs(); }, []);

  // 1. 단어 목록 가져오기
  const fetchVocabs = async () => {
    try {
      const response = await fetchVocabsData();
      setVocabs(response);
    } catch (err) {
      console.log(err);
    }
  };

  // 2. 단어 등록
  const onFinish = async (values) => {
    try {
      await saveVocabsData(values);
      Toast.show({ content: '등록 완료', icon: 'success' });
      form.resetFields();
      fetchVocabs();
    } catch (err) {
      Toast.show({ content: '등록 실패', icon: 'fail' });
    }
  };

  // 3. TTS 재생
  const playTTS = async (id, text) => {
    try {
        await playTTSData(id, text, speed);
    } catch (err) {
      Toast.show({ content: '음성 재생 실패', icon: 'fail' });
    }
  };

  // 3.1 전체 재생
  const playAllTTS = async () => {
    if (vocabs.length === 0) {
      Toast.show('재생할 단어가 없습니다.');
      return;
    }

    Toast.show('순차 재생을 시작합니다.');
    for (const v of vocabs) {
      // playTTS가 이제 오디오가 끝날 때까지 await 합니다.
      await playTTS(v.id, v.kanji);
      // 단어와 단어 사이 0.5초 간격 추가
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    Toast.show('재생이 완료되었습니다.');
  };

  // 4. 단어 삭제
  const deleteVocab = async (id) => {
    await deleteVocabsData(id);
    Toast.show('삭제되었습니다');
    fetchVocabs();
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar backArrow={false}>일본어 단어장</NavBar>

      {/* 입력 폼 섹션 */}
      <Form
        form={form}
        onFinish={onFinish}
        footer={
          <Button block type='submit' color='primary' size='large'>
            단어 등록
          </Button>
        }
        mode='card'
      >
        <Form.Header>새 단어 추가</Form.Header>
        <Form.Item name='kanji' label='일본어(한자)' rules={[{ required: true }]}>
          <Input placeholder='예: 食べる' />
        </Form.Item>
        <Form.Item name='furigana' label='후리가나'>
          <Input placeholder='예: たべる' />
        </Form.Item>
        <Form.Item name='meaning' label='한국어 뜻' rules={[{ required: true }]}>
          <Input placeholder='예: 먹다' />
        </Form.Item>
      </Form>

      {/* 재생 속도 설정 섹션 */}
      <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>재생 속도 설정</div>
          <Button 
            color='primary' 
            fill='none' 
            onClick={playAllTTS}
            style={{ padding: 0, height: 'auto' }}
          >
            <Space align='center' style={{ '--gap': '4px' }}>
              <PlayOutline style={{ fontSize: 22 }} />
              <span style={{ fontSize: '14px' }}>전체 순차 재생</span>
            </Space>
          </Button>
        </div>
        <Selector
          options={[
            { label: '1.0x', value: 1.0 },
            { label: '0.8x', value: 0.8 },
            { label: '0.7x', value: 0.7 },
            { label: '0.5x', value: 0.5 },
          ]}
          value={[speed]}
          onChange={(v) => {
            if (v.length) setSpeed(v[0]);
          }}
        />
        
      </div>

      {/* 리스트 섹션 */}
      <List header='단어 목록 (왼쪽으로 밀어서 삭제)'>
        {vocabs.map((v) => (
          <SwipeAction
            key={v.id}
            rightActions={[
              {
                key: 'delete',
                text: '삭제',
                color: 'danger',
                onClick: () => deleteVocab(v.id),
              },
            ]}
          >
            <List.Item
              prefix={<SoundOutline onClick={() => playTTS(v.id, v.kanji)} style={{ fontSize: 24, color: '#1677ff', cursor: 'pointer' }} />}
              description={`${v.furigana} - ${v.meaning}`}
              extra={<DeleteOutline onClick={() => deleteVocab(v.id)} style={{ color: '#ff4d4f' }} />}
            >
              <b style={{ fontSize: '18px' }}>{v.kanji}</b>
            </List.Item>
          </SwipeAction>
        ))}
      </List>
      
      {vocabs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          등록된 단어가 없습니다.
        </div>
      )}
    </div>
  );
}

export default VocabsInfo;
