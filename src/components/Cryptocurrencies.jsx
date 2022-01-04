import {useState, useEffect} from 'react';
import React from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import {Card, Row, Col, Input} from 'antd';
import {useGetCryptosQuery} from '../services/cryptoApi';
import './cryptocurrencies.css'

const Cryptocurrencies = ({simplified}) => {
    const count = simplified ? 10 : 100;
    const {data:cryptosList, isFetching } = useGetCryptosQuery(count);
    const [cryptos, setCryptos] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    // console.log(cryptos);
    useEffect(() => {
        // setCryptos(cryptosList?.data?.coins);
        const filteredData = cryptosList?.data?.coins.filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setCryptos(filteredData)
    }, [cryptosList, searchTerm])
    if (isFetching) return 'Loading ...'

    return (
        <>
        {!simplified &&(

        <div className="search_crypto">
            <Input className="searchInput"
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        )}
            <Row gutter = {[32, 32]} className="crypto-card-container">
                {
                    cryptos?.map((currency) =>(
                        <Col xs={24} sm={12} lg={6} className="crypto-card" key = {currency.id}>
                            <Link to = {`/crypto/${currency.id}`}>
                                <Card className="card"
                                    title = {`${currency.rank}. ${currency.name}`}
                                    extra = {<img className= "crypto-image" src={currency.iconUrl}/>}
                                    hoverable
                                    >
                                    <p>Price : {millify(currency.price)}</p>
                                    <p>Market Cap: {millify(currency.marketCap)}</p>
                                    <p>Daily Change: {millify(currency.change)}%</p>
                                </Card>
                            </Link>
                        </Col>
                    ))
                }
            </Row>
        </>
      
    )
}

export default Cryptocurrencies
