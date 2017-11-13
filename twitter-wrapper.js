const T = require("twit");
const Promise = require('bluebird');

let twitterInstance;

const _getTwitter = () => {
    if (!twitterInstance) {
        return new T({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_API_SECRET,
            app_only_auth: true
        });
    }

    return twitterInstance;
};

const WORLDWIDE_WOEID = 1;
const TRENDS_PATH = 'trends/place';

exports.getTrends = (cityName) => {
    return new Promise((resolveCallback, rejectCallback) => {
        _getTwitter().get(TRENDS_PATH, { id: WORLDWIDE_WOEID }, (err, data, response) => {
            if (err) {
                rejectCallback(err);
            } else if (data) {
                let topTrends = [];
                data = data[0];
                if (data && data.trends && data.trends.length) {
                    topTrends = data.trends.slice(0, 5);
                }

                if (topTrends && topTrends.length) {
                    resolveCallback(topTrends);
                } else {
                    rejectCallback();
                }
            }
        });
    });
}
