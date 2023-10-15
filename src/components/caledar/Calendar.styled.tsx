import styled from 'styled-components';

import { smLayout } from '../../styles/VariablesStyles';

export const SCalendar = styled.div`
  width: 100%;

  padding: 10px;
  position: relative;

  .calendar-loading {
    width: 100%;
    height: 100%;

    top: 0;
    left: 0;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 15px;

    overflow: hidden;

    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calendar-header {
    width: 100%;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    margin-bottom: 10px;

    ${smLayout} {
      gap: 10px;

      flex-direction: column-reverse;
      align-items: flex-end;
    }

    button {
      background-color: #009ef7;
      box-shadow: none;
    }
  }

  .calendar-status {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    gap: 10px;
    margin-bottom: 5px;

    position: absolute;

    ${smLayout} {
      position: relative;
    }

    .calendar-box {
      display: flex;
      align-items: center;
      justify-content: center;

      gap: 5px;
      font-size: 1.4rem;

      .color-block {
        width: 30px;
        height: 20px;
      }
    }
  }
`;
