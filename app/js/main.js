window.onload = function() {
    let css = 'padding: .5rem; background: #4472c4; font: 1.6em/1 Arial; color: white;'
    console.log("%cready!", css);

    function createNode(element) {
        return document.createElement(element);
    }

    function append(parent, el) {
        return parent.appendChild(el);
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    const list = document.getElementById('pageContent');
    const btn = document.getElementById('loadMore');

    const currentPage = 0;
    let nextPage = currentPage + 1;
    const title = 'naruto'
    const requestURL = `https://animechan.vercel.app/api/quotes/anime?title=${title}&page=${nextPage}`;

    function sendRequest(method, url, page){
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


    sendRequest('GET', requestURL, nextPage)
        .then(function(data) {
            let quotes = data;
            console.log('quotes:', typeof quotes, quotes);

            const arrCharacters = [];
            quotes.forEach(quote => {
                const characterName = quote?.character;
                arrCharacters.push(characterName);
            });
            const uniqCharacters = arrCharacters.filter(onlyUnique);
            uniqCharacters.sort();
            console.log('uniqCharacter', uniqCharacters);

            let result = {};
            for (let i in Object.keys(quotes)) {
                if (quotes[i].character !== quotes[i].character) {
                    result[i] = Object.assign({}, quotes[i]);
                    console.log('unique');
                }
            }
            console.log('result:', result);
            console.log('result:', Object.keys(result));


            const count = document.getElementById('countElements');
            const countUnique = document.getElementById('countUniqueElements');
            count.innerHTML = 'Total elements: ' + quotes.length;
            countUnique.innerHTML = 'Unique elements: ' + uniqCharacters.length;

            function byCharacter(field) {
                return (a, b) => a[field] > b[field] ? 1 : -1;
            }

            const sortedQuotes = quotes.sort(byCharacter('character')).filter(onlyUnique);

            return sortedQuotes.map(function(quote) {

                let div = createNode('div');
                div.classList.add('page-content__listItem');

                let quoteText = (quote.quote).substring(0,50)+"...";

                div.innerHTML =
                    `<span class="page-content__listItemCharacter">${quote.character}:</span> 
                    <span class="page-content__listItemQuote">"${quoteText}"</span>`;

                append(list, div);
                btn.classList.remove('hide');
            })

        })
        .catch(err => console.log(err));

     btn.addEventListener('click', sendRequest('GET', requestURL, nextPage + 1));


    function checkSmall(){
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (windowWidth < 1260){
            console.log('mobile')
        }
    }

    window.addEventListener("resize", function() {
        checkSmall();
    });

    checkSmall();
};
