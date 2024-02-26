import displayResultsPage from './resultsPage.js';
import displayVotePage from './votePage.js';
import displayCreatePollPage from './createPollPage.js';

window.onload = function () {
  const path = window.location.pathname.split('/').filter(Boolean);

  if (path.length === 1) {
    displayResultsPage(path[0]);
  } else if (path.length === 2 && path[1] === 'vote') {
    displayVotePage(path[0]);
  } else {
    displayCreatePollPage();
  }
};
