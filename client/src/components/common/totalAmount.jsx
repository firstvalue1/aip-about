import React from 'react';
import { Card, Divider } from 'antd-mobile';
// 컴포넌트는 반드시 대문자로 시작해야 합니다.
const TotalAmount = ({ title, totalAmount }) => {
    return (
    <div className="content-container">
      <Card
        headerStyle={{
          color: '#f24db8ff',
          justifyContent: 'center', // flexbox 가운데 정렬을 위해 justifyContent 사용
        }}
        style={{
          width: '30%', // 원하는 너비로 조절합니다. '300px', '95vw' 등 다양한 값 사용 가능
        }}
        bodyClassName="custombody"
        title={title}
      >
        <div>{Number(totalAmount).toLocaleString()}원</div>
      </Card>
      <Divider />
    </div>
    );
  };
  
  export default TotalAmount;