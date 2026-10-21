const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function isValidRepository(repository) {
  if (!repository || typeof repository !== "object") {
    return false;
  }

  if (typeof repository.name !== "string" || !repository.name.trim()) {
    return false;
  }

  if (typeof repository.url !== "string") {
    return false;
  }

  try {
    new URL(repository.url);
  } catch {
    return false;
  }

  return true;
}

function formatStarredDate(starredAt) {
  if (!starredAt || typeof starredAt !== "string") {
    return "";
  }

  const date = new Date(`${starredAt}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  const validRepositories = repositories.filter(isValidRepository);

  for (const repository of validRepositories) {
    const item = document.createElement("li");
    item.className = "repository-item";

    const link = document.createElement("a");
    link.className = "repository-name";
    link.href = repository.url;
    link.textContent = repository.name.trim();

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = typeof repository.description === "string" ? repository.description : "";
    if (!description.textContent) {
      description.hidden = true;
    }

    const metadata = document.createElement("div");
    metadata.className = "repository-meta";

    if (repository.language) {
      const language = document.createElement("span");
      language.className = "repository-language";
      language.textContent = repository.language;
      metadata.append(language);
    }

    const formattedDate = formatStarredDate(repository.starredAt);
    if (formattedDate) {
      const date = document.createElement("time");
      date.dateTime = repository.starredAt;
      date.textContent = `Starred ${formattedDate}`;
      metadata.append(date);
    }

    item.append(link, description, metadata);
    repositoryList.append(item);
  }
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.repositories)) {
      throw new Error("Repository data must be an array.");
    }

    renderRepositories(data.repositories);
    listStatus.textContent = data.repositories.some(isValidRepository)
      ? ""
      : "No starred repositories yet.";
  } catch {
    listStatus.textContent = "Repositories could not be loaded. Please try again.";
  }
}

loadRepositories();
