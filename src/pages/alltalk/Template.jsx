import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Input, Modal, Radio, Row, Select, Space, Typography, Upload } from 'antd';
import PortalService from '../../services/PortalService';
import { PhoneBox, ScrollDiv, Title } from './Kakao.styles';
import { FormOutlined, LeftOutlined } from '@ant-design/icons';
import { ALLTALK_GROUP } from '../../constants';
import DataTableHeader from '../../components/dataTable/DataTableHeader';
import { SDataDetailBody } from '../../components/detailTable/DataDetailBody.styled';
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

const { TextArea } = Input;
const Template = () => {
  const navigator = useNavigate();

  const [data, setData] = useState({});
  const [buttonData, setButtonData] = useState({});
  const [channels, setChannels] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [uploadList, setUploadList] = useState([]);
  const [txt, setTxt] = useState('내용 미리보기');
  const [useImage, setUseImage] = useState(false);
  const [channelId, setChannelId] = useState('채널ID');
  const [codeParent, setCodeParent] = useState([]);
  const [code, setCode] = useState([]);
  const [codeChildren, setCodeChildren] = useState([]);
  const [info, setInfo] = useState('부가정보 영역');
  const [addChannel, setAddChannel] = useState('카카오톡 채널을 추가하면 광고와 마케팅 메시지를 카카오톡으로 받아 볼 수 있습니다.');
  const [maxCount, setMaxCount] = useState(1000);
  const [addType, setAddType] = useState('');
  const [imgSrc, setImgSrc] = useState('/talk_sample_img.jpg');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getList();
    getCodeList();
  }, []);

  const getList = () => {
    PortalService.getChannelList(ALLTALK_GROUP).then((result) => {
      console.log(result);
      let ch = [];
      result.value.sort((a, b) => a.id - b.id).map((cate) => ch.push({ value: cate.id, label: cate.id, ft_api: cate.ft_api }));
      console.log(ch);
      setChannels(ch);
    });
  };
  const getCodeList = () => {
    PortalService.getCodeListByGroup('TEMPLATE_CATEGORY').then((result) => {
      console.log(result);
      let category = [];
      setCode(result);
      result
        .filter((f) => !f.parent)
        .sort((a, b) => a.id - b.id)
        .map((cate) => {
          category.push({ value: cate.id, label: cate.name });
        });
      setCodeParent(category);
    });
  };

  const changeCategory = (parent) => {
    let category = [];
    code
      .filter((f) => f.parent === parent)
      .map((cate) => {
        category.push({ value: cate.id, label: cate.name });
      });
    setCodeChildren(category);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (name === 'templateContents') {
      setTxt(value.replace(/(\n|\r\n)/g, '<br>'));
    }
    if (name === 'info') {
      setInfo(value.replace(/(\n|\r\n)/g, '<br>'));
    }
    if (name === 'pointType' && value === 'none') {
      setUploadList([]);
    }
  };
  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    if (name === 'channelId') {
      setChannelId(value);
    }
  };

  const addTemplate = () => {
    console.log(data);
    if (!data.channelId) {
      alert('채널을 선택해주세요.');
      return;
    }
    if (!data.note) {
      alert('템플릿이름을 입력해주세요.');
      return;
    }
    if (!data.templateCategoryCode) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!data.templateContents) {
      alert('내용을 입력해주세요.');
      return;
    }
    if ((data.templateType === 'info' || data.templateType === 'mix') && !data.info) {
      alert('부가정보를 입력해주세요.');
      return;
    }
    // if (data.pointType === 'img' && uploadList.length === 0) {
    //   alert('이미지를 업로드해주세요.');
    //   return;
    // }
    // let formData = new FormData();
    // for (let [name, value] of Object.entries(data)) {
    //   formData.append(name, value);
    // }
    // if (uploadList.length > 0) {
    //   formData.append('image', uploadList[0].originFileObj);
    // }

    PortalService.addTemplate(data, uploadList.length).then((result) => {
      console.log(result);
      alert('등록하였습니다.');
      navigator('/pages/template');
    });
  };

  const addButton = () => {
    setIsModalOpen(true);
  };

  // DS: 배송조회, WL: 웹링크, AL: 앱링크, BK: 봇키워드, MD: 메시지전달,
  // AC: 채널추가, AG: 광고성수신동의, EV: 이벤트보기, BT:봇전환, BC:상담톡전환
  const linkType = [
    { value: 'DS', label: '배송조회' },
    { value: 'WL', label: '웹링크' },
    { value: 'AL', label: '앱링크' },
    { value: 'BK', label: '봇키워드' },
    { value: 'MD', label: '메시지전달' },
    { value: 'AC', label: '채널추가' },
    { value: 'AG', label: '광고성수신동의' },
    { value: 'EV', label: '이벤트보기' },
    { value: 'BT', label: '봇전환' },
    { value: 'BC', label: '상담톡전환' },
  ];
  const columns = [
    {
      title: '버튼타입',
      dataIndex: 'kkoLinkType',
      key: 'kkoLinkType',
      render: (_, record) => {
        return linkType.find((f) => f.value === _).label;
      },
    },
    {
      title: '버튼명',
      dataIndex: 'kkoLinkName',
      key: 'kkoLinkName',
      editable: true,
    },
    {
      title: '버튼링크',
      render: (_, record) => {
        if (record.kkoLinkType === 'WL') {
          return (
            <div>
              <div>{`PC 링크 : ${record.kkoLinkPc}`}</div>
              <div>{`모바일 링크 : ${record.kkoLinkMo}`}</div>
            </div>
          );
        } else {
          return record.kkoLinkPc;
        }
      },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => <Typography.Link onClick={() => {}}>Edit</Typography.Link>,
    },
  ].filter((item) => !item.hidden);

  const handleOk = () => {
    buttonData.kkoLinkType = addType;
    setButtons([...buttons, buttonData]);
    handleCancel();
  };

  const handleChangeButtonData = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setButtonData({ ...buttonData, [name]: value });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const uploadProps = {
    name: 'image',
    maxCount: 1,
    beforeUpload: (file) => {
      console.log(file);
      console.log(file.originFileObj);

      if (file.size > 500000) {
        alert('500kb 이상의 파일은 업로드할 수 없습니다.');
        file.remove = true;
        return Upload.LIST_IGNORE;
      } else {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (_read) => {
          console.log(_read);
          setImgSrc(_read.target.result);
        };
        setUploadList([...uploadList, file]);
      }
      return false;
    },
    uploadList,
    onChange: ({ fileList: newFileList }) => {
      console.log(newFileList);
      setUploadList(newFileList.filter((f) => !f.remove));
    },
    onRemove: (file) => {
      const index = uploadList.indexOf(file);
      const newFileList = uploadList.slice();
      newFileList.splice(index, 1);
      setUploadList(newFileList);
      setImgSrc('/talk_sample_img.jpg');
    },
  };

  return (
    <React.Fragment>
      <DataTableHeader title="알림톡 템플릿 관리" />
      <Space direction={'vertical'} size={0}>
        <Text>발송할 때마다 달라지는 부분을 가변 값으로 설정할 수 있습니다.</Text>
        <Text>{'가변 항목은 #{이름}, #{VAR1}, #{VAR2}으로 본문에 입력하시면 됩니다.'}</Text>
      </Space>
      <SDataDetailBody padding>
        <Row gutter={100}>
          <Col span={12}>
            <Title className={'required'}>채널 선택</Title>
            <Select
              size="large"
              name={'channelId'}
              placeholder="채널 선택"
              onChange={(val) => handleChange('channelId', val)}
              style={{ width: '100%' }}
              options={channels}
            />

            <Title className={'required'}>템플릿이름</Title>
            <Input size="large" onChange={onChange} name={'note'} />

            <Title className={'required'}>카테고리</Title>
            <Select
              size="large"
              name={'cateParent'}
              placeholder="카테고리 그룹 선택"
              onChange={(val) => changeCategory(val)}
              options={codeParent}
              style={{ width: '48%' }}
            />
            <Select
              size="large"
              name={'templateCategoryCode'}
              placeholder="카테고리 선택"
              onChange={(val) => handleChange('templateCategoryCode', val)}
              options={codeChildren}
              style={{ width: '50%', marginLeft: '2%' }}
            />
            <Space direction="vertical">
              <Text type="secondary">
                적용 후 카카오 내부기준에 따라 심사과정에 의해 더 적절하다고 판단되는 카테고리로 변경될 수 있습니다.{' '}
              </Text>
            </Space>

            <Space size={'large'} align="center">
              <Title className={'required'}>템플릿 유형</Title>
              <Radio.Group onChange={onChange} name="templateType" value={data.templateType || 'basic'}>
                <Radio value={'basic'}>기본형</Radio>
                <Radio value={'info'}>부가 정보형</Radio>
                <Radio value={'channel'}>채널 추가형</Radio>
                <Radio value={'mix'}>복합형</Radio>
              </Radio.Group>
            </Space>
            <Space direction="vertical" size={0}>
              <Text type="secondary">부가 정보형, 복합형 선택시 부가정보 필수 입력 </Text>
              <Text>부가정보는 변수 사용이 불가능하며, 부가정보 500자, 광고성 80자로 각각 제한됩니다.</Text>
            </Space>

            {/*<div>*/}
            {/*  <Space size={'large'} style={{ clear: 'both' }}>*/}
            {/*    <Title className={'required'}>강조 유형</Title>*/}
            {/*    <Radio.Group onChange={onChange} name="pointType" value={data.pointType || 'none'}>*/}
            {/*      <Radio value={'none'}>선택안함</Radio>*/}
            {/*      /!*<Radio value={'title'}>타이틀형</Radio>*!/*/}
            {/*      <Radio value={'img'}>이미지형</Radio>*/}
            {/*    </Radio.Group>*/}
            {/*  </Space>*/}
            {/*</div>*/}

            {data.pointType === 'img' && (
              <div>
                <Space direction="vertical" block size={0}>
                  <Text>
                    이미지를 직접 제작해 사용하시는 경우{' '}
                    <a target="_blank" href={'https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide/image'}>
                      카카오 공식 제작가이드
                    </a>
                    를 반드시 참고해 주세요.{' '}
                  </Text>
                  <Text>지원 규격 : 최대 500kb / jpg, png 파일만 첨부 가능합니다.</Text>
                  <Text>이미지 사이즈는 800px * 400px (가로 500px 이상, 가로:세로 비율이 2:1이상 3:4이하만 가능)</Text>
                  <Upload {...uploadProps}>
                    <Button size={'large'} block style={{ marginTop: 10 }}>
                      이미지 업로드
                    </Button>
                  </Upload>
                </Space>
              </div>
            )}

            <Title className={'required'}>내용</Title>
            <TextArea
              showCount
              maxLength={maxCount}
              size="large"
              rows={4}
              onChange={onChange}
              name={'templateContents'}
              autoSize={{ minRows: 4, maxRows: 6 }}
            />

            {(data.templateType === 'info' || data.templateType === 'mix') && (
              <div>
                <Title className={'required'}>부가정보</Title>
                <div>
                  <Space direction="vertical">
                    <Text>템플릿 내용과 부가정보를 함께 작성 시, 최대 1,000자까지 가능합니다.</Text>
                  </Space>
                </div>
                <TextArea
                  showCount
                  maxLength={500}
                  size="large"
                  rows={4}
                  onChange={onChange}
                  name={'info'}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </div>
            )}
          </Col>
          <Col span={12}>
            <PhoneBox>
              <div className="phone-box-top clearfix">
                <LeftOutlined />
                <span className="previewChannel channel-id">{channelId}</span>
              </div>
              <ScrollDiv className={'scroll-box'}>
                <div className={'talk-box-content'}>
                  <div className="tit">알림톡 도착</div>
                  <div className="talk-content-warp">
                    {/*  텍스트 강조형 */}
                    {data.pointType === 'title' && (
                      <div className="tit-point">
                        <span className="prew-txt1 subTitle">강조표기 보조문구 미리보기</span>
                        <strong className="prew-txt2 title">타이틀 미리보기</strong>
                      </div>
                    )}
                    {/* 이미지 강조형 */}
                    {data.pointType === 'img' && (
                      <div className="img-point">
                        <img src={imgSrc} alt="알림톡 이미지" />
                      </div>
                    )}

                    <p className="txt contents" dangerouslySetInnerHTML={{ __html: txt }}></p>

                    <div className="info-wrap">
                      {(data.templateType === 'info' || data.templateType === 'mix') && <p>{info}</p>}
                      {(data.templateType === 'channel' || data.templateType === 'mix') && <p>{addChannel}</p>}
                    </div>
                    <div className="button-wrap btnInfo">
                      {(data.templateType === 'channel' || data.templateType === 'mix') && <span className="btn">채널추가</span>}
                      {buttons.map((btn) => {
                        return <span className="btn">{btn.kkoLinkName}</span>;
                      })}
                    </div>
                  </div>
                </div>
              </ScrollDiv>
            </PhoneBox>
            <Divider dashed />

            <div>
              <Button
                onClick={addTemplate}
                type={'primary'}
                size={'large'}
                style={{ width: '286px', marginTop: 20 }}
                icon={<FormOutlined />}
              >
                등록 및 검수요청
              </Button>
            </div>
          </Col>
        </Row>
      </SDataDetailBody>
      <Modal
        title="버튼추가"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancel}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            등록
          </Button>,
        ]}
      >
        <Title>버튼명</Title>
        <Input onChange={handleChangeButtonData} name={'kkoLinkName'} />
        <Title>PC 링크</Title>
        <Input onChange={handleChangeButtonData} name={'kkoLinkPc'} />
        <Title>모바일 링크</Title>
        <Input onChange={handleChangeButtonData} name={'kkoLinkMo'} />
        <Title>Android 링크</Title>
        <Input onChange={handleChangeButtonData} name={'kkoLinkAnd'} />
        <Title>iOS 링크</Title>
        <Input onChange={handleChangeButtonData} name={'kkoLinkIos'} />
      </Modal>
    </React.Fragment>
  );
};

export default Template;
