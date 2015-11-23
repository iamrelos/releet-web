(function(){
    'use strict';

    angular.module('services').factory('ParseServices', ['$http', '$q', function($http, $q){
        
        
        function parseToJSON(data){
            var temp = [];
            
            angular.forEach(data, function(value, key){
                this.push(value.toJSON());
            }, temp);
                    
            return temp;
        };
        
        return {
            getGameInformation: function (gameId){
                var q = $q.defer();
                
                var query = new Parse.Query(Parse.Object.extend("Games"));
                query.equalTo("gameId", gameId);
                query.find().then(function(results){
                    q.resolve(parseToJSON(results));
                }, function (error){
                    q.reject(error)
                });
                
                return q.promise;
            },
            getGameAchievements: function (gameId) {
                var q = $q.defer();
                 
                var query = new Parse.Query(Parse.Object.extend("Achievements"));
                query.equalTo("gameId", gameId);
                query.find().then(function(results){
                    q.resolve(parseToJSON(results));
                }, function (error){
                    q.reject(error)
                });
                
                return q.promise;
            },
            addGameInfoToParse: function (game) {
                var q = $q.defer();
                
                var query = new Parse.Query(Parse.Object.extend("Games"));
        
                query.equalTo("gameId", game.gameId);
                query.find().then(function(results){
                    if (results.length > 0) q.resolve(results);
        
                    var ParseGame = Parse.Object.extend("Games");
                    var parseGame = new ParseGame();
                    game.achievementCount = 0;
                    game.show = false
    
                    parseGame.save(game).then(function(results) {
                        q.resolve(results.toJSON());
                    }, function(response, error) {
                        q.reject(error);
                    });
                });
                
                return q.promise;
            },
            addAchievementsToParse: function (achievements) {
                var q = $q.defer();
                var data = achievements;
                
                var query = new Parse.Query(Parse.Object.extend("Games"));
        
                query.get(data[0].game, {
                    success: function(game) {
                        var content = [];
        
                        var Achievement = Parse.Object.extend("Achievements");
        
                        for (var i = 0; i < data.length; i++){
                            if (!data[i].inParse) {
                                var ach = new Achievement();
                                ach.set('achievementId', data[i].achievementId);
                                ach.set('title', data[i].title);
                                ach.set('description', data[i].description);
                                ach.set('game', game);
                                ach.set('gameId', data[i].gameId);
                                ach.set('gamerScore', data[i].gamerScore);
                                ach.set('imageUrl', data[i].imageUrl);
                                ach.set('permalink', data[i].permalink);
        
                                content.push(ach);
                            }
                        }
                        
                        game.set("achievementCount", (game.get("achievementCount") + content.length));
        
                        Parse.Object.saveAll(content, {
                            success: function(objs) {
                                var relation = game.relation("achievements");
                                
                                for(var i = 0; i < objs.length; i++){
                                    relation.add(objs[i]);
                                }
                                
                                game.save();
                                
                                q.resolve(parseToJSON(objs));
                            },
                            error: function(error) {
                                q.reject(error);
                            }
                        });
                    },
                    error: function(object, error) {
                        q.reject(error);
                    }
                });
                
                return q.promise;
            }
        }
    }]);
})();