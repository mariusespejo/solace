import { AdvocateDetails, Specialty } from '@/types';
import { Table, Tag } from 'antd';

type Props = {
  data: AdvocateDetails[];
  searchTokens: string[];
};

const AdvocatesTable = ({ data, searchTokens = [] }: Props) => {
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (value: string) => {
        const matching = searchTokens.filter((token) =>
          value.toLowerCase().includes(token.toLowerCase())
        );
        
        if (matching.length && searchTokens.length) {
          const token = matching[0];

          const matchIndex = value.toLowerCase().indexOf(token);

          const firstPart = value.substring(0, matchIndex);
          const highlight = value.substring(matchIndex, token.length);
          const endingPart = value.substring(matchIndex + token.length);

          return <div>{firstPart}<strong>{highlight}</strong>{endingPart}</div>;
        }

        return <div>{value}</div>;
      },
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Degree',
      dataIndex: 'degree',
      key: 'degree',
    },
    {
      title: 'Specialties',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties: Specialty[]) => (
        <div className="flex flex-wrap">
          {specialties.map((specialty) => {
            // TODO: utilize different colors per specialty
            return (
              <Tag
                color={'green'}
                key={specialty.id}
                style={{ marginBottom: 8 }}
              >
                {specialty.name}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Years of Experience',
      dataIndex: 'yearsOfExperience',
      key: 'yearsOfExperience',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (val: number) => {
        let s = val.toString();

        return (
          <div className="min-w-28">
            {`(${s.substring(0, 3)}) ${s.substring(3, 6)}-${s.substring(6)}`}
          </div>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns} />;
};

export default AdvocatesTable;
