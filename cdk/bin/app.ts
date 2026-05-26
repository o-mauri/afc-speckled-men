#!/usr/bin/env node
import 'source-map-support/register';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
import * as cdk from 'aws-cdk-lib';
import { SpeckledMenStack } from '../lib/speckled-men-stack';
import { CertificateStack } from '../lib/certificate-stack';

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || 'eu-west-1';

const certStack = new CertificateStack(app, 'SpeckledMenCertStack', {
  env: { account, region: 'us-east-1' },
  crossRegionReferences: true,
});

new SpeckledMenStack(app, 'SpeckledMenStack', {
  env: { account, region },
  crossRegionReferences: true,
  certificate: certStack.certificate,
});
