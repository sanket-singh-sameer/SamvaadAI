import crypto from 'crypto';

console.log('\n🔐 JWT Secret Generator\n');
console.log('Copy these secrets to your .env file:\n');
console.log('='.repeat(70));
console.log('\n# JWT Secrets (generated ' + new Date().toISOString() + ')');
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('\n' + '='.repeat(70));
console.log('\n⚠️  IMPORTANT: Never commit these secrets to version control!');
console.log('✅ Add these to your .env file and keep it secure.\n');
