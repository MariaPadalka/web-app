import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import './tasks.css';



const NewTask: React.FC = () =>{ 
    const {store} = useContext(Context);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        store.getTasks();
    }, [])

    const onFinish= async (values:any) =>{
        setLoading(true);

        var title = values.title;
        var index = values.index;
        if(!title){
            title = "Untitled";
        }
        const message = await store.createTask(title, index);

        if(message){
            console.log('Error: ', message);
        }

        setLoading(false);
    }

    return(
        <Form
        className="new-task-container"
        onFinish={onFinish}
        layout="vertical"
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: 'Enter title',
                    }]}
                >
                    <Input/>
            </Form.Item>
            <Form.Item
                label="Index"
                name="index"
                rules={[
                {
                    required: true,
                    message: 'Please input number to add task',
                },
                {
                    pattern: /^\d+$/, // Регулярний вираз, що відповідає цілим числам
                    message: 'Please enter a valid integer number',
                },
                {
                    min: 0,
                    message: 'Index cannot be less than 0',
                },
                {
                    max: 1000,
                    message: 'Index cannot be greater than 1000',
                },
                ]}>
                    <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading = {loading} className='add-button'>Add</Button>
            </Form.Item>
        </Form>
    )

};

export default observer(NewTask);