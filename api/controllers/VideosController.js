var request = require('request');
var cheerio = require('cheerio');
/**
 * VideosController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

module.exports = {

    find: function(req, res) {
        var p = req.param('p');
        if (p === null||p===undefined) {
            p = 1;
        }
        request.get({
            url: 'http://entretenimento.band.uol.com.br/paniconaband/videos.asp?p='+p
        }, function(err, httpResponse, body) {
            $ = cheerio.load(body);
            var obj = {};
            $("ul.lista_videos").each(function() {
                var id = $(this).attr("id");
                var dt = id.split("slide-lista-domingo")[1];
                obj[id] = {
                    id: id,
                    dt: dt
                };
                obj[id].videos = [];
                $(this).find("li.grid_p").each(function() {
                    var o = {
                        link: $(this).find("a").attr("href"),
                        title: $(this).find("p").text(),
                        img: $(this).find("img").attr("src"),
                    };
                    var l = o.link.replace("http://", "").split("/");
                    o.video = "http://video21.mais.uol.com.br/" + l[3] + ".mp4?ver=1&start=0&r=http%3A%2F%2Fplayer.mais.uol.com.br%2Fplayer_video_v2_band.swf%3FmediaId%3D15641175%26tv%3D1%26p%3Dembed_start"
                    obj[id].videos.push(o);
                });
            });
            return res.json(obj);
        });
    }
};
