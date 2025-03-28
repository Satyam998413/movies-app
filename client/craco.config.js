module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        {
          module: /flowbite-react/,
          message: /Failed to parse source map/,
        },
      ],
    },
  },
}; 