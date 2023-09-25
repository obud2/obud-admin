import React, { useEffect, useState, useCallback } from 'react';

import { addMonths, format, subMonths } from 'date-fns';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import { DateContainer } from './DatePicker.style';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const DatePicker = ({ open, onClose, selectDate, onChange }) => {
  const [_currentYear, setCurrentYear] = useState(new Date());

  const [_reFreshOpen, setReFreshOpen] = useState(false);

  const [_selectDate, setSelectDate] = useState('');

  useEffect(() => {
    if (selectDate) {
      setSelectDate(selectDate);
    }
  }, [selectDate]);

  useEffect(() => {
    if (_currentYear) {
      const now = dateFormat(new Date());
      const formatCurrent = dateFormat(_currentYear);

      if (!(now === formatCurrent)) setReFreshOpen(true);
      else setReFreshOpen(false);
    }
  }, [_currentYear]);

  const dateFormat = (_date) => {
    if (_date) {
      return format(_date, 'yyMMdd');
    }
  };

  const renderCalender = (_today) => {
    const doMonth = new Date(_today.getFullYear(), _today.getMonth(), 1);
    const lastDate = new Date(_today.getFullYear(), _today.getMonth() + 1, 0);
    const _year = doMonth.getFullYear(); // 연도
    const _month = doMonth.getMonth(); // 월
    const _days = new Array(lastDate.getDate()).fill(''); // 일

    return (
      <>
        <p className="datepicker-year">
          {`${_year}. `}
          {`${_month + 1}`}
        </p>

        <ul className="datepicker-week">
          {WEEK.map((week) => (
            <li key={`week-${week}`}>
              <div>{week}</div>
            </li>
          ))}
        </ul>

        <table className="datepicker-table">
          <tbody>{createCalender(_year, _month + 1, _days, doMonth.getDay())}</tbody>
        </table>
      </>
    );
  };

  // 캘린더 만들기
  const createCalender = (_year, _month, _days, _insert) => {
    const selectFormatDate = _selectDate ? dateFormat(_selectDate) : '';
    const __days = [];

    // 저번달 끝나는 요일 만큼 뒤로 미루기
    for (let i = 0; i < _insert; i++) {
      __days.push('');
    }

    // 요일 일 수 채우기
    _days = _days.map((day, i) => (day = i + 1));

    // 밀린 요일과 일 수 합치기
    _days = [...__days, ..._days];

    let cell = [];
    let td = [];

    // 테이블에 데이터 Insert
    _days.map((day, idx) => {
      let _date;
      let _formatDate;

      let _active = false;
      let _range = false;
      let _disabled = false;
      let _empty = false;
      let _select = true;

      // Date Update
      if (day) {
        _date = new Date(`${_year}/${_month}/${day}`);
        _formatDate = dateFormat(_date);
      }

      //   Day 없는 값 Empty
      if (!day) {
        _empty = true;
      }

      //   선택 데이터
      if (_formatDate === selectFormatDate) {
        _active = true;
      }

      td.push(
        <td
          key={`td_${_month}_${day}_${idx}`}
          onClick={() => onSelectDate(_date, _disabled)}
          className={`date-picker-days 
          ${_select ? '_select' : '_un_select'} 
          ${_active ? '_active' : '_un_active'} 
          ${_range ? '_range' : '_un_range'} 
          ${_disabled ? '_disabled' : '_un_disabled'}
          ${_empty ? '_empty' : '_un_empty'}
          `}
        >
          <div>{day}</div>
        </td>,
      );

      if ((idx + 1) % 7 === 0) {
        cell.push(<tr key={`td_${_month}_${day}_${idx}`}>{td}</tr>);
        td = [];
      }

      if (idx === _days.length - 1 && td.length > 0) {
        cell.push(<tr key={`td_${_month}_${day}__${idx}`}>{td}</tr>);
      }
    });

    return cell;
  };

  //   다음달
  const nextDate = useCallback(() => {
    setCurrentYear((prev) => subMonths(prev, 1));
  }, [_currentYear]);

  //   저번달
  const prevDate = useCallback(() => {
    setCurrentYear((prev) => addMonths(prev, 1));
  }, [_currentYear]);

  //   데이터 선택
  const onSelectDate = (_date, _unable) => {
    if (!_date) return;
    if (_unable) return;

    onClose();
    onChange(_date);
  };

  return (
    <DateContainer open={open}>
      <div className="date-picker-background" />

      <div className="date-picker-close-box" onClick={onClose} />

      <div className="date-picker-container">
        <div className="date-change">
          <span className="prev-date" onClick={nextDate}>
            <IoIosArrowBack />
          </span>
          <span className="next-date" onClick={prevDate}>
            <IoIosArrowForward />
          </span>
        </div>

        <div className="datepicker">{renderCalender(_currentYear)}</div>
      </div>
    </DateContainer>
  );
};

export default DatePicker;
