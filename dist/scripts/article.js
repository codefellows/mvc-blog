!function(t){function e(t){Object.keys(t).forEach(function(e,n,r){this[e]=t[e]},this)}e.all=[],e.createTable=function(t){webDB.execute("CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY, title VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, authorUrl VARCHAR (255), category VARCHAR(20), publishedOn DATETIME, body TEXT NOT NULL);",function(e){console.log("Successfully set up the articles table.",e),t&&t()})},e.truncateTable=function(t){webDB.execute("DELETE FROM articles;",t)},e.prototype.insertRecord=function(t){webDB.execute([{sql:"INSERT INTO articles (title, author, authorUrl, category, publishedOn, body) VALUES (?, ?, ?, ?, ?, ?);",data:[this.title,this.author,this.authorUrl,this.category,this.publishedOn,this.body]}],t)},e.prototype.deleteRecord=function(t){webDB.execute([{sql:"DELETE FROM articles WHERE id = ?;",data:[this.id]}],t)},e.prototype.updateRecord=function(t){webDB.execute([{sql:"UPDATE articles SET title = ?, author = ?, authorUrl = ?, category = ?, publishedOn = ?, body = ? WHERE id = ?;",data:[this.title,this.author,this.authorUrl,this.category,this.publishedOn,this.body,this.id]}],t)},e.loadAll=function(t){e.all=t.map(function(t){return new e(t)})},e.fetchAll=function(t){webDB.execute("SELECT * FROM articles ORDER BY publishedOn DESC",function(n){n.length?(e.loadAll(n),t()):$.getJSON("/data/hackerIpsum.json",function(n){n.forEach(function(t){var n=new e(t);n.insertRecord()}),webDB.execute("SELECT * FROM articles",function(n){e.loadAll(n),t()})})})},e.allAuthors=function(){return e.all.map(function(t){return t.author}).reduce(function(t,e){return-1===t.indexOf(e)&&t.push(e),t},[])},e.numWordsAll=function(){return e.all.map(function(t){return t.body.match(/\b\w+/g).length}).reduce(function(t,e){return t+e})},e.numWordsByAuthor=function(){return e.allAuthors().map(function(t){return{name:t,numWords:e.all.filter(function(e){return e.author===t}).map(function(t){return t.body.match(/\b\w+/g).length}).reduce(function(t,e){return t+e})}})},e.stats=function(){return{numArticles:e.all.length,numWords:e.numwords(),Authors:e.allAuthors()}},t.Article=e}(window);