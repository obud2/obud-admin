import React, { useEffect, useState } from "react";
import { PhoneBox, ScrollDiv, Title } from "./Kakao.styles";
import { LeftOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Select, Space, Typography } from "antd";
import PortalService from "../../services/PortalService";
import { ALLTALK_CHANNEL, ALLTALK_GROUP } from "../../constants/config";
import PhoneDataEditTable from "../../components/PhoneDataEditTable";
import DataTableHeader from "../../components/dataTable/DataTableHeader";
import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";

const { Text } = Typography;

const AlimTalk = () => {
  const [data, setData] = useState({});
  const [channels, setChannels] = useState([]);
  const [txt, setTxt] = useState("내용 미리보기");
  const [isAd, setIsAd] = useState(false);
  const [useImage, setUseImage] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [channelId, setChannelId] = useState(ALLTALK_CHANNEL);
  const [numbers, setNumbers] = useState([]);
  const [template, setTemplate] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [addNumber, setAddNumber] = useState("");

  useEffect(() => {
    getList();
    getTemplateList(ALLTALK_CHANNEL);
  }, []);

  const getList = () => {
    PortalService.getChannelList(ALLTALK_GROUP).then((result) => {
      let ch = [];
      result.value
        .sort((a, b) => a.id - b.id)
        .map((cate) =>
          ch.push({
            value: cate.id,
            label: cate.id,
            ft_api: cate.ft_api,
            at_api: cate.at_api,
          })
        );
      setChannels(ch);
    });
  };

  const getTemplateList = (_channel) => {
    PortalService.getTemplateList(_channel).then((result) => {
      let ch = [];
      result
        .filter((f) => f.approval === "A")
        .map((temp) =>
          ch.push({
            value: temp.kkoBizCode,
            label: temp.note,
            contents: temp.templateContents,
          })
        );
      setTemplate(ch);
    });
  };

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    if (name === "channelId") {
      setData({});
      setTxt("내용 미리보기");
      setTemplateId(null);
      setChannelId(value);
      getTemplateList(value);
    } else if (name === "template") {
      const item = template.find((f) => f.value === value);
      setTxt(item.contents.replace(/\r\n/gi, "<br>").replace(/\n/gi, "<br>"));
      setTemplateId(value);
      // setData(template.find((f) => f.kkoBizCode === value));
    }
  };

  const addPhoneNumber = () => {
    setNumbers([...numbers, addNumber]);
    setAddNumber("");
  };

  const handleChangePhone = (val) => {
    console.log(val);
    setNumbers([...val]);
  };

  const send = () => {
    if (!channelId) {
      alert("채널을 선택해주세요.");
      return;
    }
    if (!templateId) {
      alert("템플릿을 선택해주세요.");
      return;
    }
    if (numbers.length === 0) {
      alert("수신번호는 1개이상이어야 합니다.");
      return;
    }
    if (numbers.length > 250) {
      alert("1회 최대 발송건수는 250개입니다.");
      return;
    }
    const ch = channels.find((f) => f.value === channelId);
    const param = {
      service: ch.at_api,
      message: txt.replace(/<br>/gi, "\r\n"),
      numbers: numbers,
      template: templateId,
      groupId: ALLTALK_GROUP,
      // wide: data.isWide === true ? 'Y' : 'N',
    };
    PortalService.sendAlimTalk(param).then((result) => {
      alert("발송하였습니다.");
    });
  };

  return (
    <React.Fragment>
      <DataTableHeader title="알림톡 전송" />
      <Space direction={"vertical"} size={0}>
        <Text>
          발송할 때마다 달라지는 부분을 가변 값으로 설정할 수 있습니다.
        </Text>
        <Text>{"가변 항목은 #{항목} 형태로 본문에 입력하시면 됩니다."}</Text>
      </Space>
      <SDataDetailBody padding>
        <Row gutter={100}>
          <Col span={12}>
            {/*<Title className={'required'}>채널 선택</Title>*/}
            {/*<Select*/}
            {/*  size="large"*/}
            {/*  name={'channelId'}*/}
            {/*  placeholder="채널 선택"*/}
            {/*  onChange={(val) => handleChange('channelId', val)}*/}
            {/*  style={{ width: '100%' }}*/}
            {/*  options={channels}*/}
            {/*/>*/}

            <Title className={"required"}>템플릿이름 - {templateId}</Title>
            <Select
              size="large"
              name={"template"}
              placeholder="템플릿 선택"
              value={templateId}
              onChange={(val) => handleChange("template", val)}
              style={{ width: "100%" }}
              options={template}
            />

            <Title className={"required"}>수신번호</Title>
            <PhoneDataEditTable
              data={numbers}
              handleData={handleChangePhone}
              showAddrBtn={true}
            />
          </Col>
          <Col span={12}>
            <PhoneBox>
              <div className="phone-box-top clearfix">
                <LeftOutlined />
                <span className="previewChannel channel-id">{channelId}</span>
              </div>
              <ScrollDiv className={"scroll-box"}>
                <div
                  className={
                    isWide ? "phone-box-content wide" : "phone-box-content"
                  }
                >
                  {isAd && (
                    <div className="ad-info">
                      (광고) <span className="previewChannel">{channelId}</span>
                    </div>
                  )}
                  <div
                    className={isWide ? "preview-wrap wide" : "preview-wrap"}
                  >
                    {useImage > 0 && (
                      <div>
                        <img
                          src="https://www.wingo.co.kr/resources/images/content/talk_friend_img.jpg"
                          alt="이미지"
                        />
                      </div>
                    )}
                    <div className={"preview-content-wrap"}>
                      <span
                        className="preview-content"
                        dangerouslySetInnerHTML={{ __html: txt }}
                      ></span>
                    </div>
                  </div>
                  {isAd === true && (
                    <div className="info ad-info">
                      수신거부 | 홈 &gt; 채널차단
                    </div>
                  )}
                </div>
              </ScrollDiv>
            </PhoneBox>
            <Divider dashed />

            <div>
              <Button
                onClick={send}
                type={"primary"}
                size={"large"}
                style={{ width: "286px", marginTop: 20 }}
                icon={<SendOutlined />}
              >
                전송하기
              </Button>
            </div>
          </Col>
        </Row>
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default AlimTalk;
