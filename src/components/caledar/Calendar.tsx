import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import moment from 'moment';

import { Button, Spin } from 'antd';
import { SCalendar } from './Calendar.styled';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

const startColor = {
  backgroundColor: '#dff2ff',
  borderColor: '#dff2ff',
  textColor: '#000',
};

const endColor = {
  backgroundColor: '#eeeeee',
  borderColor: '#eeeeee',
  textColor: '#868686',
};

type Props = {
  backgroundColor: string;
  borderColor: string;
  date: string;
  end: string;
  id: string;
  label: string;
  numberOfPeople: string;
  start: string;
  startDate: string;
  endDate: string;
  textColor: string;
  title: string;
  mobileTitle: string;
};

const Calendar = ({ list, onClick, onChangeDate, resister, isLoading, eventContent, statusHide }: any) => {
  const dateFormat = 'YYYYMMDDHHmmss';
  const [temp, setTemp] = useState<Props[]>([]);

  const [selectDate, setSelectDate] = useState('');
  const [filteredTemp, setFilteredTemp] = useState<Props[]>([]);

  useEffect(() => {
    if (list && list?.length > 0) {
      const copy = list || [];

      copy.forEach((a: any) => {
        const now = moment().format(dateFormat).valueOf();
        const start = moment(a.startDate).format(dateFormat).valueOf();

        if (Number(now) < Number(start)) {
          if (!a?.backgroundColor) a.backgroundColor = startColor?.backgroundColor;
          if (!a?.borderColor) a.borderColor = startColor?.borderColor;
          if (!a?.textColor) a.textColor = startColor?.textColor;
        } else {
          if (!a?.backgroundColor) a.backgroundColor = endColor?.backgroundColor;
          if (!a?.borderColor) a.borderColor = endColor?.borderColor;
          if (!a?.textColor) a.textColor = endColor?.textColor;
        }
      });

      setTemp(_.cloneDeep(copy));
    }
  }, [list]);

  // plan list 날짜 중 오늘 이후 & 가장 가까운 날짜로 선택
  useEffect(() => {
    if (list && list.length > 0) {
      const filteredDates = list
        .filter((item: any) => moment(item.start).startOf('day').isSameOrAfter(moment().startOf('day')))
        .sort((a: any, b: any) => (moment(a.start).isAfter(moment(b.start)) ? 1 : -1));
      if (filteredDates.length > 0) {
        setSelectDate(filteredDates[0].start);
      }
    }
  }, [list]);

  const handleDateClick = async (arg: any) => {
    if (arg.dateStr) {
      setSelectDate(arg?.dateStr);
    }
  };

  useEffect(() => {
    if (selectDate) {
      const filteredItems = _.filter(temp, { start: selectDate });
      setFilteredTemp(filteredItems);
    }
  }, [selectDate]);

  return (
    <SCalendar>
      {isLoading && (
        <div className="calendar-loading">
          <Spin />
        </div>
      )}

      <div className="calendar-header">
        {!statusHide && (
          <div className="calendar-status">
            <div className="calendar-box">
              <div
                className="color-block"
                style={{
                  backgroundColor: endColor?.backgroundColor,
                }}
              />
              <p>기간만료</p>
            </div>

            <div className="calendar-box">
              <div
                className="color-block"
                style={{
                  backgroundColor: startColor?.backgroundColor,
                }}
              />
              <p>진행예정</p>
            </div>
          </div>
        )}

        {resister && (
          <Button
            onClick={resister?.onClick || resister}
            block
            type="primary"
            disabled={isLoading}
            loading={isLoading}
            style={{ width: 'auto', minWidth: '90px' }}
          >
            {resister?.text || '등록'}
          </Button>
        )}
      </div>

      <FullCalendar
        locale={koLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        height="auto"
        initialView="dayGridMonth"
        headerToolbar={{
          start: '',
          center: 'title',
          end: 'prev,next',
        }}
        nowIndicator
        datesSet={onChangeDate}
        dateClick={handleDateClick}
        selectable
        eventDisplay="auto"
        eventClick={(info) => {
          onClick(
            list.find((e: any) => e.id === info.event.id),
            info.event.id,
          );
        }}
        events={temp || []}
        eventContent={eventContent}
      />

      <section className="mobile-schedule-list">
        {selectDate && <div className="mobile-schedule-list-date">{moment(selectDate).locale('ko').format('YYYY-M-DD (ddd)')}</div>}
        {filteredTemp.length > 0 ? (
          <div>
            {filteredTemp
              .sort((a, b) => moment(a.startDate).diff(moment(b.startDate)))
              .map((item) => (
                <div className="mobile-schedule-list-item" key={item.id} onClick={() => onClick(item, item.id)}>
                  <div>
                    <div>{`${moment(item.startDate).format('HH:mm')} ~ ${moment(item.endDate).format('HH:mm')}`}</div>
                    <div className="mobile-schedule-list-item-label">{item.mobileTitle || ''}</div>
                  </div>
                  <div className="mobile-schedule-list-item-reservation">예약 {item.numberOfPeople}</div>
                </div>
              ))}
          </div>
        ) : (
          <div className="mobile-schedule-list-item">등록된 프로그램이 없습니다</div>
        )}
      </section>
      <div></div>
    </SCalendar>
  );
};

export default Calendar;
