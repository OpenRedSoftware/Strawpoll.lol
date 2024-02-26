import { ref, get, runTransaction } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { db } from '../database.js'; 

export function displayVotePage(pollId) {
  if (!pollId) {
    document.getElementById('content').innerHTML = 'Poll ID is required.';
    return;
  }

  // Retrieve the poll data from Firebase
  const pollRef = ref(db, 'polls/' + pollId);
  get(pollRef).then((snapshot) => {
    if (snapshot.exists()) {
      const pollData = snapshot.val();

      document.title = pollData.question + " - Vote now on Strawpoll.lol";

      let html = `<h1>${pollData.question}</h1>`;
      pollData.options.forEach((option, index) => {
        html += `
          <label class="vote-option" for="option${index}">
            <input type="radio" id="option${index}" name="vote" value="${option}">
            ${option}
          </label>
        `;
      });
      html += `<button id="submitVoteButton" style="margin-right: 0.5rem;">Vote</button>`;
      html += `<button id="goResultsButton">Results</button>`;

      document.getElementById('content').innerHTML = html;

      document.getElementById('submitVoteButton').addEventListener('click', () => submitVote(pollId));
      document.getElementById('goResultsButton').addEventListener('click', () => window.location.href = `/${pollId}`);
    } else {
      document.getElementById('content').innerHTML = 'Poll not found.';
    }
  }).catch((error) => {
    console.error(error);
  });
}

function submitVote(pollId) {
  const voteButton = document.getElementById('submitVoteButton');
  voteButton.disabled = true;
  const selectedOption = document.querySelector('input[name="vote"]:checked').value;
  const voteRef = ref(db, `polls/${pollId}/votes/${selectedOption}`);

  runTransaction(voteRef, (currentVotes) => {
    return (currentVotes || 0) + 1;
  }).then(() => {
    window.location.href = `/${pollId}`;
  }).catch((error) => {
    console.error('Error submitting vote: ', error);
  }).finally(() => {
    voteButton.disabled = false;
  });
}
