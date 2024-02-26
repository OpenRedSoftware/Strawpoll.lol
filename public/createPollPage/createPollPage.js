import { ref, set, runTransaction } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { db } from '../database.js';

export function displayCreatePollPage() {
  // Set up event listeners
  document.getElementById('addOptionButton').addEventListener('click', addOption);
  document.getElementById('createPollForm').addEventListener('submit', createPoll);
}


function addOption() {
  const pollOptionsDiv = document.getElementById('pollOptions');
  const newOptionIndex = pollOptionsDiv.getElementsByClassName('poll-option').length + 1;
  const newOptionInput = document.createElement('input');
  newOptionInput.type = 'text';
  newOptionInput.className = 'poll-option';
  newOptionInput.placeholder = `Option ${newOptionIndex}`;
  pollOptionsDiv.appendChild(newOptionInput);
}

async function createPoll(event) {
  event.preventDefault();
  const createButton = document.getElementById('createPollButton');
  createButton.disabled = true; // Disable the button during the async operation
  const pollQuestion = document.getElementById('pollQuestion').value;
  const optionElements = document.getElementsByClassName('poll-option');
  const options = Array.from(optionElements).map(option => option.value.trim()).filter(Boolean);

  getNewPollId().then((pollId) => {
    const newPoll = {
      id: pollId,
      question: pollQuestion,
      options: options,
      votes: options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {})
    };
    const pollRef = ref(db, 'polls/' + pollId);
    return set(pollRef, newPoll).then(() => pollId); // Return pollId for the next .then()
  }).then((pollId) => {
    window.location.href = `/${pollId}/vote`;
  }).catch((error) => {
    console.error('Error creating poll: ', error);
  }).finally(() => {
    createButton.disabled = false; // Re-enable the button after the operation
  });
}

async function getNewPollId() {
  const pollIdRef = ref(db, 'nextPollId');
  return runTransaction(pollIdRef, (currentId) => {
    return (currentId || 0) + 1;
  }).then((transaction) => {
    console.log("Updated poll ID to: ", transaction.snapshot.val());
    return transaction.snapshot.val();
  }).catch((error) => {
    console.error('Transaction failed: ', error);
  });
}
