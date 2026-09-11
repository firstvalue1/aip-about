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
  const [displayPriority, setDisplayPriority] = useState('meaning');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [form] = Form.useForm();
  const isTtsPlayingRef = React.useRef(false);
  const shouldStopPlaybackRef = React.useRef(false);

  useEffect(() => { fetchVocabs(); }, []);

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const stopAllTTS = () => {
    shouldStopPlaybackRef.current = true;
  };

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
    if (isTtsPlayingRef.current) {
      return;
    }

    isTtsPlayingRef.current = true;
    setIsTtsPlaying(true);

    try {
      await playTTSData(id, text, speed);
    } catch (err) {
      Toast.show({ content: '음성 재생 실패', icon: 'fail' });
    } finally {
      isTtsPlayingRef.current = false;
      setIsTtsPlaying(false);
    }
  };

  // 3.1 전체 재생
  const playAllTTS = async () => {
    if (isTtsPlayingRef.current) {
      stopAllTTS();
      return;
    }

    if (vocabs.length === 0) {
      Toast.show('재생할 단어가 없습니다.');
      return;
    }

    Toast.show('순차 재생을 시작합니다.');
    shouldStopPlaybackRef.current = false;
    isTtsPlayingRef.current = true;
    setIsTtsPlaying(true);

    try {
      for (const v of vocabs) {
        if (shouldStopPlaybackRef.current) {
          Toast.show('재생을 중단했습니다.');
          break;
        }

        await playTTSData(v.id, v.kanji, speed);

        if (shouldStopPlaybackRef.current) {
          Toast.show('재생을 중단했습니다.');
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!shouldStopPlaybackRef.current) {
        Toast.show('재생이 완료되었습니다.');
      }
    } catch (err) {
      Toast.show({ content: '음성 재생 실패', icon: 'fail' });
    } finally {
      shouldStopPlaybackRef.current = false;
      isTtsPlayingRef.current = false;
      setIsTtsPlaying(false);
    }
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
      <div style={{ backgroundColor: '#fff', marginTop: '12px', borderRadius: '12px', overflow: 'hidden' }}>
        <div
          onClick={toggleForm}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            borderBottom: isFormOpen ? '1px solid #f0f0f0' : 'none',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          <span>새 단어 추가</span>
          <span style={{ fontSize: '14px', color: '#666' }}>{isFormOpen ? '접기' : '펼치기'}</span>
        </div>

        {isFormOpen && (
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
        )}
      </div>

      {/* 재생 속도 설정 섹션 */}
      <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>재생 속도 설정</div>
          <Button 
            color='primary' 
            fill='none' 
            onClick={playAllTTS}
            disabled={isTtsPlaying ? false : false}
            style={{ padding: 0, height: 'auto', opacity: isTtsPlaying ? 0.8 : 1 }}
          >
            <Space align='center' style={{ '--gap': '4px' }}>
              <PlayOutline style={{ fontSize: 22, color: isTtsPlaying ? '#ff4d4f' : undefined }} />
              <span style={{ fontSize: '14px', color: isTtsPlaying ? '#ff4d4f' : undefined }}>{isTtsPlaying ? 'STOP' : '전체 순차 재생'}</span>
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

      {/* 표시 우선순위 설정 섹션 */}
      <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginTop: '12px' }}>
        <div style={{ fontSize: '14px', color: '#666', fontWeight: 'bold', marginBottom: '8px' }}>
          표시 우선순위
        </div>
        <Selector
          options={[
            { label: '한글 우선', value: 'meaning' },
            { label: '일본어 우선', value: 'kanji' },
          ]}
          value={[displayPriority]}
          onChange={(v) => {
            if (v.length) setDisplayPriority(v[0]);
          }}
        />
      </div>

      {/* 리스트 섹션 */}
      <List header='단어 목록 (왼쪽으로 밀어서 삭제)'>
        {vocabs.map((v) => {
          const isMeaningPriority = displayPriority === 'meaning';
          const primaryText = isMeaningPriority ? v.meaning : v.kanji;
          const secondaryText = isMeaningPriority
            ? `${v.kanji}${v.furigana ? ` / ${v.furigana}` : ''}`
            : `${v.meaning}${v.furigana ? ` / ${v.furigana}` : ''}`;

          return (
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
                prefix={
                  <SoundOutline
                    onClick={isTtsPlaying ? undefined : () => playTTS(v.id, v.kanji)}
                    style={{
                      fontSize: 24,
                      color: isTtsPlaying ? '#d9d9d9' : '#1677ff',
                      cursor: isTtsPlaying ? 'not-allowed' : 'pointer',
                      pointerEvents: isTtsPlaying ? 'none' : 'auto',
                      opacity: isTtsPlaying ? 0.6 : 1,
                    }}
                  />
                }
                description={secondaryText}
                extra={
                  <DeleteOutline
                    onClick={isTtsPlaying ? undefined : () => deleteVocab(v.id)}
                    style={{
                      color: isTtsPlaying ? '#d9d9d9' : '#ff4d4f',
                      cursor: isTtsPlaying ? 'not-allowed' : 'pointer',
                      pointerEvents: isTtsPlaying ? 'none' : 'auto',
                      opacity: isTtsPlaying ? 0.6 : 1,
                    }}
                  />
                }
              >
                <b
                  onClick={isTtsPlaying ? undefined : () => playTTS(v.id, v.kanji)}
                  style={{
                    fontSize: '18px'
                  }}
                >
                  {primaryText}
                </b>
              </List.Item>
            </SwipeAction>
          );
        })}
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
