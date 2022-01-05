import React from 'react';
import { useState } from 'react'
import {Select, Typography, Row, Avatar, Card, Col} from 'antd'
import moment from 'moment'
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import {useGetCryptosQuery} from '../services/cryptoApi';
import './style/news.css'
import Loader from './Loader';

const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';
const {Text, Title} = Typography;
const {Option} = Select;
const News = ({simplified}) => {
    const [newsCategory, setNewCategory] = useState('Cryptocurrency')
    const {data: cryptoNews } = useGetCryptoNewsQuery({newsCategory: newsCategory, count: simplified ? 6 : 12 });
    const {data} = useGetCryptosQuery(100);
    // console.log(cryptoNews);
    if(!cryptoNews?.value) return <Loader />
    return (
      <Row gutter= {[24, 24]}>
      {!simplified && (
          <Col className="select" span={24}>
            <Select
            showSearch
            className="select-news"
            placeholder="Select a crypto "
            optionFilterProp="children"
            onChange={(value) => setNewCategory(value)}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >0 }
            >
                <Option
                    value="Cryptocurrency"
                >
                    Crytocurrency
                </Option>
                {data?.data?.coins.map((coin) => <Option
                    value={coin.name}
                >
                    {coin.name}
                </Option>)}
            </Select>
          </Col>
      )}
        {cryptoNews.value.map((news, i) =>(
            <Col  xs={24} sm={12} lg={8} key={i}>
                <Card hoverable className="news-card">
                    <a href={news.url} target="_blank" rel="noreferrer">
                        <div className="news-image-container">
                            <Title className="news-title" level = {4}>
                                {news.name}
                            </Title>
                            <img className="news-image" src={news?.image?.thumbnail?.contentUrl || demoImage} alt="news" />
                            <p>{
                                news.description > 100 ? `${news.description.substring(0,100)}..`
                                : news.description}
                            </p>
                            <div className="provider-container">
                                <div>
                                    <Avatar  src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage }/>
                                    <Text className="provider-name">
                                        {news.provider[0].name}
                                    </Text>
                                </div>
                                    <Text className="date">
                                        {moment(news.datePublished).startOf('ss').fromNow()}
                                    </Text>
                            </div>
                            {/* <img src={news?.image?.thumbnail?news.contentUrl || demoImage > */}
                        </div>
                    </a>
                </Card>
            </Col>
        ))}
      </Row>
    )
}

export default News
