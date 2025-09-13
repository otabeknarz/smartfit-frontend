import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "3df15cd5507532f9026af02a9599fc77.r2.cloudflarestorage.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
