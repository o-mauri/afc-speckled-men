#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SpeckledMenStack } from '../lib/speckled-men-stack';

const app = new cdk.App();
new SpeckledMenStack(app, 'SpeckledMenStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1',
  },
});
