import { AdvocateDetails, Specialty } from '@/types';
import { Table, Tag } from 'antd';

type Props = {
  data: AdvocateDetails[];
};

const AdvocatesTable = ({ data }: Props) => {
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
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
