import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './GradeCard.css';

const GradeCard = ({ title, grade, correct }) => {
  return (
    <div className="grade-card">
      <p className='grade-card-title'>{title}</p>
      <div className='grade-card-grades-container'>
        {Boolean(correct)
          ? <CheckOutlined className='grade-card-icon success' />
          : <CloseOutlined className='grade-card-icon fail' />
        }
        <p className='grade-card-grade'>{Number(grade).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default GradeCard;