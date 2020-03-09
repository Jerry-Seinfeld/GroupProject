(function () {
    "use strict";

   
    var prompt = require('prompt'),
        fs = require('fs'),
        exp = require('express'),
        XP  = require('expandjs'),
        API = require('lol-esports-api-module'),
        app = exp(),
        api = new API(),


        routes = {
            '/news': {
                method: 'getNews',
                param: 'opt'
            },
            '/leagues': {
                method: 'getLeagues',
                param: 'none'
            },
            '/leagues/:id': {
                method: 'getLeagueById',
                param: 'id'
            },
            '/tournaments': {
                method: 'getTournaments',
                param: 'none'
            },
            '/tournaments/:id': {
                method: 'getTournamentById',
                param: 'id'
            },
            '/tournaments/:id/standings': {
                method: 'getStandings',
                param: 'id'
            },
            '/tournaments/:tournamentId/schedule': {
                method: 'getSchedule',
                param: 'opt'
            },
            '/tournaments/:tournamentId/leaders/:stat': {
                method: 'getStatLeaders',
                param: 'opt'
            },
            '/tournaments/:tournamentId/stats/fantasy': {
                method: 'getFantasyStats',
                param: 'opt'
            },
            '/tournaments/:id/stats/players': {
                method: 'getAllPlayersStats',
                param: 'id'
            },
            '/tournaments/:tournamentId/stats/players/:playerId': {
                method: 'getAllPlayersStatsById',
                param: 'opt'
            },
            '/tournaments/:tournamentId/stats/players/:playerId/champs': {
                method: 'getAllPlayersChampionsById',
                param: 'opt'
            },
            '/series': {
                method: 'getSeries',
                param: 'none'
            },
            '/series/:id': {
                method: 'getSeriesById',
                param: 'id'
            },
            '/matches/:id': {
                method: 'getMatchById',
                param: 'id'
            },
            '/games/:id': {
                method: 'getGameById',
                param: 'id'
            },
            '/teams/:id': {
                method: 'getTeamById',
                param: 'opt'
            },
            '/teams/:teamId/stats': {
                method: 'getTeamStats',
                param: 'opt'
            },
            '/players/:id': {
                method: 'getPlayerById',
                param: 'id'
            },
            '/players/:palyerId/stats': {
                method: 'getPlayerStats',
                param: 'opt'
            },
            '/programming': {
                method: 'getProgramming',
                param: 'opt'
            },
            '/programming/:id': {
                method: 'getProgrammingById',
                param: 'opt'
            },
            '/programming/week/:date': {
                method: 'getProgrammingWeek',
                param: 'opt'
            }
        },


        requestHandler = function (req, res) {
            var method = routes[req.route.path].method,
                cb = function (err, data) {

                    res.json(err || data);
                },
                opt;

            switch (routes[req.route.path].param) {
            case 'none':
                opt = cb;
                cb = null;
                break;
            case 'id':
                opt = req.params.id;
                break;
            case 'opt':
                opt = XP.merge({}, req.query, req.params);
                break;
            }

            api[method](opt, cb);
        };


    function init() {

        require('dotenv').load();

        app.port = process.env.PORT || 3002;

  
        app.get('/', function (req, res) {
            res.json({
                name: 'League of Legends eSports API',
                version: "0.9.0",
                author: "Robert Manolea <manolea.robert@gmail.com>",
                repository: "https://github.com/Pupix/lol-esports-api"
            });
        });

     
        XP.forEach(routes, function (func, route) {
            app.get(route, requestHandler);
        });

        app.use(function (req, res) { res.status(404).json({error: 404, message: "Not Found"}); });
        app.use(function (req, res) { res.status(500).json({error: 500, message: 'Internal Server Error'}); });

     
        app.listen(app.port, function () { console.log('League of Legends eSports API is listening on port ' + app.port); });
    }

   
    fs.stat('.env', function (err) {
        if (err) {
            prompt.start();
            prompt.message = '';
            prompt.delimiter = '';

            console.log('Config your API');

            prompt.get([
                {
                    name: 'port',
                    description: 'API port:'.white
                }
            ], function (err, res) {
                if (!err) {

                    var text = '';
                    text += 'PORT=' + res.port + '\n';

                    fs.writeFile('.env', text, function (err) {
                        if (!err) {
                            console.log('Config file created successfully');
                            init();
                        } else {
                            console.log('Couldn\'t create the config file');
                        }
                    });
                }
            });
        } else {
            init();
        }
    });

}());
