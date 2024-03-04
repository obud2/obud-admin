import React, { useContext, useState, useEffect, useRef } from 'react';

import _ from 'lodash';
import { Table, Input, Button, Popconfirm, Form, Typography, Select, Radio, Modal } from 'antd';
import { Title } from '../pages/alltalk/Kakao.styles';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  const INPUT_CONFIG = {
    hp: {
      label: '',
      postText: '',
      type: 'INPUT',
    },
    name: {
      label: '',
      postText: '',
      type: 'INPUT',
    },
    VAR1: {
      label: '',
      postText: '',
      type: 'INPUT',
    },
    VAR2: {
      label: '',
      postText: '',
      type: 'INPUT',
    },
    VAR3: {
      label: '',
      postText: '',
      type: 'INPUT',
    },
    VAR4: {
      label: '',
      postText: '',
      type: 'INPUT',
    },
  };

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (editing) {
      if (INPUT_CONFIG[dataIndex].type === 'INPUT') {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            // rules={[
            //   {
            //     required: true,
            //     message: title + ' 를 입력해주세요',
            //   },
            // ]}
          >
            <Input
              addonAfter={INPUT_CONFIG[dataIndex].postText}
              placeholder={!_.isUndefined(dataIndex) && INPUT_CONFIG[dataIndex].label}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
      } else if (INPUT_CONFIG[dataIndex].type === 'RADIO') {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title} 를 입력해주세요`,
              },
            ]}
          >
            <Radio.Group ref={inputRef} initialValues={1} onChange={save}>
              <Radio value="기본옵션">기본옵션</Radio>
              {/* <Radio value={'날짜'}>날짜</Radio> */}
              <Radio value="수량(인원수)">수량(인원수)</Radio>
            </Radio.Group>
          </Form.Item>
        );
      } else if (INPUT_CONFIG[dataIndex].type === 'NUMBER') {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title} 를 입력해주세요`,
              },
            ]}
          >
            <Input
              addonAfter={INPUT_CONFIG[dataIndex].postText}
              placeholder={!_.isUndefined(dataIndex) && INPUT_CONFIG[dataIndex].label}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
      }
    } else {
      childNode = (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24, minWidth: 40 }} onClick={toggleEdit}>
          &nbsp;{children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

const PhoneDataEditTable = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [positions] = useState({});
  const [addr, setAddr] = useState([]);
  const [arrPos] = useState([]);

  useEffect(() => {
    setDataSource(props.data);
    setCount(props.data?.length);

    if (props.showAddrBtn) {
      getAddrList();
    }
  }, [props]);

  const getAddrList = () => {
    // AddressService.getListByGroup(getUserGroup()).then(result => {
    //   const p = _.groupBy(result, 'position');
    //   setPositions(p);
    //   const ch = [];
    //   Object.keys(p).map(cate => ch.push({ value: cate, label: cate }));
    //   setPos(ch);
    // });
  };

  const doSave = (addr) => {
    console.log(addr);
    const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(addr.hp)) {
      alert('휴대폰번호를 입력해주세요. 숫자와 - 만 허용합니다.');
      return;
    }
    if (!addr.name) {
      alert('이름을 입력해주세요.');
      return;
    }

    const insertParam = {
      group: getUserGroup(),
      hp: addr.hp.replaceAll('-', ''),
      name: addr.name,
      VAR1: addr.VAR1 ? addr.VAR1 : '',
      VAR2: addr.VAR2 ? addr.VAR2 : '',
      VAR3: addr.VAR3 ? addr.VAR3 : '',
      VAR4: addr.VAR4 ? addr.VAR4 : '',
    };

    if (addr.id) insertParam.id = addr.id;

    console.log(insertParam);
    // AddressService.saveItem(addr.key ? 'new' : 'edit', insertParam).then(result => {
    //   alert('저장되었습니다.');
    // });
  };

  const columns = [
    {
      title: '휴대폰번호',
      dataIndex: 'hp',
      width: '30%',
      align: 'center',
      editable: true,
    },
    {
      title: '이름',
      dataIndex: 'name',
      width: '20%',
      align: 'center',
      editable: true,
    },
    {
      title: '#VAR1',
      dataIndex: 'VAR1',
      align: 'center',
      editable: true,
    },
    {
      title: '#VAR2',
      dataIndex: 'VAR2',
      align: 'center',
      editable: true,
    },
    // {
    //   title: '#VAR3',
    //   dataIndex: 'VAR3',
    //   align: 'center',
    //   editable: true,
    // },
    // {
    //   title: '#VAR4',
    //   dataIndex: 'VAR4',
    //   align: 'center',
    //   editable: true,
    // },
    {
      title: '-',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) =>
        props.data.length >= 1 ? (
          <div>
            {/* <Popconfirm title='해당 번호를 저장하시겠습니까 ? ' onConfirm={() => doSave(record)}> */}
            {/*  <Typography.Link style={{ marginRight: 10 }}>저장</Typography.Link> */}
            {/* </Popconfirm> */}
            <Popconfirm title="해당 번호를 지우시겠습니까 ? " onConfirm={() => handleDelete(record.key)}>
              <Typography.Link>삭제</Typography.Link>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
    props.handleData(dataSource.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    setDataSource([
      ...dataSource,
      {
        key: count + 1,
        hp: '',
        name: '',
        VAR1: '',
        VAR2: '',
        VAR3: '',
        VAR4: '',
      },
    ]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = _.cloneDeep(dataSource);
    const index = _.cloneDeep(dataSource).findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });

    setDataSource(newData);
    props.handleData(newData, 'phoneNumber');
  };

  const handleOk = () => {
    const addData = addr.map((f) => {
      f.key = f.id;
      f.VAR1 = '';
      f.VAR2 = '';
      f.VAR3 = '';
      f.VAR4 = '';
      return f;
    });
    setDataSource([...dataSource, ...addData]);
    props.handleData([...dataSource, ...addData], 'phoneNumber');
    handleCancel();
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const onChange = (addr) => {
    const addrList = positions[addr];
    setAddr(addrList);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button onClick={handleAdd}>추가</Button>
      </div>
      <div>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={dataSource}
          rowClassName={() => 'editable-row'}
          components={{ body: { row: EditableRow, cell: EditableCell } }}
          columns={columns.map((col) => {
            if (!col.editable) {
              return col;
            }

            return {
              ...col,
              onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
              }),
            };
          })}
        />
      </div>
      <div>총 {dataSource.length}건</div>
      <Modal title="주소록 불러오기" open={showModal} onOk={handleOk} onCancel={handleCancel}>
        <Title className="required">주소록 그룹</Title>
        <Select
          size="large"
          name="channelId"
          placeholder="그룹 선택"
          onChange={(val) => onChange(val)}
          style={{ width: '100%' }}
          options={arrPos}
        />
      </Modal>
    </div>
  );
};

export default PhoneDataEditTable;
