const RENDER_URL = 'https://my-library-ykh3.onrender.com';

async function diagnose() {
  console.log(`🔍 Diagnosing Live Render Backend: ${RENDER_URL} ...\n`);

  try {
    console.log('1. Testing GET / ...');
    const res1 = await fetch(`${RENDER_URL}/`);
    console.log('Status:', res1.status);
    const text1 = await res1.text();
    console.log('Response:', text1.slice(0, 300));
  } catch (err) {
    console.error('Error on GET /:', err.message);
  }

  try {
    console.log('\n2. Testing GET /api/health ...');
    const res2 = await fetch(`${RENDER_URL}/api/health`);
    console.log('Status:', res2.status);
    const text2 = await res2.text();
    console.log('Response:', text2.slice(0, 300));
  } catch (err) {
    console.error('Error on GET /api/health:', err.message);
  }

  try {
    console.log('\n3. Testing CORS preflight OPTIONS /api/auth/login ...');
    const res3 = await fetch(`${RENDER_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://my-library-beryl-zeta.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    console.log('Status:', res3.status);
    console.log('Access-Control-Allow-Origin:', res3.headers.get('access-control-allow-origin'));
    console.log('Access-Control-Allow-Credentials:', res3.headers.get('access-control-allow-credentials'));
  } catch (err) {
    console.error('Error on OPTIONS /api/auth/login:', err.message);
  }

  try {
    console.log('\n4. Testing POST /api/auth/login (Demo login) ...');
    const res4 = await fetch(`${RENDER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://my-library-beryl-zeta.vercel.app'
      },
      body: JSON.stringify({
        email: 'demo@mylibrary.com',
        password: 'Password123!'
      })
    });
    console.log('Status:', res4.status);
    const text4 = await res4.text();
    console.log('Response:', text4.slice(0, 300));
  } catch (err) {
    console.error('Error on POST /api/auth/login:', err.message);
  }
}

diagnose();
