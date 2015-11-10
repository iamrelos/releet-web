module.exports = function() {
    var self = this;
    
    self.achievementId = null;
    self.title = null;
    self.gamerScore = null;
    self.description = null;
    self.imageUrl = null;
    self.permalink = null;
    self.setAchievementId = function(slug) {
        if (!slug) return;
        
        self.achievementId = slug.substr(0, slug.indexOf('-'));
    };
};