import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { db } from '../database.js';

export function displayResultsPage(pollId) {
  const contentDiv = document.getElementById('content');

  const pollRef = ref(db, 'polls/' + pollId);
  onValue(pollRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.title = data.question + " - See results on Strawpoll.lol";

      // Calculate total votes
      const totalVotes = Object.values(data.votes).reduce((total, num) => total + num, 0);

      // Check if totalVotes is greater than zero
      if (totalVotes > 0) {
        contentDiv.innerHTML = '';
        // Create results header
        const header = document.createElement('h1');
        header.textContent = data.question;
        contentDiv.appendChild(header);

        // Create a list to display poll results
        const list = document.createElement('ul');

        // Iterate through each vote option to create list items
        for (const [option, votes] of Object.entries(data.votes)) {
          const item = document.createElement('li');
          const percentage = votes * 100 / totalVotes;
          const bar = document.createElement('div');
          bar.className = 'poll-bar';
          bar.style.width = `${percentage}%`;
          const text = document.createElement('span');
          text.className = 'poll-text';
          text.textContent = `${option}: ${votes} votes (${percentage.toFixed(2)}%)`;
          item.appendChild(bar);
          item.appendChild(text);
          list.appendChild(item);
        }
        contentDiv.appendChild(list);
        contentDiv.innerHTML += `<button id="goVotePageButton" onclick="window.location.href='/${pollId}/vote'">Vote</button>`;
      } else {
        // Display a message if there are no votes
        contentDiv.innerHTML = 'No votes have been cast yet.';
      }
    } else {
      contentDiv.innerHTML = 'Poll not found.';
    }
  }, {
    onlyOnce: true
  });
}


