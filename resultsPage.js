import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { db } from './database.js'; 

export default function displayResultsPage(pollId) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = ''; // Clear previous content

  const pollRef = ref(db, 'polls/' + pollId);
  onValue(pollRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.title = data.question + " - See results on Strawpoll.lol";

      // Calculate total votes
      const totalVotes = Object.values(data.votes).reduce((total, num) => total + num, 0);

      // Check if totalVotes is greater than zero
      if (totalVotes > 0) {
        // Create results header
        const header = document.createElement('h1');
        header.textContent = data.question;
        contentDiv.appendChild(header);

        // Create a list to display poll results
        const list = document.createElement('ul');
        for (const [option, votes] of Object.entries(data.votes)) {
          const item = document.createElement('li');
          item.style.cssText = `
  display: flex;
  align-items: center; /* Vertically centers the flex items */
  position: relative;
  min-height: 36px;
  background: #fff7e6;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
          const percentage = votes * 100 / totalVotes;
          const bar = document.createElement('div');
          bar.style.cssText = `
    width: ${percentage}%;
    background-color: #f0f0f0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1;
    border-radius: 5px 0 0 5px; /* Rounded corners on the left side */
  `; // Adjusted color and added border-radius

          const text = document.createElement('span');
          text.textContent = `${option}: ${votes} votes (${percentage.toFixed(2)}%)`;
          text.style.cssText = `
  z-index: 2;
  margin-left: 10px; /* Replaces the 'left' property */
  color: #000;
  font-weight: normal;
  white-space: nowrap;
`;
          item.appendChild(bar);
          item.appendChild(text); // Ensure text is added after the bar so it appears on top
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


