import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import IUser from '../../models/IUser';
import { useNavigate } from 'react-router-dom';


const UsersTable: React.FC = () => { 
    const {store} = useContext(Context);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    var [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
      const fetchUsers = async () => {
        const fetchedUsers = await store.getUsers();
        setUsers(fetchedUsers || []);
      };
  
      fetchUsers();
    }, [store]);

    const columns: ColumnsType<IUser> = [
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          render: (email) => <a>{email}</a>,
        },
        {
          title: 'Activated',
          key: 'isActivated',
          dataIndex: 'isActivated',
          render: (isActivated) => {
            let color = isActivated ? 'green' : 'volcano';
        
            return (
              <Tag color={color} key={isActivated}>
                {isActivated ? 'Yes' : 'No'}
              </Tag>
            );
          },
        },
        {
            title: 'Role',
            key: 'isAdmin',
            dataIndex: 'isAdmin',
            render: (isAdmin) => {
              let color = isAdmin ? 'volcano' : 'green';
          
              return (
                <Tag color={color} key={isAdmin}>
                  {isAdmin ? 'Admin' : 'User'}
                </Tag>
              );
            },
          },          
        {
          title: 'Tasks number',
          dataIndex: 'numOfTasks',
          key: 'numOfTasks',
          render: (numOfTasks) => `${numOfTasks}`, 
        },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => {
          
              return (
                <Space size="middle">

                  <Button
                    onClick={async (e) => {
                      e.preventDefault();
                      setLoading(true);
                      await store.deleteUser(record.id);
                      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== record.id));
                      setLoading(false);
                      if(record.id === store.user.id){
                        navigate('/login');
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              );
            },
          }
      ];

    return(
        <Table columns={columns} dataSource={users} pagination={{ pageSize: 6 }} className="Usertable"/>
    )

};

export default observer(UsersTable);