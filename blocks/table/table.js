export default async function decorate(block) {
  const members = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement("div");
  parentDiv.id = "card-wrapper";
  parentDiv.append(...block.children);
  block.append(parentDiv);

  const paginationDiv = document.createElement("div");
  paginationDiv.id = "pagination-controls";
  block.append(paginationDiv);

  let offset = 0;
  const limit = 5; // Number of items per page

  async function fetchMembersData(offset, limit) {
    try {
      const url = new URL(members.href);
      url.searchParams.set("offset", offset);
      url.searchParams.set("limit", limit);

      const response = await fetch(url);
      const data = await response.json();

      return data.data;
    } catch (error) {
      console.error("Failed to fetch members data:", error);
      return [];
    }
  }

  function createCardLayout(data) {
    const cardWrapper = document.querySelector("#card-wrapper");
    if (!cardWrapper) {
      console.error("Card container not found!");
      return;
    }
    cardWrapper.innerHTML = "";
    data.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      Object.entries(item).forEach(([key, value]) => {
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        cardContent.innerHTML = `<strong>${key}:</strong> ${value}`;
        card.appendChild(cardContent);
      });
      cardWrapper.appendChild(card);
    });
  }

  function updatePaginationControls(totalItems) {
    const paginationControls = document.querySelector("#pagination-controls");
    if (!paginationControls) {
      console.error("Pagination container not found!");
      return;
    }

    paginationControls.innerHTML = "";
    const totalPages = Math.ceil(totalItems / limit);
    for (let i = 0; i < totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i + 1;
      pageButton.classList.add("pagination-button");
      pageButton.addEventListener("click", () => {
        offset = i * limit;
        loadData();
      });
      paginationControls.appendChild(pageButton);
    }
  }
  async function loadData() {
    const data = await fetchMembersData(offset, limit);
    createCardLayout(data);
    updatePaginationControls(14); // Assuming 100 items as a placeholder. Replace with actual total if available.
  }

  loadData();
}
