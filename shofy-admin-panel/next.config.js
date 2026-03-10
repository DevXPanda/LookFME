/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false
      }
    ]
  },
  images: {
    domains: ['localhost', 'i.ibb.co', 'res.cloudinary.com', 'lh3.googleusercontent.com', 'placehold.co', 'lookfme.onrender.com'],
  },
}

module.exports = nextConfig
