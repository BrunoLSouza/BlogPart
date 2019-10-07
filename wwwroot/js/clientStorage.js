define([], function () {
    var blogInstance = localforage.createInstance({
        name: 'blog'
    });

    function addPosts(posts) {
        return new Promise(function (resolve, reject) {

            var keyValuePair = [];

            posts.map(function (item) {
                keyValuePair.push({ key: String(item.postId), value: item });
            })

            keyValuePair = keyValuePair.sort(function (a, b) { return b.key - a.key });

            blogInstance.setItem(keyValuePair)
                .then(function () {
                    resolve();
                });
        });
    }

    var oldestBlogPostId = null;
    var limit = 3;
    function getPosts() {
        return new Promise(function (resolve, reject) {
            blogInstance.keys().then(function (keys) {
                var index = keys.indexOf(oldestBlogPostId);
                if (index == -1) { index = keys.length; }
                if (index == 0) { resolve([]); return; }
                var start = index - limit;
                var limitAdjusted = start < 0 ? index : limit;
                var keys = keys.splice(Math.max(0, start),
                    limitAdjusted);
                blogInstance.getItem(keys).then(function (results) {
                    if (results === null)
                        return resolve();
                    var posts = Object.keys(results).map(function (k) { return results[k] }).reverse();
                    oldestBlogPostId = String(posts[posts.length - 1].postId);
                    resolve(posts);
                });
            });        });
    }
    function getOldestBlogPostId() {
        return oldestBlogPostId;
    }
    return {
        addPosts: addPosts,
        getPosts: getPosts,
        getOldestBlogPostId: getOldestBlogPostId
    }

});
