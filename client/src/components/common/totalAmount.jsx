import React from 'react';
import { Card, Divider } from 'antd-mobile';
// 컴포넌트는 반드시 대문자로 시작해야 합니다.
const TotalAmount = ({ title, totalAmount }) => {
    return (
    <div className="content-container">
      <Card
        headerStyle={{
          color: '#f24db8ff',
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