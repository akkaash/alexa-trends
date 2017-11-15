### Welcome to the Alexa Twitter Trends Skill


This is an Alexa skill which can be used to get you the latest given a city name in the United States.

This skill uses the [Twitter API](https://developer.twitter.com) to get the latest trends for a place. It also relies on the [PY-WOEID](https://github.com/akkaash/pylambda-woeid) API to retrieve the [Where on Earth IDentifier](https://en.wikipedia.org/wiki/WOEID) for the query city name.

This project is made possible by using the following:
* [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model/)
* [SAM Local](https://github.com/awslabs/aws-sam-local)
* [Twit](https://www.npmjs.com/package/twit)
* [YQL](https://developer.yahoo.com/yql/)

#### Code Structure
* README.md - this file
* buildspec.yml - This YAML file is used by AWS CodeBuild to create an artifact
  that can be used to deploy to AWS Lambda through CloudFormation.
* index.js - This file contains the AWS Lambda code used to interact with Alexa.
* twitter-wrapper.js - This file contains the code to do `GET trends/place` and return the top 5 trends given `woeid`.
* events.json -  This file contains a sample of list of events that can be use to do local development using [sam-local](https://github.com/awslabs/aws-sam-local)
* package.json - This file is used by NPM to package your Alexa skill.
* template.yml - This YAML file is used by AWS CloudFormation to update AWS Lambda
  and manage any additional AWS resources.
