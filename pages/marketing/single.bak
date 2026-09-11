import React, { useEffect, useState } from "react";
import MarketingHeader from "../../components/parts/MarketingHeader";
import PanelLayout from "../../components/layouts/PanelLayout";
import Cookies from 'js-cookie';
import axios from 'axios'
import { useRouter } from "next/router";


function MarketerSingle(props) {
  const router = useRouter()
    const [loading, setLoading] = useState(true);
    const [marketers, setMarketers] = useState([]);
    const [marketer, setMarketer] = useState('');
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // {fetchWorker()}
        if (props.marketer && props.quote) {
            var guy = props.marketer;
            if (!guy.username) {
                router.push("/marketing/edit");
            }

            setLoading(false)
        }

        setMarketer(props.marketer)
        setMarketers(props.marketers)
        setQuote(props.quote)



    }, []);

    useEffect(() => {

        var token = Cookies.get('id_token');

        axios({
            method: 'post',
            url: 'https://api.ajur.app/api/marketer',
            params: {
                token: token,
            },

        })
            .then(function (response) {

                if (!response.data.marketer.username) {
                    router.push("/marketing/edit");

                } else {
                    setMarketer(response.data.marketer);
                    setQuote(response.data.quote);
                    setMarketers(response.data.marketers);
                    setLoading(false);
                }

            })

    }, []);

    useEffect(() => {
    console.log('Marketer:', marketer);
}, [marketer]);

useEffect(() => {
    console.log('Marketers:', marketers);
}, [marketers]);

useEffect(() => {
    console.log('Quote:', quote);
}, [quote]);


    return (
        <div>
            <MarketingHeader
                name={marketer?.name + marketer?.family}
                quote={quote}
                balance={100000}
                profileImage="/img/G-ads/ajur-gads.png"
            />

        </div>
    )
}

export default MarketerSingle;


MarketerSingle.getLayout = function (page) {
    return <PanelLayout>{page}</PanelLayout>;
};