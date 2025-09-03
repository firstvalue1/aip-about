import { useState } from 'react';
import { 
    NavBar, 
    Form,
    Button,
    DatePicker,
    Input,
} from 'antd-mobile';
import axios from 'axios';

function AddInvestment() {
    // Form 인스턴스를 생성하여 폼과 연결합니다.
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [inputDate, setInputDate] = useState(null);
    const [inputAmount, setInputAmount] = useState('');
    const now = new Date()

    // 입력값 변경 핸들러
    const handleAmountChange = (value) => {
        // 숫자만 남기기 (쉼표가 이미 제거된 상태에서 처리)
        const numericValue = value.replace(/[^0-9]/g, '');

        // 유효한 숫자인 경우에만 포맷팅
        if (numericValue !== '') {
            const formattedValue = Number(numericValue).toLocaleString('ko-KR');  
            // **Form 필드 직접 업데이트**
            // 이 부분이 실시간 업데이트를 가능하게 합니다.
            form.setFieldsValue({
                amount: formattedValue
            });
            setInputAmount(formattedValue);

        } else {
            form.setFieldsValue({
                amount: ''
            });
        }

    };
    const handleSubmit = () => {
            // 폼의 유효성 검사가 통과된 경우에만 처리
            const formattedAmount = Number(inputAmount.replace(/,/g, '')); // 쉼표 제거 후 숫자로 변환
            const formattedDate = inputDate ? inputDate.toISOString().split('T')[0] : null; // 날짜를 'YYYY-MM-DD' 형식으로 변환

            console.log('Submitting:', { date: formattedDate, amount: formattedAmount });

            if (!formattedDate || formattedAmount <= 0) {
                alert('필수 항목을 입력하세요.');
                return;
            }

            const payload = {
                date: formattedDate,
                amount: formattedAmount
            };

            axios.post('/api/invest/save', payload)
                .then(response => {
                    alert('투자금이 저장되었습니다.');
                    form.resetFields();
                    setInputDate(null);
                })
                .catch(error => {
                    console.error('Error saving investment data:', error);
                    alert('저장 중 오류가 발생했습니다.');
                });
    };

    return (
<>
        <NavBar
         style={{
            '--height': '36px',
            '--border-bottom': '1px #eee solid',
          }} 
        onBack={() => window.history.back()}>
            
          <div className='header-title'>투자금 추가</div>
          
        </NavBar>

        <Form
          form={form} // form 인스턴스 연결
          layout='horizontal'
          footer={
                <Button block type='submit' color='primary' size='large'
                    onClick={() => {
                        handleSubmit();
                        form.resetFields();
                    }}
                >
                저장
                </Button>
            }
        >  
            <Form.Header>투자금 입력</Form.Header>
            <Form.Item name='date' 
                rules={[{ required: true, message: '날짜를 입력해주세요.' }]}
                label="날짜"
                onClick={() => { setVisible(true) }}
            >
                <div>{inputDate ? inputDate.toLocaleDateString() : '날짜 선택'}</div>
            </Form.Item>
            <Form.Item
                label='금액'
                name='amount'
                rules={[{ required: true, message: '금액을 입력해주세요.' }]}
            >
            <Input 
                type='text'
                placeholder='금액을 입력해주세요. (숫자만 입력)'
                clearable={true}
                // onValuesChange 대신 Input의 onChange를 직접 사용합니다.
                onChange={handleAmountChange} 
                style={{ width: '100%', height: '100%', fontSize: '16px', 
                        padding: '8px', boxSizing: 'border-box' }} />
            </Form.Item>

        </Form>



        <DatePicker
            title='날짜 선택'
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
            value={now}
            onConfirm={val => {
                setInputDate(val);
                setVisible(false);
            }}
            confirmText='확인'
            cancelText='취소'
        />
</> 
);
};

export default AddInvestment;