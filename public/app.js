window.onload = async function () {
  const path = window.location.pathname.split('/').filter(Boolean);

  if (path.length === 1) {
    const { displayResultsPage } = await import('./createResultsPage/resultsPage.js');
    displayResultsPage(path[0]);
  } else if (path.length === 2 && path[1] === 'vote') {
    const { displayVotePage } = await import('./createVotePage/votePage.js');
    displayVotePage(path[0]);
  } else {
    const { displayCreatePollPage } = await import('./createPollPage/createPollPage.js');
    displayCreatePollPage();
  }
};
