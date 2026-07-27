const http = require('http');

http.get('http://localhost:3000/api/v1/products/getAllProducts', (res) => {
  let data = '';
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Success, data length:', json.data.data.length);
      console.log('First product:', json.data.data[0]);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Request Error:', err.message);
});
