import IAWSConfig from './IAWSConfig';

const AWSConfig: IAWSConfig = {
    region: 'eu-west-1' || process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

export default AWSConfig;