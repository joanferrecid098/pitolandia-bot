build_image:
	docker build -t ghcr.io/joanferrecid098/pitolandia-bot:latest .

run_image:
	docker run --name pitolandia-bot -e TOKEN=${PITOLANDIA_BOT_TOKEN} -e MONGODB_URI=${MONGODB_URI_DISCORD} -d pitolandia-bot:latest