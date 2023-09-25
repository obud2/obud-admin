import styled, { css } from 'styled-components';

export const DateContainer = styled.div`
  display: none;

  ${(props) =>
    props.open &&
    css`
      display: block;
    `}

  .date-picker-background {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;

    background-color: rgba(111, 126, 140, 0.2);
    backdrop-filter: blur(4px);
  }

  .date-picker-close-box {
    width: 30px;
    height: 30px;
    background-color: #ffffff;

    position: absolute;

    top: -10%;
    right: 0;

    border: 1px solid #868686;
    border-radius: 5px;

    overflow: hidden;

    z-index: 909090;

    cursor: pointer;

    &::after,
    &::before {
      content: '';

      position: absolute;
      right: 13px;
      top: 5px;

      width: 1px;
      height: 18px;
      background-color: #222;
    }

    &::after {
      transform: rotate(45deg);
    }
    &::before {
      transform: rotate(-45deg);
    }
  }

  .date-picker-container {
    width: 90%;
    background-color: #ffffff;

    position: absolute;

    top: 110%;
    right: 0;

    border: 1px solid #868686;
    border-radius: 5px;

    overflow: hidden;

    z-index: 909090;

    .datepicker {
      width: 100%;
    }

    .date-change {
      width: 100%;
      height: 40px;
      padding: 0 10px;

      top: 0;
      position: absolute;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .prev-date,
      .next-date {
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        color: #555555;
        cursor: pointer;
      }
    }

    .datepicker-week {
      width: 100%;
      height: 35px;
      text-align: center;

      color: #555555;
      font-size: 0.8em;

      display: flex;
      align-items: center;

      list-style: none;

      margin: 0;
      padding: 0;

      li {
        width: 100%;
        position: relative;
      }

      li:first-child {
        color: #f33;
      }

      li:last-child {
        color: #2a31fb;
      }
    }

    .datepicker-year {
      width: 100%;
      height: 40px;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 0.9em;
      font-weight: bold;

      color: #555555;
      background-color: ${(props) => props.theme.mainColor};

      margin: 0;
      padding: 0;
    }

    .datepicker-table {
      width: 100%;
      height: auto;

      tbody {
        width: 100%;
        text-align: center;

        color: #555555;
        font-size: 0.9em;

        .date-picker-days {
          height: 35px;
          position: relative;

          div {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid rgb(228, 231, 231) !important;

            font-size: 14px !important;

            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        .date-picker-days._select div {
          cursor: pointer;

          &:hover {
            background-color: #eeeeee;
          }
        }

        .date-picker-days._active div {
          color: #ffffff;
          border: #f2994a !important;
          background-color: #f2994a;
        }

        .date-picker-days._disabled div {
          color: #aeaeae !important;
          background-color: #fcfcfc !important;
          text-decoration: line-through !important;
        }

        .date-picker-days._empty {
          color: #aeaeae !important;
          background-color: #fcfcfc !important;

          div {
            text-decoration: line-through !important;
          }
        }
      }
    }
  }
`;
