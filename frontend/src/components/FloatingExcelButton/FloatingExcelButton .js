import React from 'react';
import { Button, Affix } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { utils, writeFile } from 'xlsx'; 

const FloatingExcelButton = ({ data , name}) => {
  const generateExcel = () => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, name+'.xlsx');
  }

  return (
    <Affix style={{ position: 'fixed', bottom: 20, left: 20 }}>
        <Button
          type="primary"
          shape="circle"
          icon={<DownloadOutlined />}
          size="large"
          onClick={() => generateExcel()}
        />
      </Affix>
  );
}

export default FloatingExcelButton;
