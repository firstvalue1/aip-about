// InvestmentList.jsx
import React from 'react';
// 컴포넌트는 반드시 대문자로 시작해야 합니다.
const ListContent = ({ listData }) => {
  return (
    <div className="content-container">
      <div className="content-list-container">
        <div className="list-item header-row">
          <div className="list-column">날 짜</div>
          <div className="list-column">금 액</div>
        </div>
        <div className="scrollable-list">
          {listData.map((item) => (
            <div className="list-item" key={item.id}>
              <div className="list-column">{item.date}</div>
              <div className="list-column">{Number(item.amount).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListContent;