import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class CertificateStack extends cdk.Stack {
  public readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, 'MauricodeZone', {
      domainName: 'mauricode.co.uk',
    });

    this.certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: 'speckled-men.mauricode.co.uk',
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
  }
}
