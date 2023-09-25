import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import moment from 'moment';

import { Button, Spin } from 'antd';
import { SCalendar } from './Calendar.styled';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import koLocale from '@fullcalendar/core/locales/ko';

const startColor = {
  backgroundColor: '#dcccfc',
  borderColor: '#dcccfc',
  textColor: '#7846f0',
};

const endColor = {
  backgroundColor: '#eeeeee',
  borderColor: '#eeeeee',
  textColor: '#868686',
};

const Calendar = ({ list, onClick, onChangeDate, resister, isLoading, eventContent, statusHide }) => {
  const dateFormat = 'YYYYMMDDHHmmss';

  const [temp, setTemp] = useState([]);

  useEffect(() => {
    if (list && list?.length > 0) {
      const copy = list || [];

      copy?.map((a) => {
        const now = moment().format(dateFormat).valueOf();
        const start = moment(a.startDate).format(dateFormat).valueOf();

        if (Number(now) < Number(start)) {
          if (!a?.backgroundColor) a['backgroundColor'] = startColor?.backgroundColor;
          if (!a?.borderColor) a['borderColor'] = startColor?.borderColor;
          if (!a?.textColor) a['textColor'] = startColor?.textColor;
        } else {
          if (!a?.backgroundColor) a['backgroundColor'] = endColor?.backgroundColor;
          if (!a?.borderColor) a['borderColor'] = endColor?.borderColor;
          if (!a?.textColor) a['textColor'] = endColor?.textColor;
        }
      });

      setTemp(_.cloneDeep(copy));
    }
  }, [list]);

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
        plugins={[dayGridPlugin]}
        height={800}
        initialView="dayGridMonth"
        headerToolbar={{
          start: '',
          center: 'title',
          end: 'today prev,next',
        }}
        nowIndicator
        datesSet={onChangeDate}
        eventClick={(info) =>
          onClick(
            list.find((e) => e.id === info.event.id),
            info.event.id,
          )
        }
        events={temp || []}
        eventContent={eventContent}
      />
    </SCalendar>
  );
};

export default Calendar;
