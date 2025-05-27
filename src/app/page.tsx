'use client';

import { AdvocateDetails } from '@/types';
import { useEffect, useState } from 'react';
import {
  Button,
  Empty,
  GetProps,
  Input,
  Typography,
  theme,
} from 'antd';
import AdvocatesTable from './components/advocates-table';

const { Search } = Input;
const { Title } = Typography;

type SearchProps = GetProps<typeof Search>;

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [advocates, setAdvocates] = useState<AdvocateDetails[]>([]);
  const [search, setSearch] = useState('');

  // TODO: switch to using tanstack-query
  useEffect(() => {
    fetch(`/api/advocates?page=1&search=${search}`).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.advocates);
      });
    });
  }, [search]);

  const onSearch: SearchProps['onSearch'] = (value) =>
    setSearch(value);

  return (
    <div
      className="flex flex-col h-full p-6"
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Title>Solace Advocates</Title>

      <div className="my-8">
        <Title level={2}>Search</Title>
        <div className="flex justify-between">
          <Search
            allowClear
            placeholder="input search text"
            style={{ minWidth: 200, maxWidth: 500 }}
            onSearch={onSearch}
          />

          <Button>Reset Search</Button>
        </div>
      </div>
      {!advocates.length && search ? (
        <Empty description="We did not find any results, try changing your search and filters!" />
      ) : (
        <AdvocatesTable data={advocates} searchTokens={search.split(' ').filter(Boolean)}  />
      )}
    </div>
  );
}
