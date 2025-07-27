let jobLinks = document.querySelectorAll(".job-card-container__link");
let jobDescriptions = [];
let index = 0;
let pageNumber = 1;  // Start from Page 1

function scrapeJob() {
  if (index < jobLinks.length) {
    const jobCard = jobLinks[index].closest(".job-card-container");
    if (jobCard) {
      const jobTitle =
        jobCard.querySelector(".job-card-list__title")?.innerText.trim() ||
        "Title not found";
      const jobCompany =
        jobCard
          .querySelector(".job-card-container__primary-description")
          ?.innerText.trim() || "Company not found";
      const jobLocation =
        jobCard
          .querySelector(".job-card-container__metadata-item")
          ?.innerText.trim() || "Location not found";
      const jobLink = jobLinks[index].href;

      jobDescriptions.push({
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        link: jobLink,
      });

      index++;
      scrapeJob();
    } else {
      console.error("Job card not found");
      index++;
      scrapeJob();
    }
  } else {
    goToNextPage();
  }
}

function goToNextPage() {
  pageNumber++;
  const nextPageButton = document.querySelector(`button[aria-label="Page ${pageNumber}"]`);

  if (nextPageButton) {
    nextPageButton.click();
    console.log(`Navigating to Page ${pageNumber}`);

    setTimeout(() => {
      jobLinks = document.querySelectorAll(".job-card-container__link");
      index = 0;
      scrapeJob();
    }, 5000); // Wait for the page to load
  } else {
    console.log(`No next page button found. Stopping at Page ${pageNumber}.`);
    downloadCSV();
  }
}

function downloadCSV() {
  const csvRows = [];
  csvRows.push("Title,Company,Location,Link");

  for (const job of jobDescriptions) {
    csvRows.push(
      `"${job.title.replace(/"/g, '""')}","${job.company.replace(
        /"/g,
        '""'
      )}","${job.location.replace(/"/g, '""')}","${job.link.replace(
        /"/g,
        '""'
      )}"`
    );
  }

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "job_descriptions.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Start scraping
scrapeJob();
