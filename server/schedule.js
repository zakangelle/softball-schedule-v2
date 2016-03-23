const curl = require('curlrequest');
const cheerio = require('cheerio');
const htmlToJson = require('html-to-json');
const moment = require('moment');

const SCHEDULE_URL = 'http://www.teamsideline.com/Org/StandingsResults.aspx?d=xRIu3qqX6IiJhYMtStQM13QZD5DztI3Tvequts2hASiE1qGPloCO87eZyrOLYZQibhUCMiC0XyY%3d';
const GAME_TABLE_SELECTOR = '#ctl00_OrgContentUnit_ScheduleGrid_ctl00 tbody';

module.exports = fetchSchedule;

function fetchSchedule() {
  return scrapeHtmlFromUrl(SCHEDULE_URL)
    .then(html => convertScheduleToJson(html(GAME_TABLE_SELECTOR).html()))
    .then(scheduleJson => {
      return { data: scheduleJson, raw: SCHEDULE_URL };
    });
}

/**
 * @param {string} url
 * @return {Promise<object>}
 */
function scrapeHtmlFromUrl(url)
{
  return new Promise(function(resolve, reject) {
    curl.request({ url: url }, function(err, res) {
      if (err) {
        reject(err);
      }
      else {
        resolve(cheerio.load(res));
      }
    });
  });
}

function convertScheduleToJson(schedule)
{
  return htmlToJson.parse(schedule, ['tr[id*="ScheduleGrid"] td', function($schedule) {
    return $schedule.text().trim();
  }])
  .then(items => getGamesFromItems(items).map(g => formatGame(g)));
}

function getGamesFromItems(items) {
  var games = [];

  var timesToSplice = items.length / 5;
  for (var i=0; i < timesToSplice; i++) {
    games.push(items.splice(0, 5));
  }

  return games;
}

function formatGame(g) {
  var game = {};

  game.date = g[0] + '/' + moment().format('YYYY');
  game.time = g[1];
  game.away_team = g[2].replace(/\s\d+/g, '').trim();
  game.home_team = g[3].replace(/\s\d+/g, '').trim();

  var awayScore = g[2].match(/\d+$/);
  var homeScore = g[3].match(/\d+$/);

  if (awayScore && !isNaN(awayScore[0])) {
    game.away_score = parseInt(awayScore[0]);
    game.home_score = parseInt(homeScore[0]);
  }

  game.location = g[4];

  return game;
}
