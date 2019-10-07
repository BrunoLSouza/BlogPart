
define(['./template.js', '../lib/showdown/showdown.js', './clientStorage.js'], function (template, showdown, clientStorage) {

    var blogLatestPostsUrl = '/Home/LatestBlogPosts/';
    var blogPostUrl = '/Home/Post/?link=';
    var blogMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';


    function setOldestBlogPostId(data) {
        var ids = data.map(item => item.postId);
        oldestBlogPostId = Math.min(...ids);
    }

    function loadBlogPost(link) {
        fetch(blogPostUrl + link)
            .then(function (response) {
                return response.text();
            }).then(function (data) {
                var converter = new showdown.Converter();
                html = converter.makeHtml(data);
                template.showBlogItem(html, link);
                window.location = '#' + link;
            });
    }

    //function loadMoreBlogPosts() {
    //    loadData(blogMorePostsUrl + oldestBlogPostId);
    //}

    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    }

    function loadData(url) {
        fetchPromise(url)
            .then(function (status) {
                $('#connection-status').html(status);
                clientStorage.getPosts()
                    .then(function (posts) {
                        template.appendBlogList(posts);
                    })
            });
    }

    function loadMoreBlogPosts() {
        loadData(blogMorePostsUrl +
            clientStorage.getOldestBlogPostId());
    }

    function loadLatestBlogPosts() {
        loadData(blogLatestPostsUrl);
    }


    function fetchPromise(url) {
        return new Promise(function (resolve, reject) {
            fetch(url)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    clientStorage.addPosts(data)
                        .then(function () {
                            resolve('The connection is OK, showinglatest results');
                        });
                }).catch(function (e) {
                    resolve('No connection, showing offlineresults');
                });
            setTimeout(function () {
                resolve('The connection ishanging, showing offline results');
            }, 1000);
        });
    }
});