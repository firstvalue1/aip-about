/*===================================================================================
 *                    Copyright(c) 2025 AIPEOPELS
 *
 * Project            : 투자정보
 * Source Description : 투자정보 컴포넌트
 * Author             : PARK SEOK HO
 * Version            : 1.0.0
 * Created Date             : 
 * Modified Date            : 
 * Last modifier            :
 * Updated content    : 최초 작성
 *==================================================================================*/

import { useState, useEffect } from 'react';
import { NavBar, Divider, Space, Empty, Card } from 'antd-mobile';
import { fetchInvestmentData } from './api_service'; // API 호출 함수
import {
  SearchOutline,
  UnorderedListOutline
} from 'antd-mobile-icons';


const topTabs = [
  {
    key: 'investment',
    title: '투자금',
  },
  {
    key: 'dividend',
    title: '배당금',
  },
];


function InvestmentInfo() {
  const [activeTopTab, setActiveTopTab] = useState('investment');
  const [investTotalAmount, setInvestTotalAmount] = useState(0);
  const [investmentData, setInvestmentData] = useState([]);

useEffect(() => {
    fetchData();
}, []);

const fetchData = async () => {
    try {
        // API 응답이 [{ id: 1, invest_date: '2025.3.25', amount: 3000000 }, ...] 형태의 배열이라고 가정합니다.
        const data = await fetchInvestmentData(); 
        if (Array.isArray(data)) {
            setInvestmentData(data);
            const total = data.reduce((sum, item) => sum + item.amount, 0);
            setInvestTotalAmount(total);
        }
    } catch (error) {
        console.error("Error fetching investment data:", error);
        setInvestmentData([]);
        setInvestTotalAmount(0);
    }
}

  const onTopTabChange = (key) => {
    setActiveTopTab(key);
  };

  // 각 탭에 대한 컴포넌트
  const renderContent = () => {
    switch (activeTopTab) {
      case 'investment':
        if (investmentData.length === 0) {
          return <Empty description="데이터가 없습니다." />;
        }
        return (
          <div className="content-list-container">
            <div className="list-item header-row">
              <div className="list-column">날 짜</div>
              <div className="list-column">금 액</div>
            </div>
            {investmentData.map((item) => (
              <div className="list-item" key={item.id}>
                <div className="list-column">{item.invest_date}</div>
                <div className="list-column">{Number(item.amount).toLocaleString()}</div>
              </div>
            ))}
          </div>
        );
      case 'dividend':
        return <Empty description="데이터가 없습니다." />;
      default:
        return null;
    }
  };

  return (
<>
<div className="app-container">
      {/* 상단 네비게이션 바 */}
      <NavBar
        backIcon={false}
        right={
          <Space wrap style={{ fontSize: 26 }}>
            <SearchOutline />
            <UnorderedListOutline />
          </Space>
        }
      >
        <div className='header-title'>투자 정보</div>
      </NavBar>
      <Divider />
      
        {/* 상단 탭바 */}
      <div className="top-tabs">
        {topTabs.map(item => (
          <div
            key={item.key}
            className={`top-tab ${activeTopTab === item.key ? 'active' : ''}`}
            onClick={() => onTopTabChange(item.key)}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="content-container">

      <Card headerStyle={{
            color: '#f24db8ff',
          }}
          bodyClassName="custombody"
          title="총 투자금"
      >
            <div>{Number(investTotalAmount).toLocaleString()}원</div>
      </Card>
      <Divider />
      </div>

      <div className="content-container">

          {renderContent()}
      </div>
</div>

</>
  );
}

export default InvestmentInfo;