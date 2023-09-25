import styled from 'styled-components';

export const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 14px;
  margin-bottom: 6px;

  &.required {
    :before {
      content: '*';
      color: red;
      margin-right: 4px;
    }
  }
`;

export const ScrollDiv = styled.div`
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.4);
  }
`;

export const PhoneBox = styled.div`
  width: 286px;
  height: 580px;
  background: url(/img/phone_bg2.png) 0 0 no-repeat;

  .wide {
    width: 244px;
  }

  padding: 20px 20px 50px 20px;
  font-size: 16px;
  font-weight: bold;

  .phone-box-top {
    height: 40px;
  }
  .channel-id {
    margin-left: 20px;
  }

  .scroll-box {
    height: 470px;
    overflow: auto;
  }

  .phone-box-content {
    width: 200px;

    &.wide {
      width: 244px !important;
    }

    .ad-info {
      font-size: 12px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: -0.5px;
      color: #666;
      white-space: nowrap;
      margin-bottom: 4px;
    }

    .preview-wrap {
      border-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
    .preview-content-wrap {
      padding: 10px;
      background-color: #fff;
    }
    .preview-content {
      font-size: 13px;
      line-height: 20px;
      font-weight: 400;
      letter-spacing: -0.5px;
      color: #666;
    }

    .info {
      float: right;
      margin-top: 4px;
    }
  }

  .talk-box-content {
    width: 200px;

    .tit {
      padding: 15px 10px;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: -0.5px;
      color: #5b3e3c;
      -ms-word-break: break-all;
      word-break: break-all;
      background-color: #ffe400;
      -webkit-border-radius: 10px 10px 0 0;
      border-radius: 10px 10px 0 0;
    }

    .talk-content-warp {
      padding: 10px;
      -ms-word-break: break-all;
      word-break: break-all;
      background-color: #fff;
      -webkit-border-radius: 0 0 10px 10px;
      border-radius: 0 0 10px 10px;

      .info-wrap p {
        color: #bdbdbd;
        font-size: 12px;
        letter-spacing: -0.5px;
        line-height: 1.2;
        color: #bdbdbd;
        margin-top: 7px;
      }

      .tit-point {
        padding: 8px 0 11px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 11px;

        .prew-txt1 {
          display: block;
          color: #bdbdbd;
          font-size: 12px;
          letter-spacing: -0.5px;
          margin-bottom: 5px;
          line-height: 1.1;
        }

        .prew-txt2 {
          display: block;
          color: #666;
          font-size: 14px;
          letter-spacing: -0.5px;
          font-weight: 400;
          line-height: 1.1;
        }
      }

      .button-wrap .btn {
        display: block;
        width: 100%;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-top: 5px;
        color: #666;
        font-size: 13px;
        letter-spacing: -0.5px;
      }

      .txt {
        font-size: 13px;
        line-height: 20px;
        font-weight: 400;
        letter-spacing: -0.5px;
        color: #666;
      }
    }

    .img-point {
      margin: -10px -10px 10px;

      img {
        width: 100%;
        height: auto;
      }
    }
  }
`;
