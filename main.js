let results = []
let news = []
let index = 1
let batch = 0
let output = document.querySelector('.table__body')
let today = new Date()

function fetchResult() {
  fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Allow-Control-Access-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    }
  }).then(resp => {
    return resp.json()
  }).then(data => {
    results = data
    loadBatch()
  })
}

function fetchNews(index, maxIndex) {
  for (index; index < maxIndex; index++) {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${results[index]}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Allow-Control-Access-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      }
    }).then(resp => {
      return resp.json()
    }).then(data => {
      news.push(data)
      displayResult(data)
      if (index == maxIndex) {
        batch++;
        loadBatch()
      }
    })
  }
}

function loadBatch() {
  if (batch == 0) {
    fetchNews(0, 5)
  }
  else if (batch == 1) {
    fetchNews(5, 10)
  }
  else if (batch == 2) {
    fetchNews(10, 15)
  }
  else if (batch == 3) {
    fetchNews(15, 20)
  }
  else if (batch == 4) {
    fetchNews(20, 25)
  }
  else if (batch == 5) {
    fetchNews(25, 30)
  }
  else return
}

function displayResult(result) {
  let tr = document.createElement('tr');
  let tdSN = document.createElement('td')
  let tdUpvote = document.createElement('td')
  let tdUpvoteImg = document.createElement('img')
  let tdStory = document.createElement('td')
  let tdDiv = document.createElement("div")
  let tdSuper = document.createElement("div")
  let tdSuperSpan = document.createElement('a')
  let tdSuperSubspan = document.createElement('a')
  let tdSub = document.createElement("div")

  let tdSNText = document.createTextNode(`${index}.`);
  let tdSuperSpanText = document.createTextNode(result.title)
  let tdSuperSubspanText = document.createTextNode(` (${cutLink(result.url)})`)
  let tdSubText = document.createTextNode(`${result.score} points by ${result.by} ${getHours(result.time)} hours ago | hide | ${result.descendants} comments`)

  tr.classList.add("table__tr")
  tdSN.classList.add('table__td', 'table__td--right')
  tdDiv.classList.add('table__div')
  tdSuper.classList.add('table__td', 'table__div--supertext')
  tdSub.classList.add('table__div--subtext')
  tdSuperSubspan.classList.add('table__div--subtext')

  tdUpvoteImg.src = './upvote.gif'
  tdUpvoteImg.alt = 'Upvote Arrow'
  tdUpvoteImg.width = '10'

  tdSuperSpan.href = result.url
  tdSuperSubspan.href = `https://${cutLink(result.url)}`

  tdSN.appendChild(tdSNText)
  tdUpvote.appendChild(tdUpvoteImg)
  tdSub.appendChild(tdSubText)
  tdSuperSpan.appendChild(tdSuperSpanText)
  tdSuperSubspan.appendChild(tdSuperSubspanText)
  tdSuper.appendChild(tdSuperSpan)
  tdSuper.appendChild(tdSuperSubspan)
  tdDiv.appendChild(tdSuper)
  tdDiv.appendChild(tdSub)
  tdStory.appendChild(tdDiv)

  tr.appendChild(tdSN)
  tr.appendChild(tdUpvote)
  tr.appendChild(tdStory)

  output.append(tr);
  index++
}

function cutLink(link) {
  let newLink = link.substr(link.indexOf('://') + 3)
  newLink = newLink.substr(0, newLink.indexOf('/'))
  if (newLink.startsWith('www.')) return newLink.substr(4)
  return newLink
}

function getHours(resultTime) {
  let newDate = new Date(today - new Date(resultTime))
  return newDate.getHours()
}