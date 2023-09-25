import React, { useContext } from 'react';

import { useQuery } from 'react-query';
import CodeService from '../../services/CodeService';
import { UserContext } from '../../context/UserContext';

import DataTableTitle from '../../components/dataTable/DataTableTitle';

import { Card, Col, Row } from 'antd';
import { SDataDetailBody } from '../../components/detailTable/DataDetailBody.styled';
import { addComma } from '../../constants';

const DashboardPage = () => {
  const { isAdmin } = useContext(UserContext);

  const { data } = useQuery(['dash'], () => CodeService.dashBorder(), { enabled: isAdmin });

  return (
    <React.Fragment>
      <DataTableTitle title="Dashboard" />

      <SDataDetailBody padding>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="방문자 수">{addComma(data?.totalVisit || 0)}</Card>
          </Col>

          <Col span={12}>
            <Card title="매출">{addComma(data?.totalSales || 0)}</Card>
          </Col>
        </Row>
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default DashboardPage;
