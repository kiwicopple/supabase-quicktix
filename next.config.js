/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [process.env.SUPABASE_HOSTNAME],
  },
}
