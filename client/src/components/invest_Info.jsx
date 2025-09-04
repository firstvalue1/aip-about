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
import { useNavigate } from 'react-router-dom';
import { NavBar, Divider, Space, Empty, SafeArea } from 'antd-mobile';
import { fetchDividendsData, fetchInvestmentData } from './api_service'; // API 호출 함수
import topTabs from './common/topTap'; // 상단 탭 데이터
import ListContent from './common/listContent'; // 리스트 컴포넌트
import TotalAmount from './common/totalAmount'; // 총액 컴포넌트
import {
  AddOutline
} from 'antd-mobile-icons';


function InvestmentInfo() {
  const [activeTopTab, setActiveTopTab] = useState('investment');
  const [investTotalAmount, setInvestTotalAmount] = useState(0);
  const [investmentData, setInvestmentData] = useState([]);
  const [dividentTotalAmount, setDividentTotalAmount] = useState(0);
  const [dividentData, setDividentData] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
    investmentFetchData();
    dividendsFetchData();
}, []);

const investmentFetchData = async () => {
    try {
        // API 응답이 [{ id: 1, invest_date: '2025.3.25', amount: 3000000 }, ...] 형태의 배열이라고 가정합니다.
        const data = await fetchInvestmentData(); 
        if (Array.isArray(data)) {
            setInvestmentData(data);
            const total = data.reduce((sum, item) => {
                const amount = parseFloat(item.amount) || 0;
                return sum + amount;
            }, 0);
            setInvestTotalAmount(total);
        }
    } catch (error) {
        console.error("Error fetching investment data:", error);
        setInvestmentData([]);
        setInvestTotalAmount(0);
    }
}

const dividendsFetchData = async () => {
    try {
       
        const data = await fetchDividendsData(); 
        if (Array.isArray(data)) {
            setDividentData(data);
                        const total = data.reduce((sum, item) => {
                const amount = parseFloat(item.amount) || 0;
                return sum + amount;
            }, 0);
            setDividentTotalAmount(total);
        }
    } catch (error) {
        console.error("Error fetching dividends data:", error);
        setDividentData([]);
        setDividentTotalAmount(0);
    }
}

  const onTopTabChange = (key) => {
    setActiveTopTab(key);
  };

  const handleAddClick = () => {
    switch (activeTopTab) {
      case 'investment':
        navigate('/add-investment'); // 투자금 입력 화면으로 이동
        break;
      case 'dividend':
        navigate('/add-dividends'); // 배당금 입력 화면으로 이동
        break;
      default:
        break;
    }
  };

  // 각 탭에 대한 컴포넌트
  const RenderContent = () => {
    switch (activeTopTab) {
      case 'investment':
        if (investmentData.length === 0) {
          return <Empty description="데이터가 없습니다." />;
        }
        return (
          <>
            <TotalAmount title="총 투자금" totalAmount={investTotalAmount} />
            <ListContent listData={investmentData} />
          </>
        );
      case 'dividend':
        if (dividentData.length === 0) {
          return <Empty description="데이터가 없습니다." />;
        }
        return (
          <>
            <TotalAmount title="총 배당금" totalAmount={dividentTotalAmount} />
            <ListContent listData={dividentData} />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
<>
<div className="app-container" style={{ height: '100vh', backgroundColor: 'white' }}>
      {/* 상단 네비게이션 바 */}
      <NavBar
        backIcon={false}
        right={
          <Space wrap style={{ fontSize: 26 }}>
            <AddOutline onClick={handleAddClick} />
          </Space>
        }
      >
        <div className='header-title'>투자 정보</div>

        {/* iOS 상단 안전 영역 처리 */}
        <SafeArea position='top' />

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
          {RenderContent()}

      {/* iOS 하단 안전 영역 처리 */}
      <SafeArea position='bottom' />

</div>

</>
  );
}

export default InvestmentInfo;