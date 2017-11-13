/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';

const Alexa = require('alexa-sdk');
const TwitterWrapper = require('./twitter-wrapper');

const APP_ID = process.env.ALEXA_APP_ID;

const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'TwitterTrendsIntent': function () {
        const citySlot = this.event.intent.slots.City;
        let cityName;
        if (citySlot && citySlot.value) {
            cityName = citySlot.value.toLowerCase();
        }

        TwitterWrapper.getTrends(cityName)
            .then(data => {
                const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), cityName);

                const trendNames = data.map((trend) => trend.name);
                this.attributes.speechOutput = this.t('RESULTS', cityName, trendNames);

                this.emit(':tellWithCard', this.attributes.speechOutput, cardTitle, this.attributes.speechOutput);
            })
            .catch(error => {
                this.attributes.speechOutput = this.t('COULD_NOT_GET_TRENDS_MESSAGE');
                this.emit(':tell', this.attributes.speechOutput);
            });
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Twitter Trends Lookup',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what are the twitter trends in Seattle? ... Now, what can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s - Trends for %s.',
            HELP_MESSAGE: "You can ask questions such as, what are the twitter trends in Seattle, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what are the twitter trends in Seattle, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            COULD_NOT_GET_TRENDS_MESSAGE: "I\'m sorry, I am currently having trouble accessing Twitter trends. ",
            CITY_NOT_COUND_WITH_CITY_NAME: 'the trends for %s. ',
            CITY_NOT_FOUND_WITHOUT_CITY_NAME: 'that search. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
            RESULTS: 'Here are the latest trends in %s... %s'
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};