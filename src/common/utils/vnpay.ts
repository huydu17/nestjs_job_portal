/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment-timezone';

export function buildVnpDate(date: Date = new Date()) {
  return moment(date).tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
}

function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  for (const k of keys) {
    const value = obj[k] ?? '';
    sorted[k] = encodeURIComponent(String(value)).replace(/%20/g, '+');
  }
  return sorted;
}

export function createPaymentUrl(params: Record<string, any>) {
  const vnpUrl = process.env.VNP_URL!;
  const secret = process.env.VNP_HASH_SECRET!;
  const sorted = sortObject(params);
  const signData = qs.stringify(sorted, { encode: false });
  const signed = crypto
    .createHmac('sha512', secret)
    .update(signData)
    .digest('hex');
  return `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;
}

export function verifyVnpQuery(query: Record<string, any>) {
  const secret = process.env.VNP_HASH_SECRET!;
  const receivedHash = query['vnp_SecureHash'];
  const clone: Record<string, any> = { ...query };
  delete clone['vnp_SecureHash'];
  delete clone['vnp_SecureHashType'];
  const sorted = sortObject(clone);
  const signData = qs.stringify(sorted, { encode: false });
  const signed = crypto
    .createHmac('sha512', secret)
    .update(signData)
    .digest('hex');
  return signed === receivedHash;
}
