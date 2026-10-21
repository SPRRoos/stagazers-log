const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-item";

    const link = document.createElement("a");
    link.className = "repository-name";
    link.href = repository.url;
    link.textContent = repository.name;

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const metadata = document.createElement("div");
    metadata.className = "repository-meta";

    if (repository.language) {
      const language = document.createElement("span");
      language.className = "repository-language";
      language.textContent = repository.language;
      metadata.append(language);
    }

    if (repository.starredAt) {
      const date = document.createElement("time");
      date.dateTime = repository.starredAt;
      date.textContent = `Starred ${new Date(`${repository.starredAt}T00:00:00`).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })}`;
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
    listStatus.textContent = data.repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch {
    listStatus.textContent = "Repositories could not be loaded. Please try again.";
  }
}

loadRepositories();