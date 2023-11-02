import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Spin, Table, Tag , Modal} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import './tasks.css';
import TaskDto from '../../models/TaskDto';
import TaskLog from '../../models/TaskLog';
import moment from 'moment';


const Tasks: React.FC = () =>{ 
    const {store} = useContext(Context);
    const [startLoading, setStartLoading] = useState<{ [taskId: string]: boolean }>({});
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [taskLogs, setTaskLogs] = useState<{ time: Date; description: string }[]>([]);

    var data: TaskDto[] = store.tasks;
    
    useEffect(() => {
      store.getTasks();
    }, []);

    useEffect(() => {
      data = store.tasks;
    }, [store.tasks]);

    useEffect(() => {
        // Опція для зберігання ID таймера
        let timerId: NodeJS.Timeout;
    
        // Створюємо таймер, який буде виконувати запит кожну секунду
        if (Object.values(startLoading).some(isLoading => isLoading)) {

          timerId = setInterval(() => {
            if(Object.values(startLoading).some(isLoading => isLoading)){
              store.getTasks();
            }
          }, 1000);
        }
    
        // Під час очищення компоненту зупиняємо таймер
        return () => {
          if (timerId) {
            clearInterval(timerId);
          }
        };
      }, [startLoading]);
    


      const renderTaskLogs = () => {
        return (
          detailsLoading ? (
            <Spin />
          ) : (
            <div>
              {taskLogs.map((log, index) => (
                <div key={index}>
                  <p>{`Time: ${formatAndAddOffset(log.time)}`}</p>
                  <p>{`Description: ${log.description}`}</p>
                  {index < taskLogs.length - 1 && <hr />}
                </div>
              ))}
            </div>
          )
        );
      };
      
      const formatAndAddOffset = (time: Date) => {
        const utcTime = moment.utc(time); // Позбавляємося від гринвіцького offset
        const localTime = utcTime.local(); // Переводимо до місцевого offset
        return localTime.format('YYYY-MM-DD HH:mm:ss'); // Форматуємо потрібним чином
      };


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
          render: (status, record) => {
              let color = status.length > 5 ? 'geekblue' : 'green';
              if (status === 'Paused') {
                color = 'volcano';
              }
              return (
                <>
                  <Tag color={color} key={status}>
                    {status.toUpperCase()}
                  </Tag>
                  {startLoading[record._id] && status === "In Progress" && <Spin />}
                </>
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
          
              return (
                <Space size="middle">
                    {record.status !== 'Done' && (
                    <Button
                      onClick={async () => {
                        setStartLoading({ ...startLoading, [record._id]: true });
                        await store.startTask(record._id);
                        setStartLoading({ ...startLoading, [record._id]: false });
                      }}
                    >
                      Start
                    </Button>)}

                    {record.status === 'In Progress' && (
                    <Button
                      onClick={async () => {
                        await store.stopTask(record._id);
                        setStartLoading({ ...startLoading, [record._id]: false });
                      }}
                    >
                      Stop
                    </Button>
                  )}
                    
                    {record.status === 'Paused' && (
                    <Button
                      onClick={async () => {
                        setStartLoading({ ...startLoading, [record._id]: true });
                        await store.resumeTask(record._id);
                        setStartLoading({ ...startLoading, [record._id]: false });
                      }}
                    >
                      Resume
                    </Button>
                  )}
                  
                  <Button
                    onClick={async () => {
                      setDetailsLoading(true);
                      setSelectedTaskId(record._id);
                      setIsModalOpen(true);
                      // Отримати журнал подій для вибраного завдання
                      const logs = await store.getTaskInfo(record._id);
                      setTaskLogs(logs);
                      setDetailsLoading(false);
                    }}
                  >
                    View details
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      await store.deleteTask(record._id);
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
        <><Table columns={columns} dataSource={data} pagination={{ pageSize: 6 }} className="table" />
        <Modal title="Details" open={isModalOpen} onCancel={() => {setIsModalOpen(false); setSelectedTaskId('')}} footer={null}>
        {selectedTaskId && renderTaskLogs()}
      </Modal>
      </>
    )

};

export default observer(Tasks);