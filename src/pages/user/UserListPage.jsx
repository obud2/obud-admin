import React, { useContext, useEffect, useState } from 'react';

import { Button } from 'antd';

import { useInfiniteQuery } from 'react-query';
import { EXEL_HEADER, FILTER, LIST_HEADER } from './UserListPage.option';

import { STUDIO } from '../../constants/config';
import { UserContext } from '../../context/UserContext';

import UserService from '../../services/UserService';
import UserDetail from './UserDetail';

import InstructorRegist from './InstructorRegist';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';

const UserListPage = () => {
  const [searchFilter, setSearchFilter] = useState({
    value: '',
    filter: '',
    role: 'USR',
  });

  const [detailId, setDetailId] = useState('');
  const [isRegistOpen, setIsRegistOpen] = useState(false);

  const [header, setHeader] = useState([]);

  const { user, isAdmin } = useContext(UserContext);

  const fetchList = async (cursor) => {
    let res = {};

    if (isAdmin) {
      // 어드민 전용 API
      if (!searchFilter?.filter) {
        res = await UserService.getUserAll(cursor?.pageParam, searchFilter?.value);
      } else {
        res = await UserService.getUserList(cursor?.pageParam, searchFilter?.value, searchFilter?.filter, searchFilter?.role);
      }
    }

    if (user.group === STUDIO) {
      // 스튜디오 관리자 전용 API
      res = await UserService.getStudioInstructor(cursor?.pageParam, searchFilter?.value);
    }

    return {
      result: res?.value || [],
      nextPage: res?.cursor,
      isLast: !res?.cursor,
    };
  };

  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [
      'user-list',
      {
        filter: searchFilter?.filter,
        role: searchFilter?.role,
      },
    ],
    fetchList,
    {
      enabled: !!user?.id,
      getNextPageParam: (lastPage) => {
        let result;
        if (!lastPage?.isLast) result = lastPage.nextPage;
        else result = undefined;
        return result;
      },
    },
  );

  useEffect(() => {
    const temp = [...LIST_HEADER];

    //  스튜디오 관리자 강사 해지 버튼 추가
    if (user?.group === STUDIO) {
      temp.push({
        id: 'id',
        label: '',
        customBodyRender: (value) => {
          return <Button onClick={() => onClickDeleteInstructor(value, user?.id)}>해지</Button>;
        },
      });
    }

    setHeader(temp);
  }, [user]);

  const onClickDeleteInstructor = (instructorId, studiosAdminId) => {
    swal({
      title: '',
      text: '해당 강사 권한을 해지하시겠습니가?',
      buttons: true,
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        const body = {
          instructorId,
          studiosAdminId,
        };

        await UserService?.deleteInstructor(body);
        refetch();
      }
    });
  };

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const doClear = async () => {
    await setSearchFilter({ value: '', filter: '', role: 'USR' });
    refetch();
  };

  const onDetail = (item) => {
    setDetailId({ id: item?.id });
  };

  const onClickRegistOpen = () => {
    setIsRegistOpen(true);
  };

  const onDetailClose = (refresh) => {
    if (refresh) refetch();

    setDetailId('');
  };

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        register={user?.group === STUDIO ? { text: '강사등록', onClick: onClickRegistOpen } : ''} // 스튜디오 관리자 강사 등록 폼 추가
        doSearch={(e) => doSearch('value', e)}
        doFilter={(headerId) => {
          doSearch('filter', headerId);
          doSearch('role', headerId === 'GR0100' ? 'ADMIN' : 'USR');
        }}
        doClear={doClear}
        filter={isAdmin ? FILTER : []} // 어드민만 필터 노출
        title="회원 관리"
        searchPlaceholder="이름 검색"
        isLoading={isLoading || isRefetching}
      />

      <DataListTable
        data={data || []}
        header={header}
        onClick={onDetail}
        isFilterData={searchFilter?.length > 0}
        isLoading={isLoading || isRefetching}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sortId="createdAt"
        sorted={false}
        excel={isAdmin} // 어드민만 엑셀 다운 가능
        useDetail={isAdmin} // 어드민만 상세 확인 가능
        excelCols={EXEL_HEADER}
        onExcelListApi={() => UserService.getUserExcel()}
      />

      {/* 사용자 상세 */}
      <UserDetail id={detailId?.id || ''} open={detailId} onClose={() => onDetailClose(false)} refresh={() => onDetailClose(true)} />

      {/* 강사 등록 폼 */}
      <InstructorRegist isOpen={isRegistOpen} isClose={() => setIsRegistOpen(false)} studiosId={user?.id || ''} refresh={refetch} />
    </React.Fragment>
  );
};

export default UserListPage;
