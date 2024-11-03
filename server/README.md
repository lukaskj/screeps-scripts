from [https://github.com/screepers/screeps-launcher](https://github.com/screepers/screeps-launcher)

> 1. Install [docker](https://docs.docker.com/install/) (look on the left to find the correct platform).
> 2. You might have to fiddle with the docker advanced settings to allow enough CPU to run the server smoothly.
> 3. Create an empty folder with both a `config.yml` (don't forget to add `screepsmod-mongo`!) and a `docker-compose.yml` (see examples). The `docker-compose.yml` example can be used as-is, but the `config.yml` requires some customization. Remove environments (line 2-5) in `config.yml`, since they are defined in docker-compose.yml.
> 4. Open a terminal in that folder. Run `docker-compose up` to start the services. Wait until it is done starting the docker images and settle on mongo status messages.
> 5. Open another terminal in that folder. Run `docker compose exec screeps-server screeps-launcher cli`. This is a command-line interface to control your new private server.
> 6. In the CLI, run `system.resetAllData()` to initialize the database. Unless you want to poke around, use `Ctrl-d` to exit the cli.
> 7. Run `docker compose restart screeps-server` to reboot the private server.
> 
> Your server should be up and running! Connect to it using the steam client:
> 
> Choose the _Private Server_ tab and connect using those options:
> - Host: _localhost_
> - Port: _21025_
> - Server password: _<leave blank, unless configured otherwise>_