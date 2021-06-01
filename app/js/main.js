window.onload = function() {
    let css = 'padding: .5rem; background: #4472c4; font: 1.6em/1 Arial; color: white;'
    console.log("%cready!", css);

    function createNode(element) {
        return document.createElement(element);
    }

    function append(parent, el) {
        return parent.appendChild(el);
    }


    const list = document.getElementById('pageContent');
    const btn = document.getElementById('loadMore');
    let nextPage = 1;
    const requestURL = `https://animechan.vercel.app/api/quotes/anime?title=naruto&page=${nextPage}`;
    function sendRequest(method, url){
        const headers = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'

        }
        return fetch(url, {
            method: method,
            headers: headers
        })
            .then(response => {
            if(response.ok){
                return response.json()
            } else {
                return response.json().then( error => {
                    const er = new Error('error');
                    er.data = error
                    throw er
                })
            }
        })
    }

    getData();
    function getData(){
        nextPage++;
        sendRequest('GET', requestURL)
            .then(function(data) {
                let quotes = data;
                quotes.sort( (a, b) => {
                    if (a.character < b.character)
                        return -1
                    if (a.character > b.character)
                        return 1
                    return 0
                });
                let obj = {};
                quotes.forEach(d => {
                    if ( ! obj[d.character] ) {
                        obj[d.character] = d;
                    }
                })
                let res = Object.values(obj);

                const count = document.getElementById('countElements');
                const countUnique = document.getElementById('countUniqueElements');
                count.innerHTML = 'Total elements: ' + quotes.length;
                countUnique.innerHTML = 'Unique elements: ' + res.length;

                return res.map(function(quote) {
                    let article = createNode('article');
                    article.classList.add('page-content__list-item');

                    let quoteText = (quote.quote).substring(0,50)+"...";

                    article.innerHTML =
                        `<p>
                            <span class="page-content__list-item-character">${quote.character}:</span> 
                            <span class="page-content__list-item-quote">"${quoteText}"</span>
                        </p>
                        `;

                    append(list, article);
                    btn.classList.remove('hide');
                })

            })
            .catch(err => console.log(err));
    }

     btn.addEventListener('click', getData);

    checkSmall();
    function checkSmall(){
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (windowWidth < 1260){
            console.log('mobile')
        }
    }
    window.addEventListener("resize", function() {
        checkSmall();
    });

};
