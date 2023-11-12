function webpack(config, env) {
	if (env === "production") {
		config.optimization = {
			splitChunks: {
				cacheGroups: {
					vendor: {
						chunks: "initial",
						test: /[\\/]node_modules[\\/]/,
						name: "vendor",
					}
				}
			}
		}
	}
	return config
}