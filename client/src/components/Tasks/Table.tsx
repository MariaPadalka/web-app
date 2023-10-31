import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import './tasks.css';
import TaskDto from '../../models/TaskDto';


const Tasks: React.FC = () =>{ 
    const {store} = useContext(Context);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [startLoading, setStartLoading] = useState(false);



    useEffect(() => {
        // Опція для зберігання ID таймера
        let timerId: NodeJS.Timeout;
    
        store.getTasks();
    
        // Створюємо таймер, який буде виконувати запит кожну секунду
        if (startLoading) {
          timerId = setInterval(() => {
            store.getTasks();
          }, 1000);
        }
    
        // Під час очищення компоненту зупиняємо таймер
        return () => {
          if (timerId) {
            clearInterval(timerId);
          }
        };
      }, [startLoading]);
    
      var data: TaskDto[] = store.tasks;
    
      useEffect(() => {
        data = store.tasks;
      }, [store.tasks]);

    var data: TaskDto[] = store.tasks;


    const columns: ColumnsType<TaskDto> = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Number',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: 'Status',
          key: 'status',
          dataIndex: 'status',
          render: (status) => {
              let color = status.length > 5 ? 'geekblue' : 'green';
              if (status === 'Paused') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={status}>
                  {status.toUpperCase()}
                </Tag>
              );
            },
        },
        {
          title: 'Progress',
          dataIndex: 'percentage',
          key: 'percentage',
          render: (percentage) => `${percentage}%`, 
        },
        {
          title: 'Result',
          dataIndex: 'result',
          key: 'result',
          render: (result) => (result === -1 ? '-' : result),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => {
              const isDeleteLoading = deleteLoading;
              const isStartLoading = startLoading;
          
              return (
                <Space size="middle">
                  <Button
                    loading={isDeleteLoading}
                    onClick={async () => {
                      setDeleteLoading(true);
                      await store.deleteTask(record._id);
                      setDeleteLoading(false);
                    }}
                    disabled={isDeleteLoading || isStartLoading}
                  >
                    Delete
                  </Button>
                  {record.status !== 'Done' && (
                    <Button
                      loading={isStartLoading}
                      onClick={async () => {
                        setStartLoading(true);
                        await store.startTask(record._id);
                        setStartLoading(false);
                      }}
                      disabled={isDeleteLoading || isStartLoading}
                    >
                      Start
                    </Button>
                  )}
                </Space>
              );
            },
          }
          
          
      ];

    return(
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 6 }} className="table"/>
    )

};

export default observer(Tasks);