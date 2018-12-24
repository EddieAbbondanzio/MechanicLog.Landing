MechanicLog.net Landing Page
===

The landing page for my SaaS site [MechanicLog](http://mechaniclog.net). MechanicLog.net is a vehicle maintenance logger for recording the service history of vehicles for individuals, or businesses. Also provides the ability to schedule email reminders to ensure your vehicles are always up to date, and running at peak performance.

The landing page is lightweight, and designed to collect emails of those interested in using the SaaS when it releases. Built using NodeJS, Express, and SQLite. Since it's only a single page, no templating engine was used as that would be overkill. The backend is written in TypeScript, and the 35ish lines of code to operate the page are written in JavaScript. Bootstrap was used to allow for a rapid prototype of the page.

PM2 was used to ensure the server is always active, and automatically restart in the event the server crashes. The server runs on port 3117, and will need nginx to run properly on Ubuntu.

Commands
---

|Command                    | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| pm2 start ./dist/index.js | Start up the server and begin listening for incoming requests. |
| pm2 stop ./dist/index.js  | Stop the serer.                                                |


To start: pm2 start ./dist/index.js
To Stop: pm2 stop ./dist/index.js
