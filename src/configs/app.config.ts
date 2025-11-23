import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  vnpTmnCode: process.env.VNP_TMN_CODE,
  vnpHashSecret: process.env.VNP_HASH_SECRET,
  vnpUrl: process.env.VNP_URL,
  vnpReturnUrl: process.env.VNP_RETURN_URL,
  vnpIpnUrl: process.env.VNP_IPN_URL,
  clientUrl: process.env.CLIENT_URL,
}));
